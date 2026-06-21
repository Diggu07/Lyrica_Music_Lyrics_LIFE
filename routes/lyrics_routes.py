# routes/lyrics_routes.py
"""
Lyrics routes — powered by LRCLIB (free, no API key needed).
Returns timed LRC lyrics parsed into a JS-friendly array.
"""
from flask import Blueprint, request, jsonify
import requests
import re

lyrics_bp = Blueprint("lyrics", __name__)

LRCLIB_BASE = "https://lrclib.net/api"


def _parse_lrc(lrc_text: str) -> list:
    """
    Parse LRC format into [{time: float_seconds, line: str}] sorted by time.
    LRC format: [mm:ss.xx] lyric text
    """
    if not lrc_text:
        return []

    pattern = re.compile(r"\[(\d{1,2}):(\d{2})\.(\d{2,3})\](.*)")
    lines = []

    for raw_line in lrc_text.splitlines():
        match = pattern.match(raw_line.strip())
        if match:
            mins = int(match.group(1))
            secs = int(match.group(2))
            centis = match.group(3)
            # Normalize to 2-decimal centiseconds
            if len(centis) == 3:
                frac = int(centis) / 1000
            else:
                frac = int(centis) / 100
            time_secs = mins * 60 + secs + frac
            lyric_line = match.group(4).strip()
            if lyric_line:  # Skip empty lines
                lines.append({"time": round(time_secs, 2), "line": lyric_line})

    return sorted(lines, key=lambda x: x["time"])


@lyrics_bp.route("", methods=["GET"])
def get_lyrics():
    """
    Fetch timed lyrics from LRCLIB.
    GET /api/lyrics?artist=<artist>&title=<title>&duration=<seconds>

    Returns:
      { lyrics: [{time, line}], has_sync: bool, plain: str|null }
    """
    artist = request.args.get("artist", "").strip()
    title = request.args.get("title", "").strip()
    duration = request.args.get("duration", "")

    if not artist or not title:
        return jsonify({"error": "artist and title are required"}), 400

    params = {
        "artist_name": artist,
        "track_name": title,
    }
    if duration:
        try:
            params["duration"] = int(float(duration))
        except ValueError:
            pass

    try:
        r = requests.get(f"{LRCLIB_BASE}/get", params=params, timeout=8)

        if r.status_code == 404:
            # Try without duration as a fallback
            params_no_dur = {"artist_name": artist, "track_name": title}
            r2 = requests.get(f"{LRCLIB_BASE}/get", params=params_no_dur, timeout=8)
            if r2.status_code == 404:
                return jsonify({
                    "lyrics": [],
                    "has_sync": False,
                    "plain": None,
                    "note": "Lyrics not found in LRCLIB",
                }), 200
            r = r2

        if not r.ok:
            return jsonify({
                "lyrics": [],
                "has_sync": False,
                "plain": None,
                "note": f"LRCLIB returned {r.status_code}",
            }), 200

        data = r.json()
        synced_lrc = data.get("syncedLyrics") or ""
        plain_text = data.get("plainLyrics") or ""

        if synced_lrc:
            parsed = _parse_lrc(synced_lrc)
            return jsonify({
                "lyrics": parsed,
                "has_sync": True,
                "plain": plain_text,
            }), 200

        # Fall back to plain lyrics — split into lines with no timestamps
        if plain_text:
            plain_lines = [
                {"time": None, "line": line.strip()}
                for line in plain_text.splitlines()
                if line.strip()
            ]
            return jsonify({
                "lyrics": plain_lines,
                "has_sync": False,
                "plain": plain_text,
            }), 200

        return jsonify({
            "lyrics": [],
            "has_sync": False,
            "plain": None,
            "note": "No lyrics content available",
        }), 200

    except Exception as e:
        print(f"[lyrics] Error fetching from LRCLIB: {e}")
        return jsonify({
            "lyrics": [],
            "has_sync": False,
            "plain": None,
            "error": str(e),
        }), 200
