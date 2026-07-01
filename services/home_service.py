from repositories.chart_repository import ChartRepository
from repositories.provider_playlist_repository import (
    ProviderPlaylistRepository
)

from services.history_service import HistoryService
from services.likes_service import LikesService
from services.playlist_service import PlaylistService


class HomeService:

    @staticmethod
    def get_home(
        user_id: str
    ):

        return {

            "hero": HomeService.get_hero(),

            "charts": HomeService.get_charts(),

            "featuredPlaylists": HomeService.get_featured_playlists(),

            "recentlyPlayed": HomeService.get_recently_played(
                user_id
            ),

            "likedSongs": HomeService.get_liked_songs(
                user_id
            ),

            "yourPlaylists": HomeService.get_user_playlists(
                user_id
            )

        }

    # ---------------------------------------------------------
    # Hero
    # ---------------------------------------------------------

    @staticmethod
    def get_hero():

        playlists = ProviderPlaylistRepository.get_featured(
            limit=1
        )

        return playlists[0] if playlists else None

    # ---------------------------------------------------------
    # Charts
    # ---------------------------------------------------------

    @staticmethod
    def get_charts():

        return {

            "india": ChartRepository.get_chart(
                "india"
            ),

            "worldwide": ChartRepository.get_chart(
                "worldwide"
            )

        }

    # ---------------------------------------------------------
    # Featured Playlists
    # ---------------------------------------------------------

    @staticmethod
    def get_featured_playlists():

        return ProviderPlaylistRepository.get_featured(
            limit=10
        )

    # ---------------------------------------------------------
    # Recently Played
    # ---------------------------------------------------------

    @staticmethod
    def get_recently_played(
        user_id
    ):

        return HistoryService.get_recent(
            user_id,
            limit=10
        )

    # ---------------------------------------------------------
    # Liked Songs
    # ---------------------------------------------------------

    @staticmethod
    def get_liked_songs(
        user_id
    ):

        return LikesService.get_likes(
            user_id,
            limit=10
        )

    # ---------------------------------------------------------
    # User Playlists
    # ---------------------------------------------------------

    @staticmethod
    def get_user_playlists(
        user_id
    ):

        return PlaylistService.get_user_playlists(
            user_id
        )