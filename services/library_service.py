from services.likes_service import LikesService
from services.history_service import HistoryService
from services.playlist_service import PlaylistService


class LibraryService:

    @staticmethod
    def get_library(
        user_id: str
    ):

        return {

            "likedSongs":
                LikesService.get_likes(
                    user_id
                ),

            "recentlyPlayed":
                HistoryService.get_recent(
                    user_id
                ),

            "playlists":
                PlaylistService.get_user_playlists(
                    user_id
                )

        }