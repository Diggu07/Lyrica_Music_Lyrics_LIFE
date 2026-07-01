import requests,logging
from providers.dto.song_dto import SongDTO
from providers.dto.album_dto import AlbumDTO
from providers.dto.artist_dto import ArtistDTO
from providers.dto.provider_playlist_dto import ProviderPlaylistDTO

SAAVN_BASE = "https://saavn.sumit.co/api"
logger = logging.getLogger(__name__)
TIMEOUT=10
HEADERS = {
    "User-Agent": "Lyrica/1.0"
}

session = requests.Session()
class JioSaavnProvider:
    """
    JioSaavn search provider.

    Responsible for:
    - Searching JioSaavn
    - Converting responses to Lyrica format
    - Returning normalized objects

    It should NEVER access MongoDB.
    """
    @staticmethod
    def search(query, search_type="all", limit=20):
        """
        Search JioSaavn and return normalized results.
        """
        print("[JioSaavnProvider] Searching...")
        search_type = (search_type or "all").lower()

        if search_type == "all":
            return JioSaavnProvider._search_all(query)

        if search_type == "tracks":
            return JioSaavnProvider._search_tracks(query, limit)

        if search_type == "albums":
            return JioSaavnProvider._search_albums(query, limit)

        if search_type == "playlists":
            return JioSaavnProvider._search_playlists(query, limit)

        if search_type == "artists":
            return JioSaavnProvider._search_artists(query, limit)

        return []


    @staticmethod
    def _search_all(query):

        try:

            response = session.get(
                f"{SAAVN_BASE}/search",
                params={
                    "query": query
                },
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if not response.ok:
                print("Status:", response.status_code)
                print("Response:", response.text)
                return []

            data = response.json().get("data", {}) or {}
            print("Response JSON:", response.json())
            songs = (
                data.get("songs") or {}
            ).get("results", [])

            albums = (
                data.get("albums") or {}
            ).get("results", [])

            playlists = (
                data.get("playlists") or {}
            ).get("results", [])

            artists = (
                data.get("artists") or {}
            ).get("results", [])

            return (

                [JioSaavnProvider.normalize_song(s) for s in songs[:8]]

                +

                [JioSaavnProvider.normalize_album(a) for a in albums[:6]]

                +

                [JioSaavnProvider.normalize_playlist(p) for p in playlists[:6]]

                +

                [JioSaavnProvider.normalize_artist(a) for a in artists[:6]]

            )

        except Exception as e:

            logger.exception("JioSaavn all search failed")

            return []


    @staticmethod
    def _search_tracks(query, limit=3):


        try:

            response = session.get(
                f"{SAAVN_BASE}/search/songs",
                params={
                    "query": query,
                    "limit": limit
                },
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if not response.ok:
                return []

            songs = response.json().get(
                "data",
                {}
            ).get(
                "results",
                []
            )

            return [

                JioSaavnProvider.normalize_song(song)

                for song in songs

            ]

        except Exception as e:

            logger.exception("JioSaavn track search failed")

            return []
        
    
    @staticmethod
    def search_tracks(query, limit=3):
        """
        Public wrapper around _search_tracks().
        """
        return JioSaavnProvider._search_tracks(query, limit)
        


    @staticmethod
    def _search_albums(query, limit):

        try:

            response = session.get(
                f"{SAAVN_BASE}/search/albums",
                params={
                    "query": query,
                    "limit": limit
                },
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if not response.ok:
                return []

            albums = response.json().get(
                "data",
                {}
            ).get(
                "results",
                []
            )

            return [

                JioSaavnProvider.normalize_album(album)

                for album in albums

            ]

        except Exception as e:

            logger.exception("JioSaavn albums search failed")

            return []


    @staticmethod
    def _search_artists(query, limit):

        try:

            response = session.get(
                f"{SAAVN_BASE}/search/artists",
                params={
                    "query": query,
                    "limit": limit
                },
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if not response.ok:
                return []

            artists = response.json().get(
                "data",
                {}
            ).get(
                "results",
                []
            )

            return [

                JioSaavnProvider.normalize_artist(artist)

                for artist in artists

            ]

        except Exception as e:

            logger.exception("JioSaavn artists search failed")

            return []
        

    @staticmethod
    def _search_playlists(query, limit):

        try:

            response = session.get(
                f"{SAAVN_BASE}/search/playlists",
                params={
                    "query": query,
                    "limit": limit
                },
                headers=HEADERS,
                timeout=TIMEOUT
            )

            if not response.ok:
                return []

            playlists = response.json().get(
                "data",
                {}
            ).get(
                "results",
                []
            )

            return [

                JioSaavnProvider.normalize_playlist(p)

                for p in playlists[:limit]

            ]

        except Exception as e:
            logger.exception("JioSaavn playlists search failed")
            return []
        
        
    @staticmethod
    def normalize_song(song: dict) -> SongDTO:
        """Convert a JioSaavn song object into our standard Track shape."""
        # Album art — pick highest quality available
        images = song.get("image", [])
        cover = ""
        if isinstance(images, list) and images:
            last_img = images[-1]
            cover = last_img.get("url", "") if isinstance(last_img, dict) else str(last_img)
        elif isinstance(images, str):
            cover = images

        # Download/stream URLs
        download_urls = song.get("downloadUrl", [])
        stream_url = ""
        if isinstance(download_urls, list) and download_urls:
            for q in ("160kbps", "128kbps", "96kbps", "48kbps"):
                match = next((d for d in download_urls if d.get("quality") == q), None)
                if match:
                    stream_url = match.get("url", "")
                    break
            if not stream_url:
                last = download_urls[-1]
                stream_url = last.get("url", "") if isinstance(last, dict) else ""

        # Duration
        dur_secs = song.get("duration", 0)
        try:
            dur_secs = int(dur_secs)
        except Exception:
            dur_secs = 0
        mins = dur_secs // 60
        secs = dur_secs % 60
        duration_str = f"{mins}:{secs:02d}"

        artists_data = song.get("artists", {})

        if isinstance(artists_data, dict):
            primary = artists_data.get("primary", [])
            artists = [
                artist.get("name", "")
                for artist in primary
                if artist.get("name")
            ]

            if not artists:
                artists = [
                    name.strip()
                    for name in song.get("primaryArtists", "").split(",")
                    if name.strip()
                ]

        else:
            artists = [
                name.strip()
                for name in str(
                    song.get(
                        "primaryArtists",
                        song.get("singers", "")
                    )
                ).split(",")
                if name.strip()
            ]

        album_name = ""
        album_data = song.get("album", "")
        if isinstance(album_data, dict):
            album_name = album_data.get("name", "")
        elif isinstance(album_data, str):
            album_name = album_data

        play_count = song.get("playCount")
        try:
            popularity = float(play_count)
        except (TypeError, ValueError):
            popularity = 0.0

        year = None
        if song.get("year"):
            try:
                year = int(song["year"])
            except (TypeError, ValueError):
                pass
            
        return SongDTO(
        provider="saavn",
    
        provider_id=song.get("id", ""),
    
        title=song.get("name", song.get("title", "Unknown")),
    
        artists=artists,
    
        album=album_name,
    
        cover=cover,
    
        thumbnail=cover,
    
        duration=duration_str,
    
        durationSecs=dur_secs,
    
        language=song.get("language"),
    
        genres=[],
    
        stream_url=stream_url,
    
        playable=True,
    
        explicit=bool(song.get("explicit", False)),
    
        popularity=popularity,
    
        releaseDate=song.get("releaseDate"),
    
        year=year,
    
        isrc=song.get("isrc"),
    
        lyrics_available=bool(song.get("hasLyrics", False)),
    )


    @staticmethod
    def normalize_album(album: dict) -> AlbumDTO:

        images = album.get("image", [])
        cover = ""

        if isinstance(images, list) and images:
            last_img = images[-1]
            cover = (
                last_img.get("url", "")
                if isinstance(last_img, dict)
                else str(last_img)
            )

        elif isinstance(images, str):
            cover = images

        artists_data = album.get("artists", {})

        if isinstance(artists_data, dict):

            primary = artists_data.get("primary", [])

            artists = [
                artist.get("name", "")
                for artist in primary
                if artist.get("name")
            ]

            if not artists:
                artists = [
                    name.strip()
                    for name in album.get("primaryArtists", "").split(",")
                    if name.strip()
                ]

        else:

            artists = [
                name.strip()
                for name in str(
                    album.get(
                        "primaryArtists",
                        "Various Artists"
                    )
                ).split(",")
                if name.strip()
            ]

        year = None

        if album.get("year"):
            try:
                year = int(album["year"])
            except (TypeError, ValueError):
                pass

        return AlbumDTO(

            provider="saavn",

            provider_id=album.get("id", ""),

            title=album.get(
                "name",
                album.get("title", "Unknown")
            ),

            artists=artists,

            cover=cover,

            thumbnail=cover,

            year=year,

            language=album.get("language"),

            genres=[],

            releaseDate=album.get("releaseDate"),

            songCount=int(album.get("songCount", 0) or 0)

        )


    @staticmethod
    def normalize_playlist(
        playlist: dict
    ) -> ProviderPlaylistDTO:

        images = playlist.get("image", [])
        cover = ""

        if isinstance(images, list) and images:

            last_img = images[-1]

            cover = (
                last_img.get("url", "")
                if isinstance(last_img, dict)
                else str(last_img)
            )

        elif isinstance(images, str):

            cover = images

        owner = (
            playlist.get("ownerName")
            or playlist.get("owner")
            or "JioSaavn"
        )

        subtitle = (
            playlist.get("subtitle")
            or ""
        )

        language = playlist.get(
            "language"
        )

        try:

            song_count = int(
                playlist.get(
                    "songCount",
                    0
                ) or 0
            )

        except Exception:

            song_count = 0

        return ProviderPlaylistDTO(

            provider="saavn",

            provider_id=playlist.get(
                "id",
                ""
            ),

            title=playlist.get(

                "name",

                playlist.get(
                    "title",
                    "Unknown Playlist"
                )

            ),

            subtitle=subtitle,

            owner=owner,

            cover=cover,

            thumbnail=cover,

            language=language,

            song_count=song_count,

            public=True

        )

    @staticmethod
    def normalize_artist(artist: dict) -> ArtistDTO:
    
        images = artist.get("image", [])
        cover = ""
    
        if isinstance(images, list) and images:
        
            last_img = images[-1]
    
            cover = (
                last_img.get("url", "")
                if isinstance(last_img, dict)
                else str(last_img)
            )
    
        elif isinstance(images, str):
            cover = images
    
        return ArtistDTO(
        
            provider="saavn",
    
            provider_id=artist.get("id", ""),
    
            name=artist.get(
                "name",
                artist.get("title", "Unknown")
            ),
    
            image=cover,
    
            genres=[],
    
            language=artist.get("language"),
    
            popularity=0.0,
    
            followers=0,
    
            verified=False
    
        )

    @staticmethod
    def get_stream(song_id: str, quality: str = "160kbps"):
        """
        Fetch a fresh CDN stream URL from JioSaavn.
        """

        r = requests.get(
            f"{SAAVN_BASE}/songs/{song_id}",
            timeout=10
        )

        if not r.ok:
            raise Exception(
                f"JioSaavn API error: {r.status_code}"
            )

        data = r.json()

        song_data = data.get("data")

        if isinstance(song_data, list):
            song_data = song_data[0] if song_data else {}

        elif not isinstance(song_data, dict):
            song_data = {}

        download_urls = song_data.get("downloadUrl", [])

        if not download_urls:
            raise Exception(
                "No stream URLs available for this track"
            )

        quality_order = [
            quality,
            "160kbps",
            "128kbps",
            "96kbps",
            "48kbps",
        ]

        stream_url = ""
        chosen_quality = ""

        for q in quality_order:
            match = next(
                (
                    d
                    for d in download_urls
                    if d.get("quality") == q
                ),
                None,
            )

            if match:
                stream_url = match.get("url", "")
                chosen_quality = q
                break

        if not stream_url and download_urls:
            last = download_urls[-1]
            stream_url = last.get("url", "")
            chosen_quality = last.get("quality", "unknown")

        if not stream_url:
            raise Exception(
                "Could not resolve stream URL"
            )

        return {
            "stream_url": stream_url,
            "quality": chosen_quality,
            "expires_in": 900,
            "song_id": song_id,
        }
    
    @staticmethod
    def get_track(song_id: str):
        """
        Fetch a single track from JioSaavn.
        """

        r = requests.get(
            f"{SAAVN_BASE}/songs/{song_id}",
            timeout=10
        )

        if not r.ok:
            raise Exception("Track not found")

        data = r.json()

        song_data = data.get("data")

        if isinstance(song_data, list):
            song_data = song_data[0] if song_data else None

        if not song_data:
            raise Exception("Track not found")

        return JioSaavnProvider.normalize_song(song_data)
    
    @staticmethod
    def get_featured_section(query: str, limit: int = 8):
        """
        Search JioSaavn for a featured section.
        """

        r = requests.get(
            f"{SAAVN_BASE}/search/songs",
            params={
                "query": query,
                "limit": limit
            },
            timeout=8
        )

        if not r.ok:
            return []

        data = r.json()

        songs = (data.get("data") or {}).get("results", [])

        return [
            JioSaavnProvider.normalize_song(song)
            for song in songs[:limit]
        ]
    
    @staticmethod
    def get_playlist(
        playlist_id
    ):

        try:

            response = session.get(

                f"{SAAVN_BASE}/playlists",

                params={

                    "id": playlist_id

                },

                headers=HEADERS,

                timeout=TIMEOUT

            )

            response.raise_for_status()

            playlist = (
                response.json()
                .get("data", {})
            )

            return JioSaavnProvider.normalize_playlist(
                playlist
            )

        except Exception:

            logger.exception(
                "Playlist fetch failed"
            )

            return None
    
    @staticmethod
    def get_playlist_tracks(playlist_id):

        try:

            response = session.get(
                f"{SAAVN_BASE}/playlists",
                params={"id": playlist_id},
                headers=HEADERS,
                timeout=TIMEOUT
            )

            response.raise_for_status()

            songs = (
                response.json()
                .get("data", {})
                .get("songs", [])
            )

            return [
                JioSaavnProvider.normalize_song(song)
                for song in songs
            ]

        except Exception:
            logger.exception("Playlist fetch failed")
            return []