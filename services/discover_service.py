from repositories.song_repository import SongRepository
from repositories.album_repository import AlbumRepository
from repositories.artist_repository import ArtistRepository
from repositories.provider_playlist_repository import (
    ProviderPlaylistRepository
)


class DiscoverService:

    @staticmethod
    def get_discover():

        return {

            "trending":
                SongRepository.serialize_many(
                    SongRepository.get_popular(20)
                ),

            "newReleases":
                SongRepository.serialize_many(
                    SongRepository.get_recent(20)
                ),

            "popularArtists":
                ArtistRepository.serialize_many(
                    ArtistRepository.get_popular(20)
                ),

            "popularAlbums":
                AlbumRepository.serialize_many(
                    AlbumRepository.get_popular(20)
                ),

            "featuredPlaylists":
                ProviderPlaylistRepository.serialize_many(
                    ProviderPlaylistRepository.get_featured(20)
                )

        }