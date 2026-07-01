from flask import Blueprint, request, jsonify
from flask_login import current_user, login_required

from services.history_service import HistoryService

bp = Blueprint("history", __name__)


# -------------------------------------------------------
# Get Recently Played
# -------------------------------------------------------

@bp.route("/", methods=["GET"])
@login_required
def get_history():

    try:

        limit = request.args.get(
            "limit",
            default=20,
            type=int
        )

        history = HistoryService.get_recent(
            current_user.id,
            limit
        )

        return jsonify({
            "success": True,
            "history": history
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------------
# Add Song to History
# -------------------------------------------------------

@bp.route("/", methods=["POST"])
@login_required
def add_history():

    try:

        song = request.get_json()

        HistoryService.add_song(
            current_user.id,
            song
        )

        return jsonify({
            "success": True,
            "message": "Song added to history."
        }), 201

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------------
# Remove Song
# -------------------------------------------------------

@bp.route("/<song_id>", methods=["DELETE"])
@login_required
def remove_song(song_id):

    try:

        HistoryService.remove_song(
            current_user.id,
            song_id
        )

        return jsonify({
            "success": True,
            "message": "Song removed."
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500


# -------------------------------------------------------
# Clear History
# -------------------------------------------------------

@bp.route("/clear", methods=["DELETE"])
@login_required
def clear_history():

    try:

        HistoryService.clear_history(
            current_user.id
        )

        return jsonify({
            "success": True,
            "message": "History cleared."
        }), 200

    except Exception as e:

        return jsonify({
            "success": False,
            "message": str(e)
        }), 500