# routes/artist_routes.py
import random
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone, timedelta
from models.artist import ArtistModel
from utils.artist_aggregator import seed_database, trigger_background_refresh, SEED_ARTISTS_METADATA, EMOTION_KEYWORDS

artist_bp = Blueprint("artist", __name__)

# Adjacency transitions for emotion journey BFS
EMOTION_TRANSITIONS = {
    "euphoric":   ["hopeful", "romantic"],
    "hopeful":    ["nostalgic", "romantic"],
    "nostalgic":  ["melancholy", "hopeful"],
    "melancholy": ["dark", "nostalgic"],
    "dark":       ["angry", "melancholy"],
    "angry":      ["defiant", "dark"],
    "defiant":    ["euphoric", "angry"],
    "romantic":   ["euphoric", "nostalgic"]
}

@artist_bp.route("/health", methods=["GET"])
def get_health_stats():
    """
    Get backend status, processing queues, database counts, and source health metrics.
    """
    # Initialize/seed database first to setup collections
    seed_database()
    db = ArtistModel.get_db()
    
    # Query database counts
    artists_count = db.artists.count_documents({})
    albums_count = db.albums.count_documents({})
    songs_count = db.songs.count_documents({})
    lyrics_count = db.lyrics.count_documents({})
    synced_count = db.lyrics.count_documents({"hasSynced": True})
    graph_count = db.artist_graph.count_documents({})
    analytics_count = db.artist_analytics.count_documents({})
    
    # Query queue counts
    queue_pending = db.aggregation_queue.count_documents({"status": "pending"})
    queue_running = db.aggregation_queue.count_documents({"status": "running"})
    queue_complete = db.aggregation_queue.count_documents({"status": "complete"})
    queue_failed = db.aggregation_queue.count_documents({"status": "failed"})
    
    # Query source health metrics
    health_docs = list(db.source_health.find())
    source_health = {}
    for doc in health_docs:
        source_health[doc["source"]] = {
            "lastRequest": doc.get("lastRequest").isoformat() if doc.get("lastRequest") else None,
            "requestsToday": doc.get("requestsToday", 0),
            "successCount": doc.get("successCount", 0),
            "failureCount": doc.get("failureCount", 0),
            "isRateLimited": doc.get("isRateLimited", False)
        }

    return jsonify({
        "status": "online",
        "counts": {
            "artists": artists_count,
            "albums": albums_count,
            "songs": songs_count,
            "lyrics": lyrics_count,
            "syncedLyrics": synced_count,
            "graphEdges": graph_count,
            "analytics": analytics_count
        },
        "queue": {
            "pending": queue_pending,
            "running": queue_running,
            "complete": queue_complete,
            "failed": queue_failed
        },
        "sourceHealth": source_health,
        "aggregatedArtists": queue_complete,
        "pendingArtists": queue_pending,
        "artist_aliases": {
            "count": db.artist_aliases.count_documents({})
        },
        "artist_graph": {
            "count": graph_count
        },
        "source_health": source_health
    }), 200


@artist_bp.route("/<artist_id>", methods=["GET"])
def get_artist_profile(artist_id):
    """
    Get core artist metadata. If not present in DB, seeds it and triggers background refresh.
    If cache is older than 7 days, triggers background refresh.
    Returns cached metadata immediately.
    """
    seed_database()
    db = ArtistModel.get_db()
    artist = db.artists.find_one({"artistId": artist_id})

    if not artist:
        # Check alias redirect
        alias_doc = db.artist_aliases.find_one({"alias": artist_id.lower()})
        if alias_doc:
            artist = db.artists.find_one({"artistId": alias_doc["artistId"]})
            
    if not artist:
        # Enqueue new unknown artist MBID or slug to aggregation queue
        trigger_background_refresh(artist_id)
        artist = db.artists.find_one({"artistId": artist_id})
        if not artist:
            return jsonify({"error": "Artist not found. Enqueued for background aggregation."}), 404

    # Cache expiration check (7 days)
    last_updated = artist.get("lastAggregated")
    if last_updated:
        if hasattr(last_updated, "tzinfo") and last_updated.tzinfo is not None:
            now = datetime.now(timezone.utc)
        else:
            now = datetime.utcnow()
        
        if (now - last_updated) > timedelta(days=7):
            trigger_background_refresh(artist_id)

    # Clean object ID for JSON serialization
    artist["_id"] = str(artist["_id"])
    return jsonify(artist), 200


@artist_bp.route("/<artist_id>/analytics", methods=["GET"])
def get_artist_analytics(artist_id):
    """
    Get lyrical DNA, essence, wall, and timeline statistics.
    """
    seed_database()
    db = ArtistModel.get_db()
    analytics = db.artist_analytics.find_one({"artistId": artist_id})

    if not analytics:
        return jsonify({"error": "Analytics not found"}), 404

    analytics["_id"] = str(analytics["_id"])
    return jsonify(analytics), 200


@artist_bp.route("/<artist_id>/songs", methods=["GET"])
def get_artist_songs(artist_id):
    """
    Get songs belonging to an artist.
    """
    seed_database()
    db = ArtistModel.get_db()
    songs = list(db.songs.find({"artistId": artist_id}))
    for s in songs:
        s["_id"] = str(s["_id"])
    return jsonify({"songs": songs}), 200


@artist_bp.route("/<artist_id>/albums", methods=["GET"])
def get_artist_albums(artist_id):
    """
    Get albums belonging to an artist.
    """
    seed_database()
    db = ArtistModel.get_db()
    albums = list(db.albums.find({"artistId": artist_id}))
    for a in albums:
        a["_id"] = str(a["_id"])
    return jsonify({"albums": albums}), 200


@artist_bp.route("/<artist_id>/graph/neighbors", methods=["GET"])
def get_graph_neighbors(artist_id):
    """
    Lazy hydration for the Universe Explorer node graph.
    Returns connected node relationships.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    # Find edges matching artist_id as source or target
    edges = list(db.artist_graph.find({"$or": [{"source": artist_id}, {"target": artist_id}]}))
    nodes = []
    
    # Include current artist node
    current_artist = db.artists.find_one({"artistId": artist_id})
    if current_artist:
        current_artist["_id"] = str(current_artist["_id"])
        nodes.append(current_artist)
        
    for edge in edges:
        edge["_id"] = str(edge["_id"])
        source_id = edge["source"]
        target_id = edge["target"]
        
        neighbor_id = target_id if source_id == artist_id else source_id
        neighbor_artist = db.artists.find_one({"artistId": neighbor_id})
        if neighbor_artist:
            neighbor_artist["_id"] = str(neighbor_artist["_id"])
            if not any(n["artistId"] == neighbor_id for n in nodes):
                nodes.append(neighbor_artist)
                
    # If we have fewer than 4 nodes (current artist + 3 neighbors), pad with global artists to satisfy D3 explorer min 3 neighbors requirement
    if len(nodes) < 4:
        all_artists = list(db.artists.find())
        for a in all_artists:
            if len(nodes) >= 4:
                break
            if not any(n["artistId"] == a["artistId"] for n in nodes):
                a["_id"] = str(a["_id"])
                nodes.append(a)
                dummy_edge = {
                    "source": artist_id,
                    "target": a["artistId"],
                    "score": 0.5,
                    "edgeType": "similar",
                    "reasons": ["fallback relation"]
                }
                edges.append(dummy_edge)
                
    return jsonify({
        "nodes": nodes,
        "edges": edges
    }), 200


@artist_bp.route("/pulse", methods=["GET"])
def get_lyrical_pulse():
    """
    Live emotion heatmap distribution count of all lyrics in database.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    emotions = ["euphoric", "hopeful", "nostalgic", "melancholy", "dark", "angry", "defiant", "romantic"]
    pulse = {emo: 0 for emo in emotions}
    
    # Calculate counts directly from lyrics collection
    lyrics = list(db.lyrics.find({}, {"emotion": 1}))
    for l in lyrics:
        emo = l.get("emotion")
        if emo in pulse:
            pulse[emo] += 1
            
    return jsonify(pulse), 200


@artist_bp.route("/discovery", methods=["GET"])
def get_discovery_hub():
    """
    Exposes segments for: Trending, Region-based, taste-based, and mood categories.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    # Ensure minimum content rules (Trending >= 8, India >= 8, Essence/Moods >= 8, etc.)
    all_artists = list(db.artists.find())
    
    trending = [a for a in all_artists if a.get("popularity", 0) > 75]
    if len(trending) < 8:
        # Fallback padding to seeded artists
        trending = all_artists[:8]
        
    popular_in_india = [a for a in all_artists if a.get("country") == "India"]
    if len(popular_in_india) < 8:
        popular_in_india = [a for a in all_artists if a.get("country") == "India" or a.get("nationality") == "India"]
        # Pad with other global artists if still under 8
        if len(popular_in_india) < 8:
            popular_in_india.extend(all_artists[:8 - len(popular_in_india)])

    # Group into moods using lyrics tags or default tags
    moods_categories = {emo: [] for emo in EMOTION_TRANSITIONS.keys()}
    for art in all_artists:
        art_id = art["artistId"]
        art["_id"] = str(art["_id"])
        
        # Load analytics DNA
        analytics = db.artist_analytics.find_one({"artistId": art_id})
        if analytics:
            art["stats"] = {"popularityScore": art.get("popularity", 70), "trendingScore": 10}
            art["essence"] = analytics.get("essence", "")
            art["lyricalDNA"] = analytics.get("dna", {}).get("emotionProfile", {})
            
            for emo in moods_categories.keys():
                score = art["lyricalDNA"].get(emo, 0)
                if score > 20:
                    moods_categories[emo].append(art)
        else:
            # Fallback DNA mappings for seeded status
            default_emo = "romantic" if art.get("country") == "India" else "euphoric"
            moods_categories[default_emo].append(art)

    # Clean object IDs
    for a in trending:
        a["_id"] = str(a["_id"])
    for a in popular_in_india:
        a["_id"] = str(a["_id"])

    # Limit to 5 moods containing at least 3 items to avoid empty categories
    active_moods = {k: v[:8] for k, v in moods_categories.items() if len(v) >= 3}
    if not active_moods:
        active_moods = {k: all_artists[:8] for k in list(moods_categories.keys())[:4]}

    # Fetch top 15 most saved lyrics for the quote wall
    quotes_wall = []
    top_lyrics = list(db.lyrics.find().sort("saveCount", -1).limit(15))
    for lyr in top_lyrics:
        art = db.artists.find_one({"artistId": lyr.get("artistId")})
        quotes_wall.append({
            "lyricId": str(lyr["_id"]),
            "quote": lyr.get("plainText", "").split("\n")[0][:120] + "..." if len(lyr.get("plainText", "")) > 120 else lyr.get("plainText", ""),
            "song": lyr.get("songTitle", "Unknown Song"),
            "artistName": art.get("name") if art else "Unknown Artist",
            "artistId": lyr.get("artistId"),
            "emotion": lyr.get("emotion", "melancholy"),
            "saveCount": lyr.get("saveCount", 0)
        })

    return jsonify({
        "trending": trending[:15],
        "popular_in_india": popular_in_india[:15],
        "mood_categories": active_moods,
        "quotes_wall": quotes_wall
    }), 200


@artist_bp.route("/search/suggest", methods=["GET"])
def suggest_autocomplete():
    """
    Autocomplete suggest from aliases and names.
    """
    import time
    start_time = time.perf_counter()
    
    query = request.args.get("q", "").strip().lower()
    if not query:
        return jsonify({"suggestions": []}), 200

    db = ArtistModel.get_db()
    aliases = list(db.artist_aliases.find({"alias": {"$regex": f"^{query}"}}).limit(10))
    suggestions = []
    for al in aliases:
        artist = db.artists.find_one({"artistId": al["artistId"]})
        if artist and artist["name"] not in suggestions:
            suggestions.append(artist["name"])
            
    # Add matches from artist names directly
    direct = list(db.artists.find({"name": {"$regex": f"^{query}", "$options": "i"}}).limit(10))
    for d in direct:
        if d["name"] not in suggestions:
            suggestions.append(d["name"])

    result_suggestions = suggestions[:8]
    
    latency = (time.perf_counter() - start_time) * 1000.0
    if latency > 100.0:
        print(f"[WARN] Suggest autocomplete latency: {latency:.2f}ms")
    else:
        print(f"[INFO] Suggest autocomplete latency: {latency:.2f}ms")

    return jsonify({"suggestions": result_suggestions}), 200


@artist_bp.route("/search", methods=["GET"])
def emotional_search():
    """
    Enriched search engine matching queries to artists, song titles, lyrics, and emotion tags.
    Employs the v2 weighted scoring ranking formula:
    score = exact_match * 100 + popularity_normalized * 20 + fuzzy_score * 15 + recency * 10
    """
    import difflib
    from datetime import datetime, timezone
    
    query = request.args.get("q", "").strip().lower()
    if not query:
        return jsonify({
            "results": [],
            "artists": [],
            "songs": [],
            "albums": [],
            "lyrics": [],
            "queued": False
        }), 200

    db = ArtistModel.get_db()
    seed_database()

    # Log search query
    db.search_queries.insert_one({
        "query": query,
        "timestamp": datetime.now(timezone.utc)
    })

    # 1. Alias Resolution
    resolved_id = None
    alias_doc = db.artist_aliases.find_one({"alias": query})
    if alias_doc:
        resolved_id = alias_doc["artistId"]

    # Pull candidate items to score
    artists_matches = []
    songs_matches = []
    lyrics_matches = []
    albums_matches = []

    # Score artists
    artists = list(db.artists.find())
    max_pop = max((art.get("popularity", 0) for art in artists), default=1)
    
    for art in artists:
        art_id = art["artistId"]
        name = art["name"].lower()
        aliases = [a.lower() for a in art.get("aliases", [])]
        
        # Exact match rule
        exact_match = 0
        resolved_via_alias = False
        
        name_tokens = name.split()
        alias_tokens = []
        for al in aliases:
            alias_tokens.extend(al.split())
            
        if (resolved_id and resolved_id == art_id) or query == name or query in name_tokens or query in aliases or query in alias_tokens:
            exact_match = 1
            if resolved_id and resolved_id == art_id:
                resolved_via_alias = True
        
        # Popularity normalized
        popularity_normalized = art.get("popularity", 0) / max_pop if max_pop > 0 else 0
        
        # Fuzzy score using difflib.SequenceMatcher ratio
        # Compute ratio on name and all aliases, pick max ratio
        matcher = difflib.SequenceMatcher(None, query, name)
        fuzzy_score = matcher.ratio()
        for al in aliases:
            ratio = difflib.SequenceMatcher(None, query, al).ratio()
            if ratio > fuzzy_score:
                fuzzy_score = ratio
                
        # Recency decay over 30 days
        last_aggregated = art.get("lastAggregated")
        if last_aggregated:
            if last_aggregated.tzinfo is None:
                last_aggregated = last_aggregated.replace(tzinfo=timezone.utc)
            days_since = (datetime.now(timezone.utc) - last_aggregated).days
            recency = max(0, 1 - (days_since / 30))
        else:
            recency = 0
            
        # Scoring: exact*100 + popularity*20 + fuzzy*15 + recency*10
        score = exact_match * 100 + popularity_normalized * 20 + fuzzy_score * 15 + recency * 10
        
        if exact_match == 1 or fuzzy_score > 0.45:
            art["_id"] = str(art["_id"])
            art["search_score"] = score
            art["resolvedViaAlias"] = resolved_via_alias
            artists_matches.append(art)

    artists_matches.sort(key=lambda x: x["search_score"], reverse=True)

    # Zero results check: if no artists matches, enqueue normalized query
    if not artists_matches:
        db.aggregation_queue.update_one(
            {"artistId": query},
            {
                "$set": {
                    "priority": "user_search",
                    "status": "pending",
                    "createdAt": datetime.now(timezone.utc),
                    "attempts": 0
                }
            },
            upsert=True
        )
        return jsonify({
            "results": [],
            "artists": [],
            "songs": [],
            "albums": [],
            "lyrics": [],
            "queued": True
        }), 200

    # Score songs and lyrics
    songs = list(db.songs.find())
    for s in songs:
        title = (s.get("name") or s.get("title", "")).lower()
        exact_match = 1 if query == title else 0
        matcher = difflib.SequenceMatcher(None, query, title)
        fuzzy_score = matcher.ratio()
        
        if exact_match == 1 or fuzzy_score > 0.4 or query in title:
            s["_id"] = str(s["_id"])
            s["search_score"] = exact_match * 100 + (s.get("popularity", 50) / 100.0) * 20 + fuzzy_score * 15
            artist_doc = db.artists.find_one({"artistId": s["artistId"]})
            s["artist"] = artist_doc["name"] if artist_doc else "Unknown"
            s["cover"] = artist_doc.get("imageUrl") if artist_doc else ""
            songs_matches.append(s)
            
    songs_matches.sort(key=lambda x: x["search_score"], reverse=True)

    # Score lyrics
    lyrics = list(db.lyrics.find())
    for lyr in lyrics:
        plain_text = lyr.get("plainText", "").lower()
        if query in plain_text:
            lyr["_id"] = str(lyr["_id"])
            song_doc = db.songs.find_one({"songId": lyr["songId"]})
            artist_doc = db.artists.find_one({"artistId": lyr["artistId"]})
            
            # Find snippet
            start_idx = plain_text.find(query)
            snippet = lyr["plainText"][max(0, start_idx - 30) : min(len(plain_text), start_idx + 100)] + "..."
            
            lyrics_matches.append({
                "snippet": snippet,
                "song": song_doc["title"] if song_doc else "Unknown Track",
                "artist": artist_doc["name"] if artist_doc else "Unknown Artist",
                "artistId": lyr["artistId"],
                "emotion": lyr.get("emotion", "melancholy")
            })

    # Score albums
    albums = list(db.albums.find())
    for alb in albums:
        title = alb["title"].lower()
        exact_match = 1 if query == title else 0
        matcher = difflib.SequenceMatcher(None, query, title)
        fuzzy_score = matcher.ratio()
        
        if exact_match == 1 or fuzzy_score > 0.4 or query in title:
            alb["_id"] = str(alb["_id"])
            artist_doc = db.artists.find_one({"artistId": alb["artistId"]})
            alb["artist"] = artist_doc["name"] if artist_doc else "Unknown"
            alb["cover"] = artist_doc.get("imageUrl") if artist_doc else ""
            albums_matches.append(alb)

    return jsonify({
        "results": artists_matches[:8],
        "artists": artists_matches[:8],
        "songs": songs_matches[:15],
        "albums": albums_matches[:8],
        "lyrics": lyrics_matches[:8],
        "queued": False
    }), 200


@artist_bp.route("/emotion-journey", methods=["GET"])
def get_emotion_journey():
    """
    BFS transitions listener path sequencing 10 songs across different artists.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    start_emotion = request.args.get("start", "nostalgic").strip().lower()
    if start_emotion not in EMOTION_TRANSITIONS:
        start_emotion = "nostalgic"

    journey_songs = []
    visited_emotions = []
    visited_artists = set()
    
    queue = [start_emotion]
    while queue and len(journey_songs) < 10:
        curr = queue.pop(0)
        if curr not in visited_emotions:
            visited_emotions.append(curr)
            
            # Query songs matching this emotion
            matching_lyrics = list(db.lyrics.find({"emotion": curr}))
            songs_for_emotion = []
            for lyr in matching_lyrics:
                song = db.songs.find_one({"songId": lyr["songId"]})
                if song:
                    title = (song.get("name") or song.get("title") or "").strip()
                    if not title or title.lower() in ["", "unknown track", "unknown"] or title.lower().startswith("song track"):
                        continue
                    song["_id"] = str(song["_id"])
                    artist_doc = db.artists.find_one({"artistId": song["artistId"]})
                    song["artist"] = artist_doc["name"] if artist_doc else "Unknown"
                    song["cover"] = artist_doc.get("imageUrl") if artist_doc else ""
                    song["journeyEmotion"] = curr
                    songs_for_emotion.append(song)
                    
            # Prioritize songs by artists we haven't visited yet to maximize diversity
            non_visited_artist_songs = [s for s in songs_for_emotion if s["artistId"] not in visited_artists]
            visited_artist_songs = [s for s in songs_for_emotion if s["artistId"] in visited_artists]
            ordered_songs = non_visited_artist_songs + visited_artist_songs
            
            # Collect up to 2 songs from this emotion
            for s in ordered_songs[:2]:
                if len(journey_songs) >= 10:
                    break
                journey_songs.append(s)
                visited_artists.add(s["artistId"])
                    
            # Add neighbors from transition map
            neighbors = EMOTION_TRANSITIONS.get(curr, [])
            for n in neighbors:
                if n not in visited_emotions and n not in queue:
                    queue.append(n)
                    
    # Format fallback in case matches are sparse
    if len(journey_songs) < 10:
        all_songs = list(db.songs.find())
        for s in all_songs:
            if len(journey_songs) >= 10:
                break
            if any(js["songId"] == s["songId"] for js in journey_songs):
                continue
            title = (s.get("name") or s.get("title") or "").strip()
            if not title or title.lower() in ["", "unknown track", "unknown"] or title.lower().startswith("song track"):
                continue
            s["_id"] = str(s["_id"])
            artist_doc = db.artists.find_one({"artistId": s["artistId"]})
            s["artist"] = artist_doc["name"] if artist_doc else "Unknown"
            s["cover"] = artist_doc.get("imageUrl") if artist_doc else ""
            s["journeyEmotion"] = "nostalgic"
            journey_songs.append(s)

    return jsonify({"journey": journey_songs[:10]}), 200


@artist_bp.route("/lyrics/<lyric_id>/save", methods=["POST"])
def save_lyric_quote(lyric_id):
    """
    Saves a lyric quote to increment its save count.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    res = db.lyrics.update_one(
        {"lyricId": lyric_id},
        {"$inc": {"saveCount": 1}}
    )
    if res.matched_count == 0:
        return jsonify({"error": "Lyric not found"}), 404
        
    return jsonify({"status": "saved"}), 200


@artist_bp.route("/lyrics/<song_id>/synced", methods=["GET"])
def get_synced_lyrics(song_id):
    """
    Retrieve timed LRC lyrics.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    lyr = db.lyrics.find_one({"songId": song_id})
    if not lyr:
        return jsonify({"error": "Lyrics not found"}), 404
        
    return jsonify({
        "songId": song_id,
        "plainText": lyr.get("plainText"),
        "syncedLrc": lyr.get("syncedLrc"),
        "hasSynced": lyr.get("hasSynced", False)
    }), 200


@artist_bp.route("/emotion/<emotion_name>/quotes", methods=["GET"])
def get_emotion_quotes(emotion_name):
    """
    Retrieve top artist and top 3 quotes sorted by saveCount desc for a given emotion.
    """
    seed_database()
    db = ArtistModel.get_db()
    emotion_name = emotion_name.strip().lower()

    # Find lyrics belonging to this emotion, sorted by saveCount descending, limit 3
    lyrics = list(db.lyrics.find({"emotion": emotion_name}).sort("saveCount", -1).limit(3))

    # Find the top artist for that emotion (highest popularity with this emotion in DNA)
    top_artist_id = None
    top_popularity = -1
    top_artist_name = ""
    top_artist_cover = ""

    # Search for an artist who has this emotion highly ranked in their analytics
    analytics = list(db.artist_analytics.find())
    for anal in analytics:
        dna = anal.get("dna", {}).get("emotionProfile", {})
        score = dna.get(emotion_name, 0)
        if score > 20:
            art = db.artists.find_one({"artistId": anal["artistId"]})
            if art and art.get("popularity", 0) > top_popularity:
                top_popularity = art.get("popularity", 0)
                top_artist_id = art["artistId"]
                top_artist_name = art["name"]
                top_artist_cover = art.get("cover", "")

    # Fallback to checking the artists of the queried lyrics if we didn't find one via analytics
    if not top_artist_id and lyrics:
        for lyr in lyrics:
            art = db.artists.find_one({"artistId": lyr.get("artistId")})
            if art and art.get("popularity", 0) > top_popularity:
                top_popularity = art.get("popularity", 0)
                top_artist_id = art["artistId"]
                top_artist_name = art["name"]
                top_artist_cover = art.get("cover", "")

    # Format the quotes
    quotes_list = []
    for lyr in lyrics:
        art = db.artists.find_one({"artistId": lyr.get("artistId")})
        quotes_list.append({
            "lyricId": str(lyr["_id"]),
            "quote": lyr.get("plainText", "").split("\n")[0][:120],
            "song": lyr.get("songTitle", "Unknown Track"),
            "artistName": art.get("name") if art else "Unknown Artist",
            "artistId": lyr.get("artistId"),
            "saveCount": lyr.get("saveCount", 0)
        })

    return jsonify({
        "emotion": emotion_name,
        "topArtist": {
            "artistId": top_artist_id or "unknown",
            "name": top_artist_name or "Unknown Artist",
            "cover": top_artist_cover or ""
        },
        "quotes": quotes_list
    }), 200
