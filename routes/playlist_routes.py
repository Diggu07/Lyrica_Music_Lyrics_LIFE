# routes/playlist_routes.py
from flask import Blueprint, request, jsonify

bp = Blueprint("playlists", __name__)

@bp.route("/", methods=["GET"])
def list_playlists():
    # return example structure; replace with real model calls
    return jsonify({"playlists": [{"id": 1, "name": "Liked Songs"}]}), 200

@bp.route("/", methods=["POST"])
def create_playlist():
    data = request.get_json() or {}
    # validate and create your playlist; stub returns input
    return jsonify({"success": True, "playlist": data}), 201

@bp.route("/<int:playlist_id>", methods=["GET"])
def get_playlist(playlist_id):
    # fetch playlist by id
    return jsonify({"id": playlist_id, "name": f"Playlist {playlist_id}", "tracks": []}), 200
