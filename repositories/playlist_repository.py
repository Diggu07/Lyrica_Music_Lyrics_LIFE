from repositories.base_repository import BaseRepository
from schemas.playlist_schema import PlaylistSchema


class PlaylistRepository(BaseRepository):

    collection_name = "playlists"

    @classmethod
    def save(
        cls,
        playlist: PlaylistSchema
    ):
        cls.upsert_schema(
            playlist,
            key="playlistId"
        )

    @classmethod
    def get(
        cls,
        playlist_id
    ):
        return cls.find_one({

            "playlistId": playlist_id

        })

    @classmethod
    def get_user_playlists(
        cls,
        user_id
    ):
        return cls.find({

            "userId": user_id

        })

    @classmethod
    def delete(
        cls,
        playlist_id
    ):
        return cls.delete_one({

            "playlistId": playlist_id

        })

    @classmethod
    def add_song(
        cls,
        playlist_id,
        song_id
    ):
        return cls.update_one(

            {

                "playlistId": playlist_id

            },

            {

                "$addToSet": {

                    "songs": song_id

                }

            }

        )

    @classmethod
    def remove_song(
        cls,
        playlist_id,
        song_id
    ):
        return cls.update_one(

            {

                "playlistId": playlist_id

            },

            {

                "$pull": {

                    "songs": song_id

                }

            }

        )

    @classmethod
    def rename(
        cls,
        playlist_id,
        name
    ):
        return cls.update_one(

            {

                "playlistId": playlist_id

            },

            {

                "$set": {

                    "name": name

                }

            }

        )