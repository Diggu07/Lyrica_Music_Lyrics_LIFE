# routes/discover_routes.py
from flask import Blueprint, jsonify

bp = Blueprint("discover", __name__)

@bp.route("/recommended", methods=["GET"])
def recommended():
    # example recommended tracks or playlists
    return jsonify({"recommended": [
        {"id": 101, "type": "track", "title": "Discover Track A"},
        {"id": 201, "type": "playlist", "name": "Chill Vibes"}
    ]}), 200
