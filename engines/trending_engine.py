from repositories.song_repository import SongRepository
from repositories.chart_repository import ChartRepository


class TrendingEngine:
    """
    Generates globally trending recommendation candidates.

    Responsibilities
    ----------------
    - Fetch trending songs
    - Fallback to popular songs

    DOES NOT:
    - Rank songs
    - Filter songs
    - Build user profiles
    """

    # ==========================================================
    # Trending
    # ==========================================================

    @staticmethod
    def get_trending(limit=100):

        songs = ChartRepository.get_trending_songs(
            limit
        )

        if songs:
            return songs

        # Fallback if charts haven't been generated
        return SongRepository.get_popular(
            limit
        )