from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

user_bp = Blueprint("user", __name__)


@user_bp.route("/liked-songs", methods=["GET"])
@login_required
def get_liked_songs():
    liked_ids = current_user.get_liked_songs()
    db = current_user.get_db_connection()
    liked_metadata = list(db.liked_tracks_metadata.find({"id": {"$in": liked_ids}}))
    for m in liked_metadata:
        m["_id"] = str(m["_id"])
    return jsonify({
        "liked_songs": liked_ids,
        "liked_songs_metadata": liked_metadata
    }), 200


@user_bp.route("/liked-songs", methods=["POST"])
@login_required
def update_liked_songs():
    data = request.get_json() or {}
    song_id = data.get("song_id")
    action = data.get("action")
    
    if not song_id or action not in ("add", "remove"):
        return jsonify({"error": "Invalid request"}), 400
        
    # Format and safety validation
    if not isinstance(song_id, str):
        return jsonify({"error": "Invalid song ID format"}), 400
        
    if song_id.startswith("yt_"):
        video_id = song_id[3:]
        if len(video_id) != 11:
            return jsonify({"error": "Invalid YouTube video ID format"}), 400
    elif song_id.startswith("apple_"):
        apple_id = song_id[6:]
        if not apple_id.isdigit():
            return jsonify({"error": "Invalid Apple track ID format"}), 400
    else:
        # JioSaavn / numeric or standard alphanumeric ID
        if not song_id.isalnum() and not any(c in song_id for c in '-_'):
            return jsonify({"error": "Invalid JioSaavn song ID format"}), 400

    db = current_user.get_db_connection()

    if action == "add":
        track_metadata = data.get("track")
        if track_metadata:
            title = track_metadata.get("title")
            artist = track_metadata.get("artist")
            if not title or not artist or not isinstance(title, str) or not isinstance(artist, str):
                return jsonify({"error": "Invalid track metadata: title and artist are required strings"}), 400
            
            db.liked_tracks_metadata.update_one(
                {"id": song_id},
                {"$set": {
                    "id": song_id,
                    "title": title.strip(),
                    "artist": artist.strip(),
                    "cover": track_metadata.get("cover"),
                    "duration": track_metadata.get("duration", "0:00"),
                    "duration_secs": track_metadata.get("duration_secs", 0),
                    "source": track_metadata.get("source"),
                    "videoId": track_metadata.get("videoId"),
                    "saavn_id": track_metadata.get("saavn_id")
                }},
                upsert=True
            )
        current_user.add_liked_song(song_id)
    else:
        current_user.remove_liked_song(song_id)
        # Clean up orphaned metadata from liked_tracks_metadata
        if db.users.count_documents({"liked_songs": song_id}) == 0:
            db.liked_tracks_metadata.delete_one({"id": song_id})

    liked_ids = current_user.get_liked_songs()
    liked_metadata = list(db.liked_tracks_metadata.find({"id": {"$in": liked_ids}}))
    for m in liked_metadata:
        m["_id"] = str(m["_id"])

    return jsonify({
        "success": True,
        "liked_songs": liked_ids,
        "liked_songs_metadata": liked_metadata
    }), 200


@user_bp.route("/followed-artists", methods=["GET"])
@login_required
def get_followed_artists():
    return jsonify({"followed_artists": getattr(current_user, 'followed_artists', [])}), 200


@user_bp.route("/followed-artists", methods=["POST"])
@login_required
def update_followed_artists():
    data = request.get_json() or {}
    artist_id = data.get("artist_id")
    action = data.get("action")
    if not artist_id or action not in ("add", "remove"):
        return jsonify({"error": "Invalid request"}), 400
    if action == "add":
        current_user.follow_artist(artist_id)
    else:
        current_user.unfollow_artist(artist_id)
    return jsonify({"success": True, "followed_artists": getattr(current_user, 'followed_artists', [])}), 200