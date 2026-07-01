import re
from normalizers.metadata_normalizer import MetadataNormalizer

from providers.playback.jiosaavn_provider import JioSaavnProvider
from providers.playback.ytmusic_provider import YTMusicProvider
from providers.dto.song_dto import SongDTO
from providers.dto.album_dto import AlbumDTO
from providers.dto.artist_dto import ArtistDTO
from providers.dto.provider_playlist_dto import ProviderPlaylistDTO

from repositories.song_repository import SongRepository
from repositories.search_cache_repository import SearchCacheRepository
from repositories.album_repository import AlbumRepository
from repositories.artist_repository import ArtistRepository
from repositories.provider_playlist_repository import (
    ProviderPlaylistRepository
)

class MetadataService:

    
    @staticmethod
    def search(
        query,
        source="saavn",
        search_type="all",
        limit=20
    ):

        

        # ----------------------------------------
        # Search Cache
        # ----------------------------------------



        cache_key = f"{query.lower().strip()}:{source}:{search_type}"

        cached = SearchCacheRepository.get(cache_key)
        if cached:
            return {
                "results": cached["value"],
                "cached": True,
                "source":source
            }

        # ----------------------------------------
        # MongoDB Songs
        # ----------------------------------------

        songs = SongRepository.search(
            query=query,
            limit=limit
        )

        if songs:

            print("[MetadataService] MongoDB HIT")

            songs = SongRepository.serialize_many(
                songs
            )

            SearchCacheRepository.save(
    cache_key,
    songs
)

            return {

                "results": songs,

                "cached": True,

                "source": "mongodb"

            }

        print("[MetadataService] MongoDB MISS")

        # ----------------------------------------
        # Provider
        # ----------------------------------------

        if source == "youtube":

            provider_results = YTMusicProvider.search(

                query=query,

                search_type=search_type,

                limit=limit

            )

            if not provider_results:

                provider_results = JioSaavnProvider.search(

                    query=query,

                    search_type=search_type,

                    limit=limit

                )

                source = "saavn"

        else:

            provider_results = JioSaavnProvider.search(

                query=query,

                search_type=search_type,

                limit=limit

            )

        if not provider_results:

            return {
            
                "results": [],

                "cached": False,

                "source": source

            }

        # ----------------------------------------
        # Normalize
        # ----------------------------------------

        results = []

        for dto in provider_results:
        
            schema = None

            if isinstance(dto, SongDTO):
            
                schema = MetadataNormalizer.normalize_song(dto)

                SongRepository.save(schema)

            elif isinstance(dto, AlbumDTO):
            
                schema = MetadataNormalizer.normalize_album(dto)

                AlbumRepository.save(schema)

            elif isinstance(dto, ArtistDTO):
            
                schema = MetadataNormalizer.normalize_artist(dto)

                ArtistRepository.save(schema)

            elif isinstance(dto, ProviderPlaylistDTO):
            
                schema = MetadataNormalizer.normalize_playlist(dto)

                ProviderPlaylistRepository.save(schema)

            if schema:
            
                results.append(
                    schema.model_dump(exclude_none=True)
                )

        SearchCacheRepository.save(

            cache_key,

            results

        )
        print(
            f"[MetadataService] Saved {len(results)} metadata objects"
        )

        return {

            "results": results,

            "cached": False,

            "source": source

        }
    

    @staticmethod
    def get_track(song_id: str):
        raw_song = JioSaavnProvider.get_track(song_id)
        
        dto = JioSaavnProvider.normalize_song(
            raw_song
        )
        
        return MetadataNormalizer.normalize_song(
            dto
        )
            
    @staticmethod
    def match_apple_track(title, artist):

        query = f"{title} {artist}"

        try:

            songs = JioSaavnProvider.search_tracks(
                query=query,
                limit=3
            )

            for song in songs:

                saavn_title = song.title.lower()

                saavn_title = re.sub(
                    r"\(feat\..*?\)",
                    "",
                    saavn_title
                )

                saavn_title = re.sub(
                    r"\(with.*?\)",
                    "",
                    saavn_title
                )

                saavn_title = re.sub(
                    r"\-.*",
                    "",
                    saavn_title
                ).strip()

                apple_title = title.lower()

                apple_title = re.sub(
                    r"\(feat\..*?\)",
                    "",
                    apple_title
                )

                apple_title = re.sub(
                    r"\(with.*?\)",
                    "",
                    apple_title
                )

                apple_title = re.sub(
                    r"\-.*",
                    "",
                    apple_title
                ).strip()

                saavn_words = set(
                    re.findall(r"\w+", saavn_title)
                )

                apple_words = set(
                    re.findall(r"\w+", apple_title)
                )

                if not saavn_words or not apple_words:
                    continue

                overlap = (
                    len(saavn_words & apple_words)
                    / len(apple_words)
                )

                if overlap < 0.7:
                    continue

                saavn_artist = ", ".join(song.artists).lower()
                apple_artist = artist.lower()

                if (
                    saavn_artist in apple_artist
                    or
                    apple_artist in saavn_artist
                ):
                    return song

        except Exception as e:

            print(
                f"[MetadataService] Apple match: {e}"
            )

        return None