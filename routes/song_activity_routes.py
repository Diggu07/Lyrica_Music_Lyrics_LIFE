# routes/song_activity_routes.py
from flask import Blueprint, request, jsonify

bp = Blueprint("song_activity", __name__)

@bp.route("/history", methods=["GET"])
def listening_history():
    # return example listening history
    return jsonify({"history": [
        {"track_id": 1, "played_at": "2025-01-01T12:00:00Z"},
        {"track_id": 2, "played_at": "2025-01-02T13:00:00Z"}
    ]}), 200

@bp.route("/history", methods=["POST"])
def add_history():
    data = request.get_json() or {}
    # stub to add history
    return jsonify({"success": True, "added": data}), 201
