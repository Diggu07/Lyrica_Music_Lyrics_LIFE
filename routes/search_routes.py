from flask import Blueprint, request, jsonify
from services.search_service import SearchService

search_bp = Blueprint("search_bp", __name__)

@search_bp.route("", methods=["GET"])
def search():
    query = request.args.get("q", "").strip()

    if not query:
        return jsonify([]), 200

    try:
        results = SearchService.search(query)
        return jsonify(results), 200

    except Exception as e:
        return jsonify({
            "success": False,
            "message": str(e)
        }), 500