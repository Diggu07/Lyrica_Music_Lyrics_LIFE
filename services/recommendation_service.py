from engines.artist_engine import ArtistEngine
from engines.genre_engine import GenreEngine
from engines.history_engine import HistoryEngine
from engines.likes_engine import LikesEngine
from engines.playlist_engine import PlaylistEngine
from engines.ranking_engine import RankingEngine
from engines.trending_engine import TrendingEngine

from repositories.artist_repository import ArtistRepository
from repositories.song_repository import SongRepository


class RecommendationService:

    # ==========================================================
    # Health
    # ==========================================================

    @staticmethod
    def get_health():

        return {
            "status": "online",
            "service": "RecommendationService",
            "version": "4.0"
        }

    # ==========================================================
    # Trending
    # ==========================================================

    @staticmethod
    def get_trending(limit=20):

        return {
            "title": "Trending",
            "songs": TrendingEngine.get_trending(limit)
        }

    # ==========================================================
    # Popular
    # ==========================================================

    @staticmethod
    def get_popular(limit=20):

        return {
            "title": "Popular Songs",
            "songs": SongRepository.get_popular(limit)
        }

    # ==========================================================
    # New Releases
    # ==========================================================

    @staticmethod
    def get_new_releases(limit=20):

        return {
            "title": "New Releases",
            "songs": SongRepository.get_recent(limit)
        }

    # ==========================================================
    # Similar Songs
    # ==========================================================

    @staticmethod
    def get_similar(
        song_id,
        limit=20
    ):

        song = SongRepository.get(song_id)

        if not song:

            return {
                "error": "Song not found"
            }

        return {
            "title": "Similar Songs",
            "basedOn": song["title"],
            "songs": ArtistEngine.get_similar_songs(
                song,
                limit
            )
        }

    # ==========================================================
    # Artist Recommendations
    # ==========================================================

    @staticmethod
    def get_artist_recommendations(
        artist_id,
        limit=20
    ):

        artist = ArtistRepository.get(
            artist_id
        )

        if not artist:

            return {
                "error": "Artist not found"
            }

        return {
            "title": "More From This Artist",
            "artist": artist["name"],
            "songs": ArtistEngine.get_artist_recommendations(
                artist_id,
                limit
            )
        }

    # ==========================================================
    # Genre Recommendations
    # ==========================================================

    @staticmethod
    def get_genre_recommendations(
        genre,
        limit=20
    ):

        return {
            "title": f"{genre} Picks",
            "genre": genre,
            "songs": GenreEngine.get_recommendations(
                genre,
                limit
            )
        }

    # ==========================================================
    # Private Helpers
    # ==========================================================

    @staticmethod
    def _collect_candidates(
        user_id,
        history_profile
    ):

        candidates = []

        candidates.extend(
            ArtistEngine.from_history(
                history_profile
            )
        )

        candidates.extend(
            GenreEngine.from_history(
                history_profile
            )
        )

        candidates.extend(
            PlaylistEngine.from_user(
                user_id
            )
        )

        candidates.extend(
            TrendingEngine.get_trending(
                100
            )
        )

        return candidates

    # ==========================================================
    # For You
    # ==========================================================

    @staticmethod
    def get_for_you(
        user_id,
        limit=20
    ):

        # ------------------------------------------
        # Build User Profiles
        # ------------------------------------------

        history_profile = HistoryEngine.build_profile(
            user_id
        )

        likes_profile = LikesEngine.build_profile(
            user_id
        )

        # ------------------------------------------
        # Collect Candidate Songs
        # ------------------------------------------

        candidate_songs = RecommendationService._collect_candidates(
            user_id,
            history_profile
        )

        # ------------------------------------------
        # Rank Candidates
        # ------------------------------------------

        recommendations = RankingEngine.rank(
            songs=candidate_songs,
            history_profile=history_profile,
            likes_profile=likes_profile,
            limit=limit
        )

        # ------------------------------------------
        # Response
        # ------------------------------------------

        return {
            "title": "For You",
            "songs": recommendations
        }