from datetime import datetime


class RecommendationNormalizer:
    """
    Normalizes recommendation responses before sending
    them to the frontend.
    """

    # ==========================================================
    # Generic Helpers
    # ==========================================================

    @staticmethod
    def normalize_document(document):

        if not document:
            return None

        document = dict(document)

        if "_id" in document:
            document["_id"] = str(document["_id"])

        for key, value in document.items():

            if isinstance(value, datetime):
                document[key] = value.isoformat()

        return document

    @staticmethod
    def normalize_documents(documents):

        return [
            RecommendationNormalizer.normalize_document(doc)
            for doc in documents
        ]

    # ==========================================================
    # Songs
    # ==========================================================

    @staticmethod
    def normalize_song(song):

        if not song:
            return None

        song = RecommendationNormalizer.normalize_document(song)

        return {
            "songId": song.get("songId"),
            "title": song.get("title"),
            "artistId": song.get("artistId"),
            "artistName": song.get("artistName"),
            "albumId": song.get("albumId"),
            "albumName": song.get("albumName"),
            "duration": song.get("duration"),
            "genre": song.get("genre"),
            "coverImage": song.get("coverImage"),
            "audioUrl": song.get("audioUrl"),
            "popularity": song.get("popularity", 0),
            "releaseDate": song.get("releaseDate")
        }

    @staticmethod
    def normalize_song_list(songs):

        return [
            RecommendationNormalizer.normalize_song(song)
            for song in songs
        ]

    # ==========================================================
    # Artists
    # ==========================================================

    @staticmethod
    def normalize_artist(artist):

        if not artist:
            return None

        artist = RecommendationNormalizer.normalize_document(
            artist
        )

        return {
            "artistId": artist.get("artistId"),
            "name": artist.get("name"),
            "image": artist.get("image"),
            "genres": artist.get("genres", []),
            "followers": artist.get("followers", 0),
            "popularity": artist.get("popularity", 0)
        }

    # ==========================================================
    # Albums
    # ==========================================================

    @staticmethod
    def normalize_album(album):

        if not album:
            return None

        album = RecommendationNormalizer.normalize_document(
            album
        )

        return {
            "albumId": album.get("albumId"),
            "title": album.get("title"),
            "artistId": album.get("artistId"),
            "artistName": album.get("artistName"),
            "coverImage": album.get("coverImage"),
            "releaseDate": album.get("releaseDate"),
            "totalTracks": album.get("totalTracks", 0)
        }

    # ==========================================================
    # Recommendation Response
    # ==========================================================

    @staticmethod
    def normalize_recommendations(
        title,
        songs,
        reason=None
    ):

        return {
            "title": title,
            "reason": reason,
            "count": len(songs),
            "songs": RecommendationNormalizer.normalize_song_list(
                songs
            )
        }

    # ==========================================================
    # Home Section
    # ==========================================================

    @staticmethod
    def normalize_home_section(
        section_name,
        songs
    ):

        return {
            "section": section_name,
            "count": len(songs),
            "songs": RecommendationNormalizer.normalize_song_list(
                songs
            )
        }

    # ==========================================================
    # Daily Mix
    # ==========================================================

    @staticmethod
    def normalize_daily_mix(
        mix_name,
        songs
    ):

        return {
            "mixName": mix_name,
            "totalSongs": len(songs),
            "songs": RecommendationNormalizer.normalize_song_list(
                songs
            )
        }