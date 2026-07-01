from providers.dto.song_dto import SongDTO
from providers.dto.artist_dto import ArtistDTO
from providers.dto.album_dto import AlbumDTO

from schemas.song_schema import SongSchema
from schemas.artist_schema import ArtistSchema
from schemas.album_schema import AlbumSchema

from providers.dto.provider_playlist_dto import ProviderPlaylistDTO
from schemas.provider_playlist_schema import ProviderPlaylistSchema

from utils.canonical_id import CanonicalId
from utils.text_utils import TextUtils


class MetadataNormalizer:
    """
    Converts provider DTOs into canonical Lyrica schemas.

    Responsibilities
    ----------------
    ✓ Generate canonical IDs
    ✓ Normalize text
    ✓ Build schema objects

    Never:
    ✗ Access MongoDB
    ✗ Call repositories
    ✗ Call providers
    ✗ Perform business logic
    """

    # ==========================================================
    # SONG
    # ==========================================================

    @staticmethod
    def normalize_song(dto: SongDTO) -> SongSchema:

        artists = [
            TextUtils.normalize(name)
            for name in dto.artists
            if name
        ]

        artist_ids = [
            CanonicalId.artist(name)
            for name in artists
        ]

        album_id = (
            CanonicalId.album(
                dto.album,
                artists
            )
            if dto.album
            else None
        )

        return SongSchema(

            songId=CanonicalId.song(
                dto.title,
                artists,
                dto.album or ""
            ),

            title=dto.title,

            normalizedTitle=TextUtils.normalize(
                dto.title
            ),

            artistIds=artist_ids,

            albumId=album_id,

            genres=dto.genres,

            language=dto.language,

            explicit=dto.explicit,

            cover=dto.cover,

            thumbnail=dto.thumbnail,

            duration=dto.duration,

            durationSecs=dto.durationSecs,

            popularity=dto.popularity,

            defaultProvider=dto.provider,

            isPlayable=dto.playable
        )

    # ==========================================================
    # ARTIST
    # ==========================================================

    @staticmethod
    def normalize_artist(dto: ArtistDTO) -> ArtistSchema:

        return ArtistSchema(

            artistId=CanonicalId.artist(
                dto.name
            ),

            name=dto.name,

            normalizedName=TextUtils.normalize(
                dto.name
            ),

            aliases=dto.aliases,

            image=dto.image,

            banner=dto.banner,

            bio=dto.bio,

            country=dto.country,

            genres=dto.genres,

            popularity=dto.popularity,

            followers=dto.followers,

            monthlyListeners=dto.monthlyListeners,

            socialLinks=dto.socialLinks
        )

    # ==========================================================
    # ALBUM
    # ==========================================================

    @staticmethod
    def normalize_album(dto: AlbumDTO) -> AlbumSchema:

        artists = [
            TextUtils.normalize(name)
            for name in dto.artists
            if name
        ]

        artist_ids = [
            CanonicalId.artist(name)
            for name in artists
        ]

        return AlbumSchema(

            albumId=CanonicalId.album(
                dto.title,
                artists
            ),

            title=dto.title,

            normalizedTitle=TextUtils.normalize(
                dto.title
            ),

            artistIds=artist_ids,

            cover=dto.cover,

            thumbnail=dto.thumbnail,

            releaseDate=dto.releaseDate,

            year=dto.year,

            totalTracks=dto.totalTracks,

            language=dto.language,

            genres=dto.genres,

            popularity=dto.popularity
        )

    # ==========================================================
    # PLAYLIST
    # ==========================================================

    @staticmethod
    def normalize_playlist(
        dto: ProviderPlaylistDTO
    ) -> ProviderPlaylistSchema:

        return ProviderPlaylistSchema(

            playlistId=CanonicalId.playlist(

                dto.title,

                dto.owner or ""

            ),

            provider=dto.provider,

            providerId=dto.provider_id,

            title=dto.title,

            normalizedTitle=TextUtils.normalize(

                dto.title

            ),

            subtitle=dto.subtitle,

            owner=dto.owner,

            cover=dto.cover,

            thumbnail=dto.thumbnail,

            language=dto.language,

            songCount=dto.song_count,

            isPublic=dto.public

        )
    

    # ==========================================================
    # COLLECTION HELPERS
    # ==========================================================

    @staticmethod
    def normalize_songs(dtos: list[SongDTO]) -> list[SongSchema]:

        return [
            MetadataNormalizer.normalize_song(dto)
            for dto in dtos
        ]

    @staticmethod
    def normalize_artists(dtos: list[ArtistDTO]) -> list[ArtistSchema]:

        return [
            MetadataNormalizer.normalize_artist(dto)
            for dto in dtos
        ]

    @staticmethod
    def normalize_albums(dtos: list[AlbumDTO]) -> list[AlbumSchema]:

        return [
            MetadataNormalizer.normalize_album(dto)
            for dto in dtos
        ]
    
    @staticmethod
    def normalize_playlists(
        dtos: list[ProviderPlaylistDTO]
    ) -> list[ProviderPlaylistSchema]:

        return [
            MetadataNormalizer.normalize_playlist(dto)
            for dto in dtos
        ]