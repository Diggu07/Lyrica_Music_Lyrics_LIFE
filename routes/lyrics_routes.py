from flask import Blueprint, jsonify, request

from services.lyrics_service import LyricsService

lyrics_bp = Blueprint(
    "lyrics",
    __name__
)


@lyrics_bp.route("", methods=["GET"])
def get_lyrics():

    artist = request.args.get(
        "artist",
        ""
    )

    title = request.args.get(
        "title",
        ""
    )

    duration = request.args.get(
        "duration"
    )

    data, status = LyricsService.get_lyrics(
        artist,
        title,
        duration
    )

    return jsonify(data), status