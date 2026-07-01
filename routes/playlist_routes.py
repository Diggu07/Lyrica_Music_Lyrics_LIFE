from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user

from services.playlist_service import PlaylistService


bp = Blueprint(
    "playlists",
    __name__
)


# =====================================================
# List
# =====================================================

@bp.route("", methods=["GET"])
@login_required
def get_playlists():

    return jsonify({

        "playlists":

        PlaylistService.get_user_playlists(

            current_user.id

        )

    })


# =====================================================
# Create
# =====================================================

@bp.route("", methods=["POST"])
@login_required
def create_playlist():

    return jsonify(

        PlaylistService.create_playlist(

            current_user.id,

            request.get_json()

        )

    ), 201


# =====================================================
# Get
# =====================================================

@bp.route("/<playlist_id>", methods=["GET"])
@login_required
def get_playlist(
    playlist_id
):

    playlist = PlaylistService.get_playlist(
        playlist_id
    )

    if playlist is None:

        return jsonify({

            "success": False,

            "message": "Playlist not found"

        }), 404

    return jsonify(
        playlist
    )


# =====================================================
# Rename
# =====================================================

@bp.route("/<playlist_id>", methods=["PUT"])
@login_required
def rename_playlist(
    playlist_id
):

    data = request.get_json()

    return jsonify(

        PlaylistService.rename_playlist(

            playlist_id,

            data["name"]

        )

    )


# =====================================================
# Delete
# =====================================================

@bp.route("/<playlist_id>", methods=["DELETE"])
@login_required
def delete_playlist(
    playlist_id
):

    return jsonify(

        PlaylistService.delete_playlist(

            playlist_id

        )

    )


# =====================================================
# Add Song
# =====================================================

@bp.route("/<playlist_id>/songs", methods=["POST"])
@login_required
def add_song(
    playlist_id
):

    data = request.get_json()

    return jsonify(

        PlaylistService.add_song(

            playlist_id,

            data["songId"]

        )

    )


# =====================================================
# Remove Song
# =====================================================

@bp.route(
    "/<playlist_id>/songs/<song_id>",
    methods=["DELETE"]
)
@login_required
def remove_song(
    playlist_id,
    song_id
):

    return jsonify(

        PlaylistService.remove_song(

            playlist_id,

            song_id

        )

    )