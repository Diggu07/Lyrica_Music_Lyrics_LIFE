from repositories.recommendation_repository import (
    RecommendationRepository
)


class GenreEngine:
    """
    Genre based recommendation engine.
    """

    @staticmethod
    def recommend(
        genre,
        limit=20
    ):

        return RecommendationRepository.get_songs_by_genre(
            genre,
            limit
        )

    @staticmethod
    def recommend_multiple(
        genres,
        limit=50
    ):

        songs = []

        seen = set()

        for genre in genres:

            genre_songs = RecommendationRepository.get_songs_by_genre(
                genre,
                limit
            )

            for song in genre_songs:

                if song["songId"] in seen:
                    continue

                seen.add(song["songId"])

                songs.append(song)

        return songs

    @staticmethod
    def get_song_genre(song):

        return song.get("genre")

    @staticmethod
    def build_profile(song):

        return {
            "genre": GenreEngine.get_song_genre(song)
        }