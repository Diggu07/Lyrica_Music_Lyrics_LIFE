from repositories.base_repository import BaseRepository


class UserSavedPlaylistRepository(BaseRepository):

    collection_name = "saved_playlists"

    @classmethod
    def save_playlist(

        cls,

        user_id,

        provider_playlist_id

    ):

        cls.upsert(

            {

                "userId": user_id,

                "playlistId": provider_playlist_id

            },

            {

                "userId": user_id,

                "playlistId": provider_playlist_id

            }

        )

    @classmethod
    def remove_playlist(

        cls,

        user_id,

        provider_playlist_id

    ):

        return cls.delete_one({

            "userId": user_id,

            "playlistId": provider_playlist_id

        })

    @classmethod
    def get_saved(

        cls,

        user_id

    ):

        return cls.find({

            "userId": user_id

        })