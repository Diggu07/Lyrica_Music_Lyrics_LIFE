from repositories.recommendation_repository import (
    RecommendationRepository
)


class LikesEngine:

    """
    Recommendation signals from
    liked songs.
    """

    @staticmethod
    def get_liked_song_ids(user_id):

        return RecommendationRepository.get_user_liked_songs(
            user_id
        )

    @staticmethod
    def get_liked_songs(user_id):

        song_ids = LikesEngine.get_liked_song_ids(
            user_id
        )

        return RecommendationRepository.get_songs(
            song_ids
        )

    @staticmethod
    def get_liked_artists(user_id):

        artists = set()

        songs = LikesEngine.get_liked_songs(
            user_id
        )

        for song in songs:

            artists.add(
                song["artistId"]
            )

        return list(artists)

    @staticmethod
    def get_liked_genres(user_id):

        genres = set()

        songs = LikesEngine.get_liked_songs(
            user_id
        )

        for song in songs:

            genre = song.get("genre")

            if genre:
                genres.add(genre)

        return list(genres)

    @staticmethod
    def build_like_profile(user_id):

        return {

            "likedSongs":
                LikesEngine.get_liked_song_ids(
                    user_id
                ),

            "likedArtists":
                LikesEngine.get_liked_artists(
                    user_id
                ),

            "likedGenres":
                LikesEngine.get_liked_genres(
                    user_id
                )

        }