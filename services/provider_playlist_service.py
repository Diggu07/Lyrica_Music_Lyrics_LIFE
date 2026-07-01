from flask import jsonify

from providers.playback.jiosaavn_provider import JioSaavnProvider

from normalizers.metadata_normalizer import MetadataNormalizer

from repositories.provider_playlist_repository import (
    ProviderPlaylistRepository
)

from repositories.search_cache_repository import (
    SearchCacheRepository
)


class ProviderPlaylistService:

    # =====================================================
    # Search
    # =====================================================

    @staticmethod
    def search(
        query,
        limit=20
    ):
        ...
        ...
        return jsonify(...)

    # =====================================================
    # Get Playlist
    # =====================================================

    @staticmethod
    def get_playlist(
        playlist_id
    ):

        playlist = ProviderPlaylistRepository.get(
            playlist_id
        )

        if playlist:

            return jsonify(
                ProviderPlaylistRepository.serialize(
                    playlist
                )
            ), 200

        return jsonify({

            "success": False,

            "message": "Playlist not found"

        }), 404