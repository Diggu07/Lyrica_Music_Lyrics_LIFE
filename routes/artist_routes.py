# routes/artist_routes.py
import random
from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from datetime import datetime, timezone, timedelta
from models.artist import ArtistModel
from utils.artist_aggregator import seed_database, trigger_background_refresh, SEED_ARTISTS, EMOTION_KEYWORDS

artist_bp = Blueprint("artist", __name__)

# Trigger database seeding when blueprint is registered / imported
seed_database()

def levenshtein_distance(s1, s2):
    s1 = s1.lower().strip()
    s2 = s2.lower().strip()
    if len(s1) < len(s2):
        return levenshtein_distance(s2, s1)
    if len(s2) == 0:
        return len(s1)
    
    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row
        
    return previous_row[-1]

@artist_bp.route("/health", methods=["GET"])
def get_health_stats():
    """
    Returns document statistics counts for the 13 collections.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    artists_count = db.artists.count_documents({})
    songs_count = db.songs.count_documents({})
    albums_count = db.albums.count_documents({})
    lyrics_count = db.lyrics.count_documents({})
    relationships_count = db.artist_graph.count_documents({})
    search_index_count = db.search_index.count_documents({})
    
    aggregated_count = db.artists.count_documents({"aggregationStatus": "completed"})
    pending_count = db.artists.count_documents({"aggregationStatus": {"$in": ["seeded", "queued", "aggregating"]}})
    
    return jsonify({
        "artists": artists_count,
        "songs": songs_count,
        "albums": albums_count,
        "lyrics": lyrics_count,
        "relationships": relationships_count,
        "searchIndex": search_index_count,
        "aggregatedArtists": aggregated_count,
        "pendingArtists": pending_count
    }), 200

@artist_bp.route("/<artist_id>", methods=["GET"])
def get_artist_profile(artist_id):
    seed_database()
    db = ArtistModel.get_db()
    artist = db.artists.find_one({"artistId": artist_id})

    if not artist:
        # Check alias
        alias_doc = db.artist_aliases.find_one({"alias": artist_id.replace("-", " ").lower()})
        if alias_doc:
            artist = db.artists.find_one({"artistId": alias_doc["artistId"]})

    if not artist:
        return jsonify({"error": "Artist not found"}), 404

    # Trigger async refresh if seeded / queue expired
    if artist.get("aggregationStatus") == "seeded":
        trigger_background_refresh(artist["artistId"])

    artist["_id"] = str(artist["_id"])
    return jsonify(artist), 200

@artist_bp.route("/<artist_id>/analytics", methods=["GET"])
def get_artist_analytics(artist_id):
    seed_database()
    db = ArtistModel.get_db()
    analytics = db.artist_analytics.find_one({"artistId": artist_id})

    if not analytics:
        return jsonify({"error": "Analytics not found"}), 404

    analytics["_id"] = str(analytics["_id"])
    return jsonify(analytics), 200

@artist_bp.route("/search/suggest", methods=["GET"])
def get_search_suggestions():
    """
    Returns instant suggestions (Artists, Songs, Albums, Lyrics snippets) as user types.
    """
    query = request.args.get("q", "").strip().lower()
    if not query:
        return jsonify({"artists": [], "songs": [], "albums": [], "lyrics": []}), 200

    db = ArtistModel.get_db()
    
    artists = []
    songs = []
    albums = []
    lyrics = []

    # Simple regex matches for quick autocomplete
    matches = list(db.search_index.find({"text": {"$regex": query, "$options": "i"}}).limit(10))
    for m in matches:
        aid = m["artistId"]
        art = db.artists.find_one({"artistId": aid})
        if not art:
            continue
        art_name = art["name"]
        
        if m["type"] == "artist":
            if not any(a["id"] == aid for a in artists):
                artists.append({"id": aid, "name": art_name, "cover": art.get("cover")})
        elif m["type"] == "song":
            if not any(s["id"] == m["songId"] for s in songs):
                songs.append({"id": m["songId"], "title": m["text"].title(), "artist": art_name, "cover": art.get("cover")})
        elif m["type"] == "album":
            if not any(al["title"] == m["albumName"] for al in albums):
                albums.append({"title": m["albumName"], "artist": art_name, "cover": art.get("cover")})
        elif m["type"] == "lyrics":
            meta = m.get("metadata") or {}
            lyrics.append({
                "quote": meta.get("lyricSnippet", m["text"]),
                "song": meta.get("song", "Unknown"),
                "artist": art_name,
                "artistId": aid,
                "emotion": meta.get("emotion", "love")
            })

    return jsonify({
        "artists": artists[:3],
        "songs": songs[:3],
        "albums": albums[:3],
        "lyrics": lyrics[:3]
    }), 200

@artist_bp.route("/search/trending", methods=["GET"])
def get_trending_searches():
    db = ArtistModel.get_db()
    queries = list(db.search_queries.find().sort("timestamp", -1).limit(10))
    query_texts = list(set([q["query"] for q in queries if len(q["query"]) > 1]))
    if len(query_texts) < 4:
        query_texts = ["Taylor Swift", "Arijit Singh", "Heartbreak", "Nostalgia", "Diljit Dosanjh", "Love Story"]
    return jsonify({"trending_searches": query_texts[:6]}), 200

@artist_bp.route("/search", methods=["GET"])
def scored_search():
    """
    Returns search results using exact, alias, fuzzy, lyrics, genre, and emotion matching.
    """
    query = request.args.get("q", "").strip().lower()
    db = ArtistModel.get_db()
    seed_database()

    # Log search queries
    ArtistModel.log_search_query(query, 0)

    # 1. Alias lookup resolution
    alias_matches = list(db.artist_aliases.find({"alias": {"$regex": query, "$options": "i"}}))
    alias_ids = [a["artistId"] for a in alias_matches]

    # Find search index matches
    matches = list(db.search_index.find({"text": {"$regex": query, "$options": "i"}}))

    results = []
    
    # Track logged counts
    artists_matches = []
    songs_matches = []
    albums_matches = []
    lyrics_matches = []

    for m in matches:
        aid = m["artistId"]
        art = db.artists.find_one({"artistId": aid})
        if not art:
            continue
        
        # Calculate Scored Ranking:
        # score = exact * 100 + popularity * 20 + fuzzy_score * 15 + recency * 10
        exact_score = 100 if query == m["text"].lower() else 0
        pop_score = art.get("popularityScore", 50)
        
        dist = levenshtein_distance(query, m["text"])
        fuzzy_score = max(0, 10 - dist)
        
        recency_score = 10
        if m["type"] == "song":
            song = db.songs.find_one({"songId": m["songId"]})
            if song:
                try:
                    year = int(song.get("releaseYear", 2023))
                    diff = datetime.now().year - year
                    recency_score = int(10 / (diff + 1))
                except Exception:
                    pass
        
        score = exact_score + (pop_score * 0.20) + (fuzzy_score * 15) + (recency_score * 1.0)
        if aid in alias_ids:
            score += 80 # heavy boost for alias match!

        item = {
            "type": m["type"],
            "score": score,
            "artistId": aid,
            "artistName": art["name"],
            "cover": art.get("cover"),
            "text": m["text"]
        }

        if m["type"] == "artist":
            if not any(a["artistId"] == aid for a in artists_matches):
                artists_matches.append(art)
        elif m["type"] == "song":
            songs_matches.append({
                "id": m["songId"],
                "title": m["text"].title(),
                "artist": art["name"],
                "album": m.get("albumName", "Single"),
                "cover": art.get("cover")
            })
        elif m["type"] == "album":
            albums_matches.append({
                "title": m["albumName"],
                "artist": art["name"],
                "cover": art.get("cover")
            })
        elif m["type"] == "lyrics":
            meta = m.get("metadata") or {}
            lyrics_matches.append({
                "snippet": meta.get("lyricSnippet", m["text"]),
                "song": meta.get("song", "Unknown"),
                "artist": art["name"],
                "artistId": aid,
                "emotion": meta.get("emotion", "love")
            })

    # Log search queries results count
    total_count = len(artists_matches) + len(songs_matches) + len(albums_matches) + len(lyrics_matches)
    db.search_queries.update_one(
        {"query": query},
        {"$set": {"results": total_count}}
    )

    # Empty State check: Never return an empty page!
    if total_count == 0:
        # Return fallback recommendations
        trending = list(db.artists.find().sort("popularityScore", -1).limit(6))
        popular_lyrics = list(db.lyrics.find().sort("saveCount", -1).limit(6))
        for t in trending:
            t["_id"] = str(t["_id"])
        for p in popular_lyrics:
            p["_id"] = str(p["_id"])
            art = db.artists.find_one({"artistId": p["artistId"]})
            if art:
                p["artistName"] = art["name"]
        
        return jsonify({
            "is_empty": True,
            "suggested_artists": trending,
            "popular_lyrics": popular_lyrics,
            "trending_searches": ["Taylor Swift", "Arijit Singh", "Heartbreak", "Nostalgia", "Love Story", "Tum Hi Ho"]
        }), 200

    # Clean Mongo IDs
    for a in artists_matches:
        a["_id"] = str(a["_id"])

    return jsonify({
        "is_empty": False,
        "artists": artists_matches[:5],
        "songs": songs_matches[:10],
        "albums": albums_matches[:5],
        "lyrics": lyrics_matches[:6]
    }), 200

@artist_bp.route("/discovery", methods=["GET"])
def get_discovery_hub():
    """
    Exposes segments for: Trending, Region-based, taste-based, and mood categories.
    """
    seed_database()
    db = ArtistModel.get_db()
    
    artists = list(db.artists.find())
    for a in artists:
        a["_id"] = str(a["_id"])
        # populate essence & scores from analytics
        anal = db.artist_analytics.find_one({"artistId": a["artistId"]})
        if anal:
            a["topEmotion"] = anal.get("topEmotion", "Love")
            a["secondaryEmotion"] = anal.get("secondaryEmotion", "Motivation")
            a["discoveryScore"] = anal.get("discoveryScore", 75)
            a["lyricalDNA"] = anal.get("lyricalDNA", {})
            a["quotedLyrics"] = anal.get("quotedLyrics", [])

    # Sort by discoveryScore/popularityScore
    artists.sort(key=lambda x: x.get("popularityScore", 0), reverse=True)

    trending = [a for a in artists if a.get("popularityScore", 0) > 85][:8]
    popular_in_india = [a for a in artists if a.get("country") == "India" or a.get("country") == "Pakistan"][:8]
    
    # Taste-based recommendations: "Artists You Might Like"
    recommendations = []
    if trending:
        recommendations = [a for a in artists if a["artistId"] != trending[0]["artistId"]][:6]

    # Moods / Emotions Categories
    moods_categories = {emotion: [] for emotion in EMOTION_KEYWORDS.keys()}
    for a in artists:
        dna = a.get("lyricalDNA", {})
        for emo in moods_categories.keys():
            if dna.get(emo, 0) > 40:
                moods_categories[emo].append(a)

    # Clean emotion categories
    formatted_moods = {k: v[:6] for k, v in moods_categories.items() if len(v) >= 3}

    # Fetch 12+ quoted lyrics
    lyrics_list = list(db.lyrics.find().sort("saveCount", -1).limit(15))
    for l in lyrics_list:
        l["_id"] = str(l["_id"])
        art = db.artists.find_one({"artistId": l["artistId"]})
        if art:
            l["artist"] = art["name"]
            l["artistCover"] = art.get("cover")

    return jsonify({
        "trending": trending,
        "popular_in_india": popular_in_india,
        "recommendations": recommendations,
        "mood_categories": formatted_moods,
        "quoted_lyrics": lyrics_list
    }), 200

@artist_bp.route("/emotion/<emotion_id>", methods=["GET"])
def get_emotion_page(emotion_id):
    """
    Returns Artists, Songs, and Lyrics associated with an emotional mood category.
    """
    db = ArtistModel.get_db()
    seed_database()
    emotion_id = emotion_id.lower().strip()

    # Artists matching emotion
    artists = []
    all_artists = list(db.artists.find())
    for a in all_artists:
        a["_id"] = str(a["_id"])
        anal = db.artist_analytics.find_one({"artistId": a["artistId"]})
        if anal:
            a["topEmotion"] = anal.get("topEmotion", "Love")
            a["lyricalDNA"] = anal.get("lyricalDNA", {})
            if a["lyricalDNA"].get(emotion_id, 0) > 45 or a["topEmotion"].lower() == emotion_id:
                artists.append(a)

    # Songs matching emotion
    songs = []
    for art in artists[:5]:
        art_songs = list(db.songs.find({"artistId": art["artistId"]}).limit(3))
        for s in art_songs:
            s["_id"] = str(s["_id"])
            s["artist"] = art["name"]
            s["cover"] = art.get("cover")
            songs.append(s)

    # Lyrics matching emotion
    lyrics_list = list(db.lyrics.find({"emotion": emotion_id}).limit(10))
    for l in lyrics_list:
        l["_id"] = str(l["_id"])
        art = db.artists.find_one({"artistId": l["artistId"]})
        if art:
            l["artist"] = art["name"]
            l["artistCover"] = art.get("cover")

    return jsonify({
        "emotion": emotion_id.title(),
        "artists": artists[:8],
        "songs": songs[:8],
        "lyrics": lyrics_list[:12]
    }), 200
