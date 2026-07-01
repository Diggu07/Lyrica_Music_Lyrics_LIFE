from repositories.song_repository import SongRepository


class GenreEngine:
    """
    Generates recommendation candidates based on genre affinity.

    Responsibilities
    ----------------
    - Generate candidates from user's favorite genres

    DOES NOT:
    - Rank songs
    - Remove duplicates
    - Filter listened songs
    - Query history directly
    """

    # ==========================================================
    # From History Profile
    # ==========================================================

    @staticmethod
    def from_history(
        history_profile,
        limit=100
    ):

        genre_weights = history_profile.get(
            "genreWeights",
            {}
        )

        if not genre_weights:
            return []

        ranked_genres = sorted(
            genre_weights.items(),
            key=lambda item: item[1],
            reverse=True
        )

        genres = [
            genre
            for genre, _
            in ranked_genres
        ]

        # One Mongo query
        songs = SongRepository.get_by_genres(
            genres,
            limit * 5
        )

        genre_lookup = {
            genre: weight
            for genre, weight
            in ranked_genres
        }

        songs.sort(

            key=lambda song: max(

                (
                    genre_lookup.get(
                        genre,
                        0
                    )

                    for genre in song.get(
                        "genres",
                        []
                    )

                ),

                default=0

            ),

            reverse=True

        )

        return songs[:limit]

    # ==========================================================
    # Genre Recommendations
    # ==========================================================

    @staticmethod
    def get_recommendations(
        genre,
        limit=20
    ):

        return SongRepository.get_by_genre(
            genre,
            limit
        )