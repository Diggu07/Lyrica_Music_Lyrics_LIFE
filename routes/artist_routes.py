from flask import Blueprint, jsonify

from services.artist_service import ArtistService

artist_bp = Blueprint("artist", __name__)


# ==========================================================
# Health
# ==========================================================

@artist_bp.route("/health", methods=["GET"])
def get_health():

    data, status = ArtistService.get_health()

    return jsonify(data), status


# ==========================================================
# Artist Profile
# ==========================================================

@artist_bp.route("/<artist_id>", methods=["GET"])
def get_artist(artist_id):

    data, status = ArtistService.get_artist(
        artist_id
    )

    return jsonify(data), status


# ==========================================================
# Artist Analytics
# ==========================================================

@artist_bp.route("/<artist_id>/analytics", methods=["GET"])
def get_artist_analytics(artist_id):

    data, status = ArtistService.get_artist_analytics(
        artist_id
    )

    return jsonify(data), status


# ==========================================================
# Artist Songs
# ==========================================================

@artist_bp.route("/<artist_id>/songs", methods=["GET"])
def get_artist_songs(artist_id):

    data, status = ArtistService.get_artist_songs(
        artist_id
    )

    return jsonify(data), status


# ==========================================================
# Artist Albums
# ==========================================================

@artist_bp.route("/<artist_id>/albums", methods=["GET"])
def get_artist_albums(artist_id):

    data, status = ArtistService.get_artist_albums(
        artist_id
    )

    return jsonify(data), status