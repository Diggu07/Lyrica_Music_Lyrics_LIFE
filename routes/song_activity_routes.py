from flask import Blueprint, jsonify, request, session
from models.song_activity import SongActivity

song_activity_routes = Blueprint("song_activity_routes", __name__)
activity = SongActivity()

# ✅ Log a play event
@song_activity_routes.route('/song/play', methods=['POST'])
def log_song_play():
    data = request.get_json()
    user_id = session.get('user_id', 'guest')
    song_id = data.get('song_id')
    song_title = data.get('song_title')
    activity.log_play(user_id, song_id, song_title)
    return jsonify({"message": "Song play logged"}), 200


# ✅ Leaderboard
@song_activity_routes.route('/songs/leaderboard', methods=['GET'])
def leaderboard():
    top_songs = activity.get_leaderboard()
    for s in top_songs:
        s['_id'] = str(s['_id'])
    return jsonify(top_songs), 200


# ✅ Recently Played
@song_activity_routes.route('/songs/recent', methods=['GET'])
def recent_songs():
    user_id = session.get('user_id', 'guest')
    recent = activity.get_recent_by_user(user_id)
    return jsonify(recent), 200


# ✅ Remove a song from user's recently played list
@song_activity_routes.route("/song/recent/delete", methods=["DELETE"])
def delete_recent_song():
    data = request.get_json()
    song_title = data.get("song_title")
    user_id = session.get("user_id", "guest")

    if not song_title:
        return jsonify({"error": "song_title is required"}), 400

    deleted = activity.delete_from_recent(user_id, song_title)
    if deleted:
        return jsonify({"message": f"Removed '{song_title}' from recently played"}), 200
    else:
        return jsonify({"message": f"No record found for '{song_title}'"}), 404


# ✅ Like / Unlike a Song
@song_activity_routes.route("/song/like", methods=["POST"])
def like_song():
    """
    Toggle like/unlike for a song.
    Expected JSON: { "song_title": "Fade", "liked": true }
    """
    data = request.get_json()
    song_title = data.get("song_title")
    liked = data.get("liked", True)
    user_id = session.get("user_id", "guest")

    if not song_title:
        return jsonify({"error": "song_title is required"}), 400

    if liked:
        activity.add_to_liked(user_id, song_title)
        return jsonify({"message": f"✅ '{song_title}' added to liked songs"}), 200
    else:
        activity.remove_from_liked(user_id, song_title)
        return jsonify({"message": f"💔 '{song_title}' removed from liked songs"}), 200


# ✅ Fetch Liked Songs
@song_activity_routes.route("/songs/liked", methods=["GET"])
def get_liked_songs():
    user_id = session.get("user_id", "guest")
    liked_songs = activity.get_liked_by_user(user_id)
    return jsonify(liked_songs), 200
