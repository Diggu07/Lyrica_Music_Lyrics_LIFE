from flask import Blueprint, jsonify, request

from services.search_service import SearchService
from services.playback_service import PlaybackService
from services.metadata_service import MetadataService
from services.featured_service import FeaturedService
from services.chart_service import ChartService

bp = Blueprint("music", __name__)

@bp.route("/search", methods=["GET"])
def search_tracks():

    query = request.args.get("q", "").strip()
    source = request.args.get("source", "saavn").strip().lower()
    search_type = request.args.get("type", "all").strip().lower()
    limit = min(int(request.args.get("limit", 20)), 30)

    if not query:
        return jsonify({
            "results": [],
            "source": "none"
        }), 200

    result = SearchService.search(
        query=query,
        source=source,
        search_type=search_type,
        limit=limit
    )

    return jsonify(result), 200

@bp.route("/stream", methods=["GET"])
def get_stream_url():

    song_id = request.args.get("id", "").strip()
    quality = request.args.get("quality", "160kbps")

    if not song_id:
        return jsonify({"error": "id is required"}), 400

    try:

        result = PlaybackService.get_stream(
            song_id=song_id,
            quality=quality,
        )

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500
    
@bp.route("/tracks/<track_id>", methods=["GET"])
def get_track(track_id):

    try:

        result = MetadataService.get_track(track_id)

        return jsonify(result), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 404
    
@bp.route("/featured", methods=["GET"])
def get_featured():

    try:

        return jsonify(
            FeaturedService.get_featured()
        ), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500


@bp.route("/charts", methods=["GET"])
def get_charts():
    """
    Returns chart overview or a specific chart.
    """

    chart_type = request.args.get("type", "worldwide")
    language = request.args.get("language")
    region = request.args.get("region")

    overview = (
        request.args.get("overview", "false").lower() == "true"
    )

    refresh = (
        request.args.get("refresh", "false").lower() == "true"
    )

    try:

        result = ChartService.get_chart(
            chart_type=chart_type,
            language=language,
            region=region,
            overview=overview,
            refresh=refresh,
        )

        return jsonify(result), 200

    except ValueError as e:

        return jsonify({
            "error": str(e)
        }), 400

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500