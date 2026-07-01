from repositories.likes_repository import LikesRepository
from repositories.song_repository import SongRepository


class LikesService:

    @staticmethod
    def like_song(
        user_id,
        song_id
    ):

        LikesRepository.like_song(
            user_id,
            song_id
        )

        return {
            "success": True,
            "message": "Song liked."
        }

    @staticmethod
    def unlike_song(
        user_id,
        song_id
    ):

        LikesRepository.unlike_song(
            user_id,
            song_id
        )

        return {
            "success": True,
            "message": "Song removed."
        }

    @staticmethod
    def get_likes(
        user_id,
        limit=100
    ):

        likes = LikesRepository.get_likes(
            user_id,
            limit
        )

        if not likes:
            return []

        song_ids = [

            like["songId"]

            for like in likes

        ]

        songs = SongRepository.get_songs(
            song_ids
        )

        songs = SongRepository.serialize_many(
            songs
        )

        song_map = {

            song["songId"]: song

            for song in songs

        }

        results = []

        for like in likes:

            song = song_map.get(
                like["songId"]
            )

            if not song:
                continue

            song["likedAt"] = like[
                "likedAt"
            ]

            results.append(song)

        return results

    @staticmethod
    def is_liked(
        user_id,
        song_id
    ):

        return {

            "liked":

            LikesRepository.is_liked(

                user_id,

                song_id

            )

        }

    @staticmethod
    def clear(
        user_id
    ):

        LikesRepository.clear(
            user_id
        )

        return {
            "success": True
        }

    @staticmethod
    def count(
        user_id
    ):

        return {

            "count":

            LikesRepository.count(
                user_id
            )

        }