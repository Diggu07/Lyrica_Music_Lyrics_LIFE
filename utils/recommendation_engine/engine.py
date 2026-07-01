from repositories.recommendation_repository import (
    RecommendationRepository
)

from utils.recommendation_engine.history import (
    HistoryEngine
)

from utils.recommendation_engine.likes import (
    LikesEngine
)

from utils.recommendation_engine.artist import (
    ArtistEngine
)

from utils.recommendation_engine.genre import (
    GenreEngine
)

from utils.recommendation_engine.playlist import (
    PlaylistEngine
)

from utils.recommendation_engine.trending import (
    TrendingEngine
)

from utils.recommendation_engine.ranking import (
    RankingEngine
)

from utils.recommendation_engine.diversity import (
    DiversityEngine
)


class RecommendationEngine:

    """
    Central recommendation engine.

    All recommendation requests should
    come through this class.
    """

    # ==========================================================
    # Similar Songs
    # ==========================================================

    @staticmethod
    def similar_songs(song, limit=20):

        genre = song.get("genre")

        artist = song.get("artistId")

        genre_songs = GenreEngine.recommend(
            genre,
            limit
        )

        artist_songs = ArtistEngine.recommend_from_related(
            artist,
            limit
        )

        ranked = RankingEngine.rank(

            genres=genre_songs,

            artists=artist_songs

        )

        ids = RankingEngine.top(
            ranked,
            limit
        )

        songs = RecommendationRepository.get_songs(
            ids
        )

        return DiversityEngine.diversify(
            songs
        )

    # ==========================================================
    # Artist Recommendations
    # ==========================================================

    @staticmethod
    def artist_recommendations(
        artist,
        limit=20
    ):

        songs = ArtistEngine.recommend_from_artist(

            artist["artistId"],

            limit

        )

        return DiversityEngine.diversify(
            songs
        )

    # ==========================================================
    # Genre Recommendations
    # ==========================================================

    @staticmethod
    def genre_recommendations(
        genre,
        limit=20
    ):

        songs = GenreEngine.recommend(
            genre,
            limit
        )

        return DiversityEngine.diversify(
            songs
        )

    # ==========================================================
    # Trending
    # ==========================================================

    @staticmethod
    def trending(
        limit=20
    ):

        songs = TrendingEngine.get_trending(
            limit
        )

        return DiversityEngine.diversify(
            songs
        )
    
    # ==========================================================
    # Internal Ranking Helper
    # ==========================================================

    @staticmethod
    def _rank(
        *,
        history=None,
        likes=None,
        artists=None,
        genres=None,
        playlists=None,
        trending=None,
        discovery=None,
        recency=None,
        limit=20
    ):
        """
        Combines all recommendation signals into
        a ranked and diversified song list.
        """

        history = history or []
        likes = likes or []
        artists = artists or []
        genres = genres or []
        playlists = playlists or []
        trending = trending or []
        discovery = discovery or []
        recency = recency or []

        ids = RankingEngine.rank(
            history=history,
            likes=likes,
            artists=artists,
            genres=genres,
            playlists=playlists,
            trending=trending,
            discovery=discovery,
            recency=recency
        )[:limit]

        songs = RecommendationRepository.get_songs_in_order(
            ids
        )

        songs = DiversityEngine.diversify(
            songs,
            discovery=trending
        )

        return songs
    
    # ==========================================================
    # For You
    # ==========================================================

    @staticmethod
    def get_for_you(
        user_id,
        limit=20
    ):

        history_profile = HistoryEngine.build_history_profile(
            user_id
        )

        like_profile = LikesEngine.build_like_profile(
            user_id
        )

        history = RecommendationRepository.get_songs(
            history_profile["mostPlayed"]
        )

        likes = RecommendationRepository.get_songs(
            like_profile["likedSongs"]
        )

        artists = ArtistEngine.recommend_from_multiple_related(
            history_profile["favoriteArtists"],
            100
        )

        genres = GenreEngine.recommend_multiple(
            history_profile["favoriteGenres"]
        )

        playlists = PlaylistEngine.recommend_from_user(
            user_id
        )

        trending = TrendingEngine.get_trending(
            10
        )

        return RecommendationEngine._rank(
            history=history,
            likes=likes,
            artists=artists,
            genres=genres,
            playlists=playlists,
            trending=trending,
            limit=limit
        )
    
    # ==========================================================
    # Discover
    # ==========================================================

    @staticmethod
    def get_discover(
        user_id,
        limit=20
    ):

        history = HistoryEngine.build_history_profile(
            user_id
        )

        genres = GenreEngine.recommend_multiple(
            history["favoriteGenres"]
        )

        trending = TrendingEngine.get_recent_trending(
            limit
        )

        discovery = RecommendationRepository.get_recent_releases(
            limit
        )

        return RecommendationEngine._rank(

            genres=genres,

            trending=trending,

            discovery=discovery,

            limit=limit

        )

    # ==========================================================
    # Daily Mix
    # ==========================================================

    @staticmethod
    def get_daily_mix(
        user_id,
        limit=50
    ):

        history = HistoryEngine.build_history_profile(
            user_id
        )

        likes = LikesEngine.build_like_profile(
            user_id
        )

        history_songs = RecommendationRepository.get_songs(
            history["mostPlayed"]
        )

        liked_songs = RecommendationRepository.get_songs(
            likes["likedSongs"]
        )

        artists = ArtistEngine.recommend_from_multiple_related(
            history["favoriteArtists"],
            100
        )

        genres = GenreEngine.recommend_multiple(
            history["favoriteGenres"]
        )

        trending = TrendingEngine.get_trending(
            10
        )

        return RecommendationEngine._rank(

            history=history_songs,

            likes=liked_songs,

            artists=artists,

            genres=genres,

            trending=trending,

            limit=limit

        )
    
    # ==========================================================
    # Song Radio
    # ==========================================================

    @staticmethod
    def get_radio(
        song_id,
        limit=30
    ):

        song = RecommendationRepository.get_song(
            song_id
        )

        if not song:
            return []

        genre = GenreEngine.recommend(
            song["genre"],
            limit
        )

        artist = ArtistEngine.recommend_from_related(
            song["artistId"],
            limit
        )

        trending = TrendingEngine.get_trending(
            10
        )

        return RecommendationEngine._rank(

            artists=artist,

            genres=genre,

            trending=trending,

            limit=limit

        )
    
    # ==========================================================
    # New Releases
    # ==========================================================

    @staticmethod
    def new_releases(
        limit=20
    ):

        return RecommendationRepository.get_recent_releases(
            limit
        )