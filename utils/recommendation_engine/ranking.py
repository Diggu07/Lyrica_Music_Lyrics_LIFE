from collections import defaultdict


class RankingEngine:
    """
    Combines recommendation signals into a
    single ranked recommendation list.
    """

    # ==========================================================
    # Weights
    # ==========================================================

    HISTORY_WEIGHT = 35
    LIKES_WEIGHT = 20
    ARTIST_WEIGHT = 15
    GENRE_WEIGHT = 10
    PLAYLIST_WEIGHT = 5
    TRENDING_WEIGHT = 5
    RECENCY_WEIGHT = 5
    DISCOVERY_WEIGHT = 5

    # ==========================================================
    # Initialize
    # ==========================================================

    @staticmethod
    def empty_scores():

        return defaultdict(float)

    # ==========================================================
    # Generic Scoring
    # ==========================================================

    @staticmethod
    def add_score(
        scores,
        songs,
        weight
    ):

        if not songs:
            return

        total = len(songs)

        if total == 0:
            return

        for index, song in enumerate(songs):

            if not song:
                continue

            song_id = song.get("songId")

            if not song_id:
                continue

            #
            # Earlier songs receive slightly
            # higher score than later songs.
            #

            score = (
                (total - index)
                / total
            ) * weight

            scores[song_id] += score

    # ==========================================================
    # Individual Signals
    # ==========================================================

    @staticmethod
    def history(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.HISTORY_WEIGHT
        )

    @staticmethod
    def likes(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.LIKES_WEIGHT
        )

    @staticmethod
    def artists(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.ARTIST_WEIGHT
        )

    @staticmethod
    def genres(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.GENRE_WEIGHT
        )

    @staticmethod
    def playlists(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.PLAYLIST_WEIGHT
        )

    @staticmethod
    def trending(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.TRENDING_WEIGHT
        )

    @staticmethod
    def recency(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.RECENCY_WEIGHT
        )

    @staticmethod
    def discovery(
        scores,
        songs
    ):

        RankingEngine.add_score(
            scores,
            songs,
            RankingEngine.DISCOVERY_WEIGHT
        )

    # ==========================================================
    # Final Ranking
    # ==========================================================

    @staticmethod
    def rank(
        history=None,
        likes=None,
        artists=None,
        genres=None,
        playlists=None,
        trending=None,
        recency=None,
        discovery=None
    ):

        history = history or []
        likes = likes or []
        artists = artists or []
        genres = genres or []
        playlists = playlists or []
        trending = trending or []
        recency = recency or []
        discovery = discovery or []

        scores = RankingEngine.empty_scores()

        RankingEngine.history(
            scores,
            history
        )

        RankingEngine.likes(
            scores,
            likes
        )

        RankingEngine.artists(
            scores,
            artists
        )

        RankingEngine.genres(
            scores,
            genres
        )

        RankingEngine.playlists(
            scores,
            playlists
        )

        RankingEngine.trending(
            scores,
            trending
        )

        RankingEngine.recency(
            scores,
            recency
        )

        RankingEngine.discovery(
            scores,
            discovery
        )

        ranked = sorted(
            scores.items(),
            key=lambda item: item[1],
            reverse=True
        )

        return [
            song_id
            for song_id, _
            in ranked
        ]
