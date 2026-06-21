from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from models.playlist import Playlist
from bson import ObjectId

bp = Blueprint("playlists", __name__)
pl_model = Playlist()


@bp.route("/", methods=["GET"])
@login_required
def list_playlists():
    user_id = current_user.id
    # fetch playlists for the current user
    pls = pl_model.get_playlists_by_user(user_id)
    # normalize _id to id string
    out = []
    for p in pls:
        out.append({
            "id": str(p.get("_id")),
            "name": p.get("name"),
            "songs": p.get("songs", []),
        })
    return jsonify({"playlists": out}), 200


@bp.route("/", methods=["POST"])
@login_required
def create_playlist():
    data = request.get_json() or {}
    name = data.get("name") or "New Playlist"
    user_id = current_user.id
    new_id = pl_model.create_playlist(user_id, name)
    return jsonify({"success": True, "playlist": {"id": str(new_id), "name": name, "songs": []}}), 201


@bp.route("/<playlist_id>", methods=["GET"])
@login_required
def get_playlist(playlist_id):
    try:
        p = pl_model.collection.find_one({"_id": ObjectId(playlist_id), "user_id": current_user.id})
        if not p:
            return jsonify({"error": "Not found"}), 404
        return jsonify({"id": str(p.get("_id")), "name": p.get("name"), "songs": p.get("songs", [])}), 200
    except Exception:
        return jsonify({"error": "Invalid id"}), 400


@bp.route("/<playlist_id>/songs", methods=["POST"])
@login_required
def add_song_to_playlist(playlist_id):
    data = request.get_json() or {}
    song_id = data.get("song_id")
    if not song_id:
        return jsonify({"error": "song_id required"}), 400
    try:
        res = pl_model.add_song(playlist_id, song_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<playlist_id>/songs/<song_id>", methods=["DELETE"])
@login_required
def remove_song_from_playlist(playlist_id, song_id):
    try:
        res = pl_model.remove_song(playlist_id, song_id)
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<playlist_id>", methods=["PUT"])
@login_required
def rename_playlist(playlist_id):
    data = request.get_json() or {}
    new_name = data.get("name")
    if not new_name:
        return jsonify({"error": "name required"}), 400
    try:
        user_id = current_user.id
        # Ensure only the owner can rename
        res = pl_model.collection.update_one(
            {"_id": ObjectId(playlist_id), "user_id": user_id},
            {"$set": {"name": new_name}}
        )
        if res.matched_count == 0:
            return jsonify({"error": "Not found or not permitted"}), 404
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@bp.route("/<playlist_id>", methods=["DELETE"])
@login_required
def delete_playlist(playlist_id):
    try:
        user_id = current_user.id
        res = pl_model.collection.delete_one({"_id": ObjectId(playlist_id), "user_id": user_id})
        if res.deleted_count == 0:
            return jsonify({"error": "Not found or not permitted"}), 404
        return jsonify({"success": True}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

