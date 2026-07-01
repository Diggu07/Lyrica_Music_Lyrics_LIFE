from datetime import datetime, timedelta, timezone

from repositories.artist_repository import ArtistRepository
from utils.artist_aggregator import (
    seed_database,
    trigger_background_refresh,
)
from normalizers.artist_normalizer import ArtistNormalizer

class ArtistService:

    # ==========================================================
    # Health
    # ==========================================================

    @staticmethod
    def get_health():
        seed_database()

        counts = ArtistRepository.get_collection_counts()
        queue = ArtistRepository.get_queue_counts()

        health_docs = ArtistRepository.get_source_health()

        source_health = {}

        for doc in health_docs:
            source_health[doc["source"]] = {
                "lastRequest": doc.get("lastRequest").isoformat()
                if doc.get("lastRequest")
                else None,
                "requestsToday": doc.get("requestsToday", 0),
                "successCount": doc.get("successCount", 0),
                "failureCount": doc.get("failureCount", 0),
                "isRateLimited": doc.get("isRateLimited", False),
            }

        return {
            "status": "online",
            "counts": counts,
            "queue": queue,
            "sourceHealth": source_health,
            "aggregatedArtists": queue["complete"],
            "pendingArtists": queue["pending"],
        }, 200

    # ==========================================================
    # Artist Profile
    # ==========================================================

    @staticmethod
    def get_artist(artist_id):

        seed_database()

        artist = ArtistRepository.get_artist(artist_id)

        # Resolve aliases
        if not artist:

            alias = ArtistRepository.get_artist_by_alias(
                artist_id
            )

            if alias:
                artist = ArtistRepository.get_artist(
                    alias["artistId"]
                )

        # Unknown artist
        if not artist:

            trigger_background_refresh(artist_id)

            artist = ArtistRepository.get_artist(
                artist_id
            )

            if not artist:
                return {
                    "error": "Artist not found"
                }, 404

        # Refresh stale metadata
        last_updated = artist.get("lastAggregated")

        if last_updated:

            if last_updated.tzinfo is None:
                now = datetime.utcnow()
            else:
                now = datetime.now(timezone.utc)

            if now - last_updated > timedelta(days=7):
                trigger_background_refresh(
                    artist["artistId"]
                )

        artist = ArtistNormalizer.normalize_artist(artist)

        return artist, 200

    # ==========================================================
    # Analytics
    # ==========================================================

    @staticmethod
    def get_artist_analytics(artist_id):

        analytics = ArtistRepository.get_artist_analytics(
            artist_id
        )

        if not analytics:
            return {
                "error": "Analytics not found"
            }, 404

        analytics = ArtistNormalizer.normalize_analytics(analytics)

        return analytics, 200

    # ==========================================================
    # Songs
    # ==========================================================

    @staticmethod
    def get_artist_songs(artist_id):

        artist = ArtistRepository.get_artist(
            artist_id
        )

        if not artist:
            return {
                "error": "Artist not found"
            }, 404

        songs = ArtistRepository.get_artist_songs(
            artist_id
        )

        songs = ArtistNormalizer.normalize_song_list(songs)

        return {
            "songs": songs
        }, 200

    # ==========================================================
    # Albums
    # ==========================================================

    @staticmethod
    def get_artist_albums(artist_id):

        artist = ArtistRepository.get_artist(
            artist_id
        )

        if not artist:
            return {
                "error": "Artist not found"
            }, 404

        albums = ArtistRepository.get_artist_albums(
            artist_id
        )

        albums = ArtistNormalizer.normalize_album_list(albums)

        return albums, 200