# normalizers/artist_normalizer.py

from repositories.artist_repository import ArtistRepository


class ArtistNormalizer:
    """
    Converts MongoDB documents into API responses.

    No database queries.
    No external API calls.
    No business logic.
    """

    # ---------------------------------------------------------
    # Helpers
    # ---------------------------------------------------------

    @staticmethod
    def _serialize(data):
        return ArtistRepository.serialize(data)

    # ---------------------------------------------------------
    # Artist
    # ---------------------------------------------------------

    @staticmethod
    def normalize_artist(artist):

        if not artist:
            return None

        artist = ArtistNormalizer._serialize(artist)

        return {
            "artistId": artist.get("artistId"),
            "name": artist.get("name"),
            "bio": artist.get("bio", ""),
            "imageUrl": artist.get("imageUrl")
            or artist.get("cover"),
            "cover": artist.get("cover")
            or artist.get("imageUrl"),
            "genres": artist.get("genres", []),
            "country": artist.get("country"),
            "followers": artist.get("followers", 0),
            "popularity": artist.get("popularity", 0),
            "aliases": artist.get("aliases", []),
            "lastAggregated": artist.get("lastAggregated")
        }

    # ---------------------------------------------------------
    # Analytics
    # ---------------------------------------------------------

    @staticmethod
    def normalize_analytics(analytics):

        if not analytics:
            return None

        analytics = ArtistNormalizer._serialize(
            analytics
        )

        return {
            "artistId": analytics.get("artistId"),
            "essence": analytics.get("essence"),
            "dna": analytics.get("dna", {}),
            "timeline": analytics.get("timeline", []),
            "wall": analytics.get("wall", []),
            "stats": analytics.get("stats", {})
        }

    # ---------------------------------------------------------
    # Songs
    # ---------------------------------------------------------

    @staticmethod
    def normalize_song(song):

        song = ArtistNormalizer._serialize(song)

        return {
            "songId": song.get("songId"),
            "title": song.get("title")
            or song.get("name"),
            "artistId": song.get("artistId"),
            "albumId": song.get("albumId"),
            "album": song.get("album"),
            "duration": song.get("duration"),
            "coverUrl": song.get("coverUrl")
            or song.get("imageUrl"),
            "imageUrl": song.get("imageUrl")
            or song.get("coverUrl"),
            "previewUrl": song.get("previewUrl"),
            "audioUrl": song.get("audioUrl"),
            "popularity": song.get("popularity", 0)
        }

    @staticmethod
    def normalize_song_list(songs):

        songs = ArtistNormalizer._serialize(songs)

        return [
            ArtistNormalizer.normalize_song(song)
            for song in songs
        ]

    # ---------------------------------------------------------
    # Albums
    # ---------------------------------------------------------

    @staticmethod
    def normalize_album(album):

        album = ArtistNormalizer._serialize(album)

        return {
            "albumId": album.get("albumId"),
            "title": album.get("title"),
            "artistId": album.get("artistId"),
            "year": album.get("year"),
            "type": album.get("type"),
            "coverUrl": album.get("coverUrl")
        }

    @staticmethod
    def normalize_album_list(albums):

        albums = ArtistNormalizer._serialize(albums)

        formatted = []
        singles = []

        for album in albums:

            item = ArtistNormalizer.normalize_album(
                album
            )

            if item["type"] == "single":
                singles.append(item)
            else:
                formatted.append(item)

        return {
            "albums": formatted,
            "singles": singles
        }

    # ---------------------------------------------------------
    # Health
    # ---------------------------------------------------------

    @staticmethod
    def normalize_health(data):

        return data