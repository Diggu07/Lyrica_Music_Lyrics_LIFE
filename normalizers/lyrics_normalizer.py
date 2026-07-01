# normalizers/lyrics_normalizer.py

import re


class LyricsNormalizer:
    """
    Converts LRCLIB responses into a consistent API format.
    No HTTP requests.
    No business logic.
    """

    # ---------------------------------------------------------
    # Private Helpers
    # ---------------------------------------------------------

    @staticmethod
    def _parse_lrc(lrc_text: str):
        """
        Converts:

        [00:10.25]Hello

        into

        [
            {
                "time":10.25,
                "line":"Hello"
            }
        ]
        """

        if not lrc_text:
            return []

        pattern = re.compile(
            r"\[(\d{1,2}):(\d{2})\.(\d{2,3})\](.*)"
        )

        lyrics = []

        for raw in lrc_text.splitlines():

            match = pattern.match(raw.strip())

            if not match:
                continue

            mins = int(match.group(1))
            secs = int(match.group(2))
            frac = match.group(3)

            if len(frac) == 3:
                milliseconds = int(frac) / 1000
            else:
                milliseconds = int(frac) / 100

            timestamp = mins * 60 + secs + milliseconds

            line = match.group(4).strip()

            if line:
                lyrics.append({
                    "time": round(timestamp, 2),
                    "line": line
                })

        lyrics.sort(key=lambda x: x["time"])

        return lyrics

    # ---------------------------------------------------------
    # Success Responses
    # ---------------------------------------------------------

    @staticmethod
    def normalize_synced(data):

        synced = data.get("syncedLyrics", "")
        plain = data.get("plainLyrics", "")

        return {
            "lyrics": LyricsNormalizer._parse_lrc(
                synced
            ),
            "has_sync": True,
            "plain": plain
        }

    @staticmethod
    def normalize_plain(data):

        plain = data.get("plainLyrics", "")

        lyrics = []

        for line in plain.splitlines():

            line = line.strip()

            if line:

                lyrics.append({
                    "time": None,
                    "line": line
                })

        return {
            "lyrics": lyrics,
            "has_sync": False,
            "plain": plain
        }

    # ---------------------------------------------------------
    # Error Responses
    # ---------------------------------------------------------

    @staticmethod
    def normalize_not_found():

        return {
            "lyrics": [],
            "has_sync": False,
            "plain": None,
            "note": "Lyrics not found"
        }

    @staticmethod
    def normalize_error(message):

        return {
            "lyrics": [],
            "has_sync": False,
            "plain": None,
            "error": message
        }

    # ---------------------------------------------------------
    # Main Entry
    # ---------------------------------------------------------

    @staticmethod
    def normalize(data):

        if not data:
            return LyricsNormalizer.normalize_not_found()

        if data.get("syncedLyrics"):
            return LyricsNormalizer.normalize_synced(
                data
            )

        if data.get("plainLyrics"):
            return LyricsNormalizer.normalize_plain(
                data
            )

        return LyricsNormalizer.normalize_not_found()