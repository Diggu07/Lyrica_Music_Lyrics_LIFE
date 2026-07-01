from repositories.song_repository import SongRepository


class ArtistEngine:
    """
    Generates recommendation candidates based on artist affinity.

    Responsibilities
    ----------------
    - Generate candidates from user's favorite artists
    - Generate similar songs based on shared artists
    - Generate songs from a specific artist

    DOES NOT:
    - Rank songs
    - Filter duplicates
    - Filter listened songs
    - Access user history directly
    """

    # ==========================================================
    # From History Profile
    # ==========================================================

    @staticmethod
    def from_history(
        history_profile,
        limit=100
    ):

        artist_weights = history_profile.get(
            "artistWeights",
            {}
        )

        if not artist_weights:
            return []

        ranked_artists = sorted(
            artist_weights.items(),
            key=lambda item: item[1],
            reverse=True
        )

        artist_ids = [
            artist_id
            for artist_id, _
            in ranked_artists
        ]

        # Fetch candidate songs in ONE Mongo query
        songs = SongRepository.get_by_artists(
            artist_ids,
            limit * 5
        )

        # Preserve artist preference ordering
        artist_lookup = {
            artist_id: weight
            for artist_id, weight
            in ranked_artists
        }

        songs.sort(
            key=lambda song: max(
                (
                    artist_lookup.get(
                        artist_id,
                        0
                    )
                    for artist_id in song.get(
                        "artistIds",
                        []
                    )
                ),
                default=0
            ),
            reverse=True
        )

        return songs[:limit]

    # ==========================================================
    # Similar Songs
    # ==========================================================

    @staticmethod
    def get_similar_songs(
        song,
        limit=20
    ):

        songs = SongRepository.get_by_artists(
            song.get(
                "artistIds",
                []
            ),
            limit * 5
        )

        current_song_id = song.get(
            "songId"
        )

        songs = [
            candidate
            for candidate in songs
            if candidate.get("songId") != current_song_id
        ]

        seen = set()
        unique = []

        for candidate in songs:

            song_id = candidate.get(
                "songId"
            )

            if song_id in seen:
                continue

            seen.add(song_id)
            unique.append(candidate)

        return unique[:limit]

    # ==========================================================
    # Artist Recommendations
    # ==========================================================

    @staticmethod
    def get_artist_recommendations(
        artist_id,
        limit=20
    ):

        return SongRepository.get_by_artist(
            artist_id,
            limit
        )