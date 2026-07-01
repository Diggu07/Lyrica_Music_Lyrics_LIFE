# services/lyrics_service.py

from providers.metadata.lrclib_provider import LRCLIBProvider
from normalizers.lyrics_normalizer import LyricsNormalizer


class LyricsService:
    """
    Business layer for Lyrics.

    Responsibilities:
    - Validate input
    - Call providers
    - Normalize responses

    It SHOULD NOT:
    - Make HTTP requests
    - Parse LRC
    - Format JSON
    """

    @staticmethod
    def get_lyrics(artist, title, duration=None):

        artist = (artist or "").strip()
        title = (title or "").strip()

        if not artist or not title:
            return {
                "error": "artist and title are required"
            }, 400

        data, status = LRCLIBProvider.get_lyrics(
            artist,
            title,
            duration
        )

        if status == 404:
            return LyricsNormalizer.normalize_not_found(), 200

        if status != 200:
            return LyricsNormalizer.normalize_error(
                "Unable to fetch lyrics"
            ), 200

        return LyricsNormalizer.normalize(data), 200