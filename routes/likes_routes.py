from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user

from services.likes_service import LikesService

bp = Blueprint(
    "likes",
    __name__
)


@bp.route("/", methods=["GET"])
@login_required
def get_likes():

    limit = request.args.get(
        "limit",
        default=100,
        type=int
    )

    return jsonify({

        "success": True,

        "songs":

        LikesService.get_likes(

            current_user.id,

            limit

        )

    })


@bp.route("/", methods=["POST"])
@login_required
def like_song():

    data = request.get_json()

    song_id = data.get(
        "songId"
    )

    return jsonify(

        LikesService.like_song(

            current_user.id,

            song_id

        )

    )


@bp.route("/<song_id>", methods=["DELETE"])
@login_required
def unlike_song(song_id):

    return jsonify(

        LikesService.unlike_song(

            current_user.id,

            song_id

        )

    )


@bp.route("/check/<song_id>")
@login_required
def is_liked(song_id):

    return jsonify(

        LikesService.is_liked(

            current_user.id,

            song_id

        )

    )


@bp.route("/clear", methods=["DELETE"])
@login_required
def clear():

    return jsonify(

        LikesService.clear(

            current_user.id

        )

    )


@bp.route("/count")
@login_required
def count():

    return jsonify(

        LikesService.count(

            current_user.id

        )

    )