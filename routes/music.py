# routes/music.py
"""
Music routes — powered by JioSaavn (via saavn.dev, no API key needed).
YouTube is used as a fallback for search when JioSaavn returns no results.
Stream URLs are fetched fresh at play-time (they expire in ~15 min).
"""
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
import requests
import os

bp = Blueprint("music", __name__)

SAAVN_BASE = "https://saavn.sumit.co/api"
YT_API_KEY = os.getenv("YOUTUBE_API_KEY", "")

import json
import re
import threading
from datetime import datetime, timedelta, timezone

CONFIG_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "config", "language_charts.json")

def validate_config_startup():
    if os.path.exists(CONFIG_PATH):
        try:
            with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                data = json.load(f)
            for lang, val in data.items():
                if val is None:
                    print(f"[WARN] Startup Validation: language chart '{lang}' is configured as null. It will be hidden in UI.")
        except Exception as e:
            print(f"[ERROR] Startup Validation: Failed to read {CONFIG_PATH}: {e}")
    else:
        print(f"[WARN] Startup Validation: {CONFIG_PATH} not found.")

validate_config_startup()

_mongo_client = None

def get_db():
    global _mongo_client
    if _mongo_client is None:
        from pymongo import MongoClient
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        _mongo_client = MongoClient(mongo_uri)
    db_name = os.getenv('DB_NAME', 'lyrica_music')
    return _mongo_client[db_name]

def get_cached_chart(chart_type, language=None):
    db = get_db()
    query = {"chartType": chart_type, "language": language}
    return db.charts.find_one(query)

def is_cache_fresh(chart_doc, fresh_hours):
    if not chart_doc or "lastUpdated" not in chart_doc:
        return False
    last_updated = chart_doc["lastUpdated"]
    if last_updated.tzinfo is not None:
        last_updated = last_updated.astimezone(timezone.utc).replace(tzinfo=None)
    now = datetime.utcnow()
    return (now - last_updated) < timedelta(hours=fresh_hours)

def update_chart_in_background(chart_type, language=None):
    thread = threading.Thread(target=perform_chart_update, args=(chart_type, language))
    thread.daemon = True
    thread.start()

def fuzzy_match_apple_track(title, artist):
    query = f"{title} {artist}"
    try:
        r = requests.get(f"{SAAVN_BASE}/search/songs", params={"query": query, "limit": 3}, timeout=5)
        if r.ok:
            data = r.json()
            songs = data.get("data", {}).get("results", [])
            for song in songs:
                s_title = song.get("name", "").lower()
                s_title_clean = re.sub(r"\(feat\..*?\)", "", s_title)
                s_title_clean = re.sub(r"\(with.*?\)", "", s_title_clean)
                s_title_clean = re.sub(r"\-.*", "", s_title_clean).strip()
                
                orig_title_clean = re.sub(r"\(feat\..*?\)", "", title.lower())
                orig_title_clean = re.sub(r"\(with.*?\)", "", orig_title_clean)
                orig_title_clean = re.sub(r"\-.*", "", orig_title_clean).strip()
                
                s_words = set(re.findall(r"\w+", s_title_clean))
                o_words = set(re.findall(r"\w+", orig_title_clean))
                if not s_words or not o_words:
                    continue
                overlap = len(s_words.intersection(o_words)) / len(o_words)
                if overlap >= 0.7:
                    s_artists = [a.get("name", "").lower() for a in song.get("artists", {}).get("primary", [])]
                    if not s_artists and "primaryArtists" in song:
                        s_artists = [a.strip().lower() for a in song["primaryArtists"].split(",")]
                    
                    orig_artist = artist.lower()
                    artist_match = False
                    for sa in s_artists:
                        if sa in orig_artist or orig_artist in sa:
                            artist_match = True
                            break
                    if artist_match:
                        return _normalize_saavn_song(song)
    except Exception as e:
        print(f"[music] Fuzzy match error for '{query}': {e}")
    return None

def fetch_apple_metadata(apple_ids):
    if not apple_ids:
        return {}
    try:
        ids_str = ",".join(str(i) for i in apple_ids)
        r = requests.get("https://itunes.apple.com/lookup", params={"id": ids_str}, timeout=8)
        if r.ok:
            results = r.json().get("results", [])
            metadata = {}
            for item in results:
                tid = str(item.get("trackId", ""))
                duration_ms = item.get("trackTimeMillis", 0)
                album = item.get("collectionName", "")
                
                # Convert duration_ms to format "m:ss"
                dur_secs = duration_ms // 1000
                mins = dur_secs // 60
                secs = dur_secs % 60
                duration_str = f"{mins}:{secs:02d}"
                
                metadata[tid] = {
                    "duration": duration_str,
                    "duration_secs": dur_secs,
                    "album": album
                }
            return metadata
    except Exception as e:
        print(f"[music] iTunes lookup failed: {e}")
    return {}

def perform_chart_update(chart_type, language=None):
    try:
        print(f"[music] Refreshing chart cache for: type={chart_type}, lang={language}")
        tracks = []
        source = "jiosaavn"
        
        if chart_type == "worldwide":
            source = "apple"
            url = "https://rss.applemarketingtools.com/api/v2/us/music/most-played/50/songs.json"
            r = requests.get(url, timeout=10)
            if r.ok:
                results = r.json().get("feed", {}).get("results", [])
                
                # Fetch Apple metadata in batch!
                apple_ids = [t.get("id", "") for t in results if t.get("id")]
                apple_meta = fetch_apple_metadata(apple_ids)
                
                from concurrent.futures import ThreadPoolExecutor
                
                def match_task(idx_track):
                    idx, track = idx_track
                    title = track.get("name", "")
                    artist = track.get("artistName", "")
                    cover = track.get("artworkUrl100", "").replace("100x100bb.jpg", "500x500bb.jpg")
                    apple_id = str(track.get("id", ""))
                    
                    matched = fuzzy_match_apple_track(title, artist)
                    if matched:
                        matched["rank"] = idx
                        matched["playable"] = True
                        return matched
                    else:
                        meta = apple_meta.get(apple_id, {})
                        return {
                            "rank": idx,
                            "id": f"apple_{apple_id}",
                            "saavn_id": None,
                            "title": title,
                            "artist": artist,
                            "cover": cover,
                            "album": meta.get("album", ""),
                            "duration": meta.get("duration", "0:00"),
                            "duration_secs": meta.get("duration_secs", 0),
                            "source": "saavn",
                            "playable": False
                        }
                
                with ThreadPoolExecutor(max_workers=10) as executor:
                    tracks = list(executor.map(match_task, enumerate(results, 1)))
                        
        elif chart_type == "asia":
            source = "apple"
            storefronts = ["in", "jp", "kr", "id", "ph", "th", "vn", "sg", "my"]
            track_data = {}
            for sf in storefronts:
                sf_url = f"https://rss.applemarketingtools.com/api/v2/{sf}/music/most-played/25/songs.json"
                try:
                    res = requests.get(sf_url, timeout=5)
                    if res.ok:
                        results = res.json().get("feed", {}).get("results", [])
                        for rank, track in enumerate(results, 1):
                            title = track.get("name", "")
                            artist = track.get("artistName", "")
                            cover = track.get("artworkUrl100", "").replace("100x100bb.jpg", "500x500bb.jpg")
                            apple_id = track.get("id", "")
                            
                            key = (title.lower().strip(), artist.lower().strip())
                            if key not in track_data:
                                track_data[key] = {
                                    "title": title,
                                    "artist": artist,
                                    "cover": cover,
                                    "apple_id": apple_id,
                                    "ranks": {}
                                }
                            track_data[key]["ranks"][sf] = rank
                except Exception as ex:
                    print(f"[music] Asia aggregation: storefront {sf} failed: {ex}")
            
            ranked = []
            for key, data in track_data.items():
                freq = len(data["ranks"])
                avg_pos = sum(data["ranks"].values()) / freq
                ranked.append((freq, avg_pos, data))
            
            ranked.sort(key=lambda x: (-x[0], x[1]))
            
            # Fetch Apple metadata in batch!
            apple_ids = [item[2]["apple_id"] for item in ranked[:50] if item[2].get("apple_id")]
            apple_meta = fetch_apple_metadata(apple_ids)
            
            from concurrent.futures import ThreadPoolExecutor
            
            def match_asia_task(idx_item):
                idx, (freq, avg_pos, data) = idx_item
                title = data["title"]
                artist = data["artist"]
                cover = data["cover"]
                apple_id = str(data["apple_id"])
                
                matched = fuzzy_match_apple_track(title, artist)
                if matched:
                    matched["rank"] = idx
                    matched["playable"] = True
                    return matched
                else:
                    meta = apple_meta.get(apple_id, {})
                    return {
                        "rank": idx,
                        "id": f"apple_{apple_id}",
                        "saavn_id": None,
                        "title": title,
                        "artist": artist,
                        "cover": cover,
                        "album": meta.get("album", ""),
                        "duration": meta.get("duration", "0:00"),
                        "duration_secs": meta.get("duration_secs", 0),
                        "source": "saavn",
                        "playable": False
                    }
            
            with ThreadPoolExecutor(max_workers=10) as executor:
                tracks = list(executor.map(match_asia_task, enumerate(ranked[:50], 1)))
                    
        elif chart_type in ("india", "language"):
            source = "jiosaavn"
            playlist_id = None
            if chart_type == "india":
                playlist_id = "1134548194"
                if os.path.exists(CONFIG_PATH):
                    try:
                        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                            cfg = json.load(f)
                            if cfg.get("india"):
                                playlist_id = cfg["india"]
                    except Exception:
                        pass
            else:
                if os.path.exists(CONFIG_PATH):
                    try:
                        with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                            cfg = json.load(f)
                            playlist_id = cfg.get(language)
                    except Exception:
                        pass
            
            if playlist_id:
                r = requests.get(f"{SAAVN_BASE}/playlists?id={playlist_id}", timeout=10)
                if r.ok:
                    songs = r.json().get("data", {}).get("songs", [])
                    for idx, song in enumerate(songs, 1):
                        normalized = _normalize_saavn_song(song)
                        normalized["rank"] = idx
                        normalized["playable"] = True
                        tracks.append(normalized)
            else:
                print(f"[music] No playlist ID configured for language '{language}'")
                return

        db = get_db()
        db.charts.update_one(
            {"chartType": chart_type, "language": language},
            {
                "$set": {
                    "chartType": chart_type,
                    "language": language,
                    "source": source,
                    "tracks": tracks,
                    "lastUpdated": datetime.utcnow()
                }
            },
            upsert=True
        )
        print(f"[music] Cache successfully updated for: type={chart_type}, lang={language}. Total tracks: {len(tracks)}")
    except Exception as e:
        print(f"[music] perform_chart_update error: {e}")

# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _normalize_saavn_song(song: dict) -> dict:
    """Convert a JioSaavn song object into our standard Track shape."""
    # Album art — pick highest quality available
    images = song.get("image", [])
    cover = ""
    if isinstance(images, list) and images:
        last_img = images[-1]
        cover = last_img.get("url", "") if isinstance(last_img, dict) else str(last_img)
    elif isinstance(images, str):
        cover = images

    # Download/stream URLs
    download_urls = song.get("downloadUrl", [])
    stream_url = ""
    if isinstance(download_urls, list) and download_urls:
        for q in ("160kbps", "128kbps", "96kbps", "48kbps"):
            match = next((d for d in download_urls if d.get("quality") == q), None)
            if match:
                stream_url = match.get("url", "")
                break
        if not stream_url:
            last = download_urls[-1]
            stream_url = last.get("url", "") if isinstance(last, dict) else ""

    # Duration
    dur_secs = song.get("duration", 0)
    try:
        dur_secs = int(dur_secs)
    except Exception:
        dur_secs = 0
    mins = dur_secs // 60
    secs = dur_secs % 60
    duration_str = f"{mins}:{secs:02d}"

    # Artist name(s)
    artists = song.get("artists", {})
    if isinstance(artists, dict):
        primary = artists.get("primary", [])
        artist_name = ", ".join(a.get("name", "") for a in primary) if primary else song.get("primaryArtists", "Unknown")
    else:
        artist_name = song.get("primaryArtists", song.get("singers", "Unknown"))
        if isinstance(artist_name, list):
            artist_name = ", ".join(artist_name)

    album_name = ""
    album_data = song.get("album", "")
    if isinstance(album_data, dict):
        album_name = album_data.get("name", "")
    elif isinstance(album_data, str):
        album_name = album_data

    return {
        "id": f"saavn_{song.get('id', '')}",
        "rawId": song.get("id", ""),
        "saavn_id": song.get("id", ""),
        "type": "track",
        "title": song.get("name", song.get("title", "Unknown")),
        "artist": artist_name,
        "album": album_name,
        "cover": cover,
        "duration": duration_str,
        "duration_secs": dur_secs,
        "source": "saavn",
        "stream_url": stream_url,
        "language": song.get("language", ""),
    }


def _normalize_saavn_album(album: dict) -> dict:
    images = album.get("image", [])
    cover = ""
    if isinstance(images, list) and images:
        last_img = images[-1]
        cover = last_img.get("url", "") if isinstance(last_img, dict) else str(last_img)
    elif isinstance(images, str):
        cover = images

    artists = album.get("artists", {})
    if isinstance(artists, dict):
        primary = artists.get("primary", [])
        artist_name = ", ".join(a.get("name", "") for a in primary) if primary else "Various Artists"
    else:
        artist_name = album.get("primaryArtists", "Various Artists")
        if isinstance(artist_name, list):
            artist_name = ", ".join(artist_name)

    return {
        "id": f"saavn_album_{album.get('id', '')}",
        "rawId": album.get("id", ""),
        "type": "album",
        "title": album.get("name", album.get("title", "Unknown")),
        "subtitle": artist_name,
        "cover": cover,
        "source": "saavn",
        "year": album.get("year", "")
    }


def _normalize_saavn_playlist(playlist: dict) -> dict:
    images = playlist.get("image", [])
    cover = ""
    if isinstance(images, list) and images:
        last_img = images[-1]
        cover = last_img.get("url", "") if isinstance(last_img, dict) else str(last_img)
    elif isinstance(images, str):
        cover = images
        
    return {
        "id": f"saavn_playlist_{playlist.get('id', '')}",
        "rawId": playlist.get("id", ""),
        "type": "playlist",
        "title": playlist.get("name", playlist.get("title", "Unknown")),
        "subtitle": f"Playlist • {playlist.get('subtitle', 'JioSaavn')}",
        "cover": cover,
        "source": "saavn"
    }


def _normalize_saavn_artist(artist: dict) -> dict:
    images = artist.get("image", [])
    cover = ""
    if isinstance(images, list) and images:
        last_img = images[-1]
        cover = last_img.get("url", "") if isinstance(last_img, dict) else str(last_img)
    elif isinstance(images, str):
        cover = images
        
    return {
        "id": f"saavn_artist_{artist.get('id', '')}",
        "rawId": artist.get("id", ""),
        "type": "artist",
        "title": artist.get("name", artist.get("title", "Unknown")),
        "subtitle": artist.get("description", "Artist"),
        "cover": cover,
        "source": "saavn"
    }


def _yt_search_unified(query: str, type_param: str, limit: int = 20) -> list:
    if not YT_API_KEY:
        print("[music] YouTube API key is missing.")
        return []

    yt_type = "video"
    video_category = None
    q_suffix = ""
    
    if type_param == "tracks":
        yt_type = "video"
        video_category = "10"  # Music category
    elif type_param == "playlists":
        yt_type = "playlist"
    elif type_param == "artists":
        yt_type = "channel"
    elif type_param == "albums":
        yt_type = "playlist"
        q_suffix = " album"
    else:  # 'all'
        yt_type = "video,playlist,channel"

    full_query = query + q_suffix
    
    try:
        url = "https://www.googleapis.com/youtube/v3/search"
        params = {
            "part": "snippet",
            "type": yt_type,
            "q": full_query,
            "key": YT_API_KEY,
            "maxResults": min(limit * 2, 40),
        }
        if video_category and yt_type == "video":
            params["videoCategoryId"] = video_category

        r = requests.get(url, params=params, timeout=10)
        
        # Fallback trigger: return empty list on quota/other API failures
        if r.status_code == 403:
            print("[music] YouTube API rate limit exceeded or forbidden (403).")
            return []
        if not r.ok:
            print(f"[music] YouTube API error: {r.status_code} {r.text}")
            return []

        items = r.json().get("items", [])
        results = []
        
        exclude_album_keywords = ["best of", "greatest hits", "playlist", "mix", "collection", "hits", "fan-made"]
        
        for item in items:
            kind = item.get("id", {}).get("kind", "")
            snippet = item.get("snippet", {})
            title = snippet.get("title", "")
            title_lower = title.lower()
            channel_title = snippet.get("channelTitle", "")
            thumb = snippet.get("thumbnails", {}).get("medium", {}).get("url", "") or snippet.get("thumbnails", {}).get("default", {}).get("url", "")
            
            if "youtube#video" in kind:
                vid = item["id"]["videoId"]
                results.append({
                    "id": f"yt_{vid}",
                    "rawId": vid,
                    "type": "track",
                    "title": title,
                    "subtitle": channel_title.replace(" - Topic", "") if channel_title.endswith(" - Topic") else channel_title,
                    "cover": thumb,
                    "source": "youtube",
                    "videoId": vid,
                    "duration": "0:00"
                })
            
            elif "youtube#channel" in kind:
                cid = item["id"]["channelId"]
                results.append({
                    "id": f"yt_artist_{cid}",
                    "rawId": cid,
                    "type": "artist",
                    "title": title,
                    "subtitle": "Artist • YouTube",
                    "cover": thumb,
                    "source": "youtube"
                })
                
            elif "youtube#playlist" in kind:
                pid = item["id"]["playlistId"]
                
                if type_param == "albums":
                    has_album_kw = any(kw in title_lower for kw in ["album", "ep", "lp", "l.p."])
                    has_exclude_kw = any(kw in title_lower for kw in exclude_album_keywords)
                    
                    if not has_album_kw or has_exclude_kw:
                        continue
                    
                    results.append({
                        "id": f"yt_album_{pid}",
                        "rawId": pid,
                        "type": "album",
                        "title": title.replace(" - Album", "").replace(" album", ""),
                        "subtitle": channel_title,
                        "cover": thumb,
                        "source": "youtube"
                    })
                else:
                    results.append({
                        "id": f"yt_playlist_{pid}",
                        "rawId": pid,
                        "type": "playlist",
                        "title": title,
                        "subtitle": f"Playlist • {channel_title}",
                        "cover": thumb,
                        "source": "youtube"
                    })

        return results[:limit]
    except Exception as e:
        print(f"[music] YouTube search error: {e}")
        return []


def _yt_search_fallback(query: str, limit: int = 10) -> list:
    """Fallback search targeting tracks specifically."""
    return _yt_search_unified(query, "tracks", limit)


@bp.route("/search", methods=["GET"])
def search_tracks():
    """
    Search endpoint that serves JioSaavn or YouTube results, normalized and cached.
    GET /api/music/search?q=<query>&limit=20&source=<saavn|youtube>&type=<all|tracks|albums|playlists|artists>
    """
    query = request.args.get("q", "").strip()
    source_param = request.args.get("source", "saavn").strip().lower()
    type_param = request.args.get("type", "all").strip().lower()
    limit = min(int(request.args.get("limit", 20)), 30)

    if not query:
        return jsonify({"results": [], "source": "none"}), 200

    # Retrieve database and ensure TTL index on search cache
    db = get_db()
    db.search_cache.create_index("createdAt", expireAfterSeconds=3600)

    # Lookup cache
    cache_key = f"{query.lower().strip()}:{source_param}:{type_param}"
    cached_doc = db.search_cache.find_one({"key": cache_key})
    if cached_doc:
        return jsonify({
            "results": cached_doc["results"],
            "source": cached_doc["source"],
            "cached": True
        }), 200

    results = []
    actual_source = source_param

    # --- YouTube / YT Music Mode ---
    if source_param == "youtube":
        print(f"[music] YT Music search: q='{query}', type='{type_param}'")
        results = _yt_search_unified(query, type_param, limit)
        # Quota/Fallback check: If YouTube fails, automatically fallback to JioSaavn
        if not results:
            print(f"[music] YouTube search empty or failed. Falling back to JioSaavn for '{query}'")
            actual_source = "saavn"

    # --- JioSaavn Mode / Fallback ---
    if actual_source == "saavn":
        try:
            if type_param == "all":
                # Multi-type search
                r = requests.get(f"{SAAVN_BASE}/search", params={"query": query}, timeout=10)
                if r.ok:
                    data = r.json().get("data", {}) or {}
                    # Normalize each category
                    songs_data = (data.get("songs") or {}).get("results", [])
                    albums_data = (data.get("albums") or {}).get("results", [])
                    playlists_data = (data.get("playlists") or {}).get("results", [])
                    artists_data = (data.get("artists") or {}).get("results", [])

                    norm_songs = [_normalize_saavn_song(s) for s in songs_data[:8]]
                    norm_albums = [_normalize_saavn_album(a) for a in albums_data[:6]]
                    norm_playlists = [_normalize_saavn_playlist(p) for p in playlists_data[:6]]
                    norm_artists = [_normalize_saavn_artist(art) for art in artists_data[:6]]

                    results = norm_songs + norm_albums + norm_playlists + norm_artists
            elif type_param == "tracks":
                r = requests.get(f"{SAAVN_BASE}/search/songs", params={"query": query, "limit": limit}, timeout=10)
                if r.ok:
                    songs = r.json().get("data", {}).get("results", [])
                    results = [_normalize_saavn_song(s) for s in songs]
            elif type_param == "albums":
                r = requests.get(f"{SAAVN_BASE}/search/albums", params={"query": query, "limit": limit}, timeout=10)
                if r.ok:
                    albums = r.json().get("data", {}).get("results", [])
                    results = [_normalize_saavn_album(a) for a in albums]
            elif type_param == "playlists":
                r = requests.get(f"{SAAVN_BASE}/search/playlists", params={"query": query, "limit": limit}, timeout=10)
                if r.ok:
                    playlists = r.json().get("data", {}).get("results", [])
                    results = [_normalize_saavn_playlist(p) for p in playlists]
            elif type_param == "artists":
                r = requests.get(f"{SAAVN_BASE}/search/artists", params={"query": query, "limit": limit}, timeout=10)
                if r.ok:
                    artists = r.json().get("data", {}).get("results", [])
                    results = [_normalize_saavn_artist(art) for art in artists]
        except Exception as e:
            print(f"[music] JioSaavn search error: {e}")

    # Write cache
    try:
        db.search_cache.update_one(
            {"key": cache_key},
            {
                "$set": {
                    "key": cache_key,
                    "results": results,
                    "source": actual_source,
                    "createdAt": datetime.now(timezone.utc)
                }
            },
            upsert=True
        )
    except Exception as e:
        print(f"[music] Cache write error: {e}")

    return jsonify({
        "results": results,
        "source": actual_source,
        "cached": False
    }), 200



@bp.route("/stream", methods=["GET"])
def get_stream_url():
    """
    Fetch a fresh CDN stream URL for a JioSaavn song.
    GET /api/music/stream?id=<saavn_song_id>&quality=160kbps
    Returns: { stream_url, quality, expires_in }
    """
    song_id = request.args.get("id", "").strip()
    quality = request.args.get("quality", "160kbps")

    if not song_id:
        return jsonify({"error": "id is required"}), 400

    try:
        r = requests.get(f"{SAAVN_BASE}/songs/{song_id}", timeout=10)
        if not r.ok:
            return jsonify({"error": f"JioSaavn API error: {r.status_code}"}), 502

        data = r.json()
        # saavn.dev wraps in { data: [...] } or { data: {} }
        song_data = data.get("data")
        if isinstance(song_data, list):
            song_data = song_data[0] if song_data else {}
        elif not isinstance(song_data, dict):
            song_data = {}

        download_urls = song_data.get("downloadUrl", [])
        if not download_urls:
            return jsonify({"error": "No stream URLs available for this track"}), 404

        # Find requested quality, fall back down the list
        quality_order = [quality, "160kbps", "128kbps", "96kbps", "48kbps"]
        stream_url = ""
        chosen_quality = ""
        for q in quality_order:
            match = next((d for d in download_urls if d.get("quality") == q), None)
            if match:
                stream_url = match.get("url", "")
                chosen_quality = q
                break

        if not stream_url and download_urls:
            last = download_urls[-1]
            stream_url = last.get("url", "")
            chosen_quality = last.get("quality", "unknown")

        if not stream_url:
            return jsonify({"error": "Could not resolve stream URL"}), 404

        return jsonify({
            "stream_url": stream_url,
            "quality": chosen_quality,
            "expires_in": 900,  # ~15 minutes typical JioSaavn CDN TTL
            "song_id": song_id,
        }), 200

    except Exception as e:
        print(f"[music] /stream error: {e}")
        return jsonify({"error": str(e)}), 500


@bp.route("/tracks/<track_id>", methods=["GET"])
def get_track(track_id):
    """Get a single track's metadata from JioSaavn by ID."""
    try:
        r = requests.get(f"{SAAVN_BASE}/songs/{track_id}", timeout=10)
        if not r.ok:
            return jsonify({"error": "Track not found"}), 404
        data = r.json()
        song_data = data.get("data")
        if isinstance(song_data, list):
            song_data = song_data[0] if song_data else None
        if not song_data:
            return jsonify({"error": "Track not found"}), 404
        return jsonify(_normalize_saavn_song(song_data)), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/featured", methods=["GET"])
def get_featured():
    """Returns multiple themed sections for the Home page."""
    sections = []

    queries = [
        ("Trending Bollywood", "bollywood trending 2024"),
        ("Punjabi Hits", "punjabi hits diljit karan aujla"),
        ("Arijit Singh", "arijit singh romantic hits"),
        ("90s Classics", "90s hindi classic songs"),
    ]

    for label, query in queries:
        try:
            r = requests.get(f"{SAAVN_BASE}/search/songs", params={
                "query": query,
                "limit": 10,
            }, timeout=8)
            if r.ok:
                data = r.json()
                songs = (data.get("data") or {}).get("results", [])
                if songs:
                    sections.append({
                        "title": label,
                        "tracks": [_normalize_saavn_song(s) for s in songs[:8]],
                    })
        except Exception as e:
            print(f"[music] featured section '{label}' error: {e}")

    return jsonify({"sections": sections}), 200


@bp.route("/charts", methods=["GET"])
def get_charts():
    """
    Returns billboard charts (worldwide, asia, india, or language-specific).
    """
    overview = request.args.get("overview", "false").lower() == "true"
    force_refresh = request.args.get("refresh", "false").lower() == "true"
    
    if overview:
        active_langs = []
        if os.path.exists(CONFIG_PATH):
            try:
                with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
                    for lang, val in cfg.items():
                        if val:
                            active_langs.append(lang)
            except Exception:
                pass
        
        charts_to_load = [
            {"type": "worldwide", "language": None, "title": "Worldwide Hot 50", "desc": "Global music trends aggregated daily", "ratio": "16:9"},
            {"type": "asia", "language": None, "title": "Asia Top Hits", "desc": "Cross-storefront hits in Asia storefronts", "ratio": "16:9"},
            {"type": "india", "language": None, "title": "India Superhits Top 50", "desc": "India's highest trending editorial hits", "ratio": "16:9"},
        ]
        for lang in active_langs:
            if lang != "india":
                charts_to_load.append({
                    "type": "language",
                    "language": lang,
                    "title": f"{lang.title()} Top 50",
                    "desc": f"Editorial top hits curated in {lang.title()}",
                    "ratio": "4:5"
                })
                
        results = []
        for chart in charts_to_load:
            c_type = chart["type"]
            c_lang = chart["language"]
            
            cached = get_cached_chart(c_type, c_lang)
            if not cached or force_refresh:
                update_chart_in_background(c_type, c_lang)
                if not cached:
                    # Serve an immediate placeholder so the page loads and charts display instantly
                    if c_type == "worldwide":
                        cover = "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600"
                    elif c_type == "asia":
                        cover = "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=600"
                    elif c_type == "india":
                        cover = "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=600"
                    else:
                        cover = "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=600"
                    
                    results.append({
                        "type": c_type,
                        "language": c_lang,
                        "title": chart["title"],
                        "description": chart["desc"],
                        "ratio": chart["ratio"],
                        "cover": cover,
                        "trackCount": 50
                    })
                    continue
            
            if cached and cached.get("tracks"):
                fresh_hours = 24 if c_type in ("worldwide", "asia") else 6
                if not is_cache_fresh(cached, fresh_hours) and not force_refresh:
                    update_chart_in_background(c_type, c_lang)
                    
                first_track = cached["tracks"][0]
                track_count = len(cached["tracks"])
                title = chart["title"]
                if "50" in title:
                    title = title.replace("50", str(track_count))
                results.append({
                    "type": c_type,
                    "language": c_lang,
                    "title": title,
                    "description": chart["desc"],
                    "ratio": chart["ratio"],
                    "cover": first_track.get("cover") or "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=600",
                    "trackCount": track_count
                })
        return jsonify({"charts": results}), 200

    # Non-overview chart detail fetch
    chart_type = request.args.get("type", "worldwide").lower()
    language = request.args.get("language", None)
    if language:
        language = language.lower()

    # Map region parameter from old code to type if passed
    region = request.args.get("region", None)
    if region:
        region = region.lower()
        if region == "globe":
            chart_type = "worldwide"
        else:
            chart_type = region

    if chart_type not in ("worldwide", "asia", "india", "language"):
        return jsonify({"error": "Invalid chart type"}), 400

    if chart_type == "language":
        if not language:
            return jsonify({"error": "language parameter is required for type=language"}), 400
        if os.path.exists(CONFIG_PATH):
            try:
                with open(CONFIG_PATH, "r", encoding="utf-8") as f:
                    cfg = json.load(f)
                    if not cfg.get(language):
                        return jsonify({"tracks": [], "message": f"Language '{language}' has no configured chart"}), 200
            except Exception:
                return jsonify({"error": "Failed to read config"}), 500
        else:
            return jsonify({"tracks": [], "message": "No charts config available"}), 200

    cached = get_cached_chart(chart_type, language)
    fresh_hours = 24 if chart_type in ("worldwide", "asia") else 6

    if cached and not force_refresh:
        if not is_cache_fresh(cached, fresh_hours):
            update_chart_in_background(chart_type, language)
        return jsonify({"tracks": cached.get("tracks", []), "source": cached.get("source", "jiosaavn")}), 200
    else:
        print(f"[music] No cache found or force refresh requested for {chart_type} (lang={language}). Performing synchronous fetch...")
        perform_chart_update(chart_type, language)
        cached = get_cached_chart(chart_type, language)
        if cached:
            return jsonify({"tracks": cached.get("tracks", []), "source": cached.get("source", "jiosaavn")}), 200
        else:
            return jsonify({"tracks": [], "error": "Failed to fetch chart data"}), 500

