from collections import OrderedDict


class RankingEngine:
    """
    Ranks recommendation candidates.

    Responsibilities
    ----------------
    - Remove duplicate songs
    - Filter listened songs
    - Filter liked songs
    - Score candidates
    - Sort by score

    DOES NOT query MongoDB.
    """
    # ==========================================================
    # Scoring Weights
    # ==========================================================

    ARTIST_HISTORY_WEIGHT = 1.0
    ARTIST_LIKE_WEIGHT = 3.0

    GENRE_HISTORY_WEIGHT = 0.8
    GENRE_LIKE_WEIGHT = 2.5

    POPULARITY_WEIGHT = 0.10
    # For future
    RECENCY_WEIGHT = 2.0
    PLAY_COUNT_WEIGHT = 1.5
    PLAYLIST_WEIGHT = 2.0
    TRENDING_WEIGHT = 1.0
    FRESHNESS_WEIGHT = 0.5
    # ==========================================================
    # Public API
    # ==========================================================

    @staticmethod
    def rank(
        songs,
        history_profile,
        likes_profile,
        limit=None
    ):

        if not songs:
            return []

        songs = RankingEngine._remove_duplicates(songs)

        songs = RankingEngine._filter_listened(
            songs,
            history_profile
        )

        songs = RankingEngine._filter_liked(
            songs,
            likes_profile
        )

        ranked = []

        for song in songs:

            score = RankingEngine._calculate_score(
                song,
                history_profile,
                likes_profile
            )

            song = dict(song)
            song["recommendationScore"] = score

            ranked.append(song)

        ranked.sort(
            key=lambda song: song["recommendationScore"],
            reverse=True
        )

        if limit:
            ranked = ranked[:limit]

        return ranked

    # ==========================================================
    # Remove duplicate songs
    # ==========================================================

    @staticmethod
    def _remove_duplicates(songs):

        unique = OrderedDict()

        for song in songs:

            song_id = song.get("songId")

            if song_id:
                unique[song_id] = song

        return list(unique.values())

    # ==========================================================
    # Remove already listened songs
    # ==========================================================

    @staticmethod
    def _filter_listened(
        songs,
        history_profile
    ):

        listened = set(
            history_profile.get(
                "listenedSongIds",
                []
            )
        )

        return [
            song
            for song in songs
            if song["songId"] not in listened
        ]

    # ==========================================================
    # Remove already liked songs
    # ==========================================================

    @staticmethod
    def _filter_liked(
        songs,
        likes_profile
    ):

        liked = set(
            likes_profile.get(
                "likedSongIds",
                []
            )
        )

        return [
            song
            for song in songs
            if song["songId"] not in liked
        ]

    # ==========================================================
    # Score calculation
    # ==========================================================

    @staticmethod
    def _calculate_score(
        song,
        history_profile,
        likes_profile
    ):

        score = 0.0

        history_artist = history_profile.get(
            "artistWeights",
            {}
        )

        likes_artist = likes_profile.get(
            "artistWeights",
            {}
        )

        history_genre = history_profile.get(
            "genreWeights",
            {}
        )

        likes_genre = likes_profile.get(
            "genreWeights",
            {}
        )

        # ------------------------------------------
        # Artist Affinity
        # ------------------------------------------

        for artist_id in song.get("artistIds", []):

            score += (
                history_artist.get(artist_id, 0)
                * RankingEngine.ARTIST_HISTORY_WEIGHT
            )

            score += (
                likes_artist.get(artist_id, 0)
                * RankingEngine.ARTIST_LIKE_WEIGHT
            )

        # ------------------------------------------
        # Genre Affinity
        # ------------------------------------------

        for genre in song.get("genres", []):

            score += (
                history_genre.get(genre, 0)
                * RankingEngine.GENRE_HISTORY_WEIGHT
            )

            score += (
                likes_genre.get(genre, 0)
                * RankingEngine.GENRE_LIKE_WEIGHT
            )

        # ------------------------------------------
        # Popularity Boost
        # ------------------------------------------

        popularity = song.get("popularity", 0)

        score += (
            popularity
            * RankingEngine.POPULARITY_WEIGHT
        )

        return round(score, 2)