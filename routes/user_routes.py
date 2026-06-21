from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

user_bp = Blueprint("user", __name__)


@user_bp.route("/liked-songs", methods=["GET"])
@login_required
def get_liked_songs():
    return jsonify({"liked_songs": current_user.get_liked_songs()}), 200


@user_bp.route("/liked-songs", methods=["POST"])
@login_required
def update_liked_songs():
    data = request.get_json() or {}
    song_id = data.get("song_id")
    action = data.get("action")
    if not song_id or action not in ("add", "remove"):
        return jsonify({"error": "Invalid request"}), 400
    if action == "add":
        current_user.add_liked_song(song_id)
    else:
        current_user.remove_liked_song(song_id)
    return jsonify({"success": True, "liked_songs": current_user.get_liked_songs()}), 200


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