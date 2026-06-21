from flask import Blueprint, request, jsonify
import requests
from api.config import APIConfig

search_bp = Blueprint("search_bp", __name__)

@search_bp.route("/search")
def search():
    query = request.args.get("q", "")
    if not query:
        return jsonify([])

    # ----- YOUTUBE FALLBACK -----
    api_key = APIConfig.YOUTUBE_API_KEY
    yt_url = (
        "https://www.googleapis.com/youtube/v3/search"
        f"?part=snippet&type=video&q={query}&key={api_key}"
    )

    r = requests.get(yt_url).json()
    
    results = []
    for item in r.get("items", []):
        vid = item["id"]["videoId"]
        snippet = item["snippet"]
        results.append({
            "source": "youtube",
            "title": snippet["title"],
            "artist": snippet["channelTitle"],
            "thumbnail": snippet["thumbnails"]["medium"]["url"],
            "videoId": vid,
        })
    return jsonify(results)
