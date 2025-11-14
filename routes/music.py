# routes/music.py
from flask import Blueprint, jsonify

bp = Blueprint("music", __name__)

@bp.route("/tracks", methods=["GET"])
def list_tracks():
    # Return example tracks list
    return jsonify({"tracks": [
        {"id": 1, "title": "Sample Track", "artist": "Artist A"},
        {"id": 2, "title": "Another Track", "artist": "Artist B"}
    ]}), 200

@bp.route("/tracks/<int:track_id>", methods=["GET"])
def get_track(track_id):
    return jsonify({"id": track_id, "title": f"Track {track_id}", "artist": "Unknown"}), 200
