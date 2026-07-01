from schemas.playlist_schema import PlaylistSchema

from repositories.playlist_repository import PlaylistRepository

from utils.canonical_id import CanonicalId


class PlaylistService:

    # =====================================================
    # Create
    # =====================================================

    @staticmethod
    def create_playlist(
        user_id: str,
        data: dict
    ):

        playlist = PlaylistSchema(

            playlistId=CanonicalId.playlist(

                data.get("name", "New Playlist"),

                user_id

            ),

            userId=user_id,

            name=data.get(
                "name",
                "New Playlist"
            ),

            description=data.get(
                "description",
                ""
            ),

            cover=data.get(
                "cover"
            ),

            songs=[],

            isPublic=False

        )

        PlaylistRepository.save(
            playlist
        )

        return {

            "success": True,

            "playlist": playlist.model_dump()

        }

    # =====================================================
    # List
    # =====================================================

    @staticmethod
    def get_user_playlists(
        user_id: str
    ):

        playlists = PlaylistRepository.get_user_playlists(
            user_id
        )
        if not playlists:
            return []

        return PlaylistRepository.serialize_many(
            playlists
        )

    # =====================================================
    # Get
    # =====================================================

    @staticmethod
    def get_playlists(
        playlist_id: str
    ):

        playlist = PlaylistRepository.get(
            playlist_id
        )

        if not playlist:
            return None

        return PlaylistRepository.serialize(
            playlist
        )

    # =====================================================
    # Rename
    # =====================================================

    @staticmethod
    def rename_playlist(
        playlist_id: str,
        name: str
    ):

        PlaylistRepository.rename(

            playlist_id,

            name

        )

        return {

            "success": True

        }

    # =====================================================
    # Delete
    # =====================================================

    @staticmethod
    def delete_playlist(
        playlist_id: str
    ):

        PlaylistRepository.delete(
            playlist_id
        )

        return {

            "success": True

        }

    # =====================================================
    # Songs
    # =====================================================

    @staticmethod
    def add_song(
        playlist_id: str,
        song_id: str
    ):

        PlaylistRepository.add_song(

            playlist_id,

            song_id

        )

        return {

            "success": True

        }

    @staticmethod
    def remove_song(
        playlist_id: str,
        song_id: str
    ):

        PlaylistRepository.remove_song(

            playlist_id,

            song_id

        )

        return {

            "success": True

        }