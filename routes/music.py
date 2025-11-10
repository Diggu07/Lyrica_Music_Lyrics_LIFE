from flask import Blueprint, jsonify, current_app
import os

music_bp = Blueprint("music", __name__)

@music_bp.route("/api/songs", methods=["GET"])
def get_songs():
    """Return list of available songs"""
    songs_dir = os.path.join(current_app.root_path, "static", "songs")

    if not os.path.exists(songs_dir):
        return jsonify({"error": "Songs directory not found"}), 404

    songs = [f for f in os.listdir(songs_dir) if f.endswith(".mp3")]
    return jsonify({"songs": songs})
