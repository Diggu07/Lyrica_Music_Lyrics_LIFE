import re

from repositories.base_repository import BaseRepository
from schemas.album_schema import AlbumSchema
from utils.text_utils import TextUtils


class AlbumRepository(BaseRepository):
    """
    Handles all MongoDB operations for canonical albums.

    Business logic should NOT live here.
    """

    collection_name = "albums"

    # ------------------------------------------------------------------
    # Canonical
    # ------------------------------------------------------------------

    @classmethod
    def save(cls, album: AlbumSchema):

        cls.upsert_schema(
            album,
            key="albumId"
        )

    @classmethod
    def get(cls, album_id: str):

        return cls.find_one({
            "albumId": album_id
        })

    @classmethod
    def get_all(cls):

        return cls.find()

    @classmethod
    def exists(cls, album_id: str):

        return super().exists({
            "albumId": album_id
        })

    @classmethod
    def update(
        cls,
        album_id: str,
        fields: dict
    ):

        return cls.update_one(
            {
                "albumId": album_id
            },
            fields
        )

    @classmethod
    def delete(
        cls,
        album_id: str
    ):

        return cls.delete_one({
            "albumId": album_id
        })

    # ------------------------------------------------------------------
    # Search
    # ------------------------------------------------------------------

    @classmethod
    def search(
        cls,
        query: str,
        limit: int = 20
    ):

        escaped = re.escape(
            TextUtils.normalize(query)
        )

        return cls.find(

            {

                "$or": [

                    {

                        "title": {

                            "$regex": escaped,
                            "$options": "i"

                        }

                    },

                    {

                        "normalizedTitle": {

                            "$regex": escaped,
                            "$options": "i"

                        }

                    }

                ]

            },

            limit=limit

        )

    @classmethod
    def get_by_title(
        cls,
        title: str
    ):

        return cls.find_one({

            "normalizedTitle": TextUtils.normalize(
                title
            )

        })

    # ------------------------------------------------------------------
    # Artist
    # ------------------------------------------------------------------

    @classmethod
    def get_by_artist(
        cls,
        artist_id: str
    ):

        return cls.find({

            "artistIds": artist_id

        })

    # ------------------------------------------------------------------
    # Language
    # ------------------------------------------------------------------

    @classmethod
    def get_by_language(
        cls,
        language: str
    ):

        return cls.find({

            "language": language.lower()

        })

    # ------------------------------------------------------------------
    # Genre
    # ------------------------------------------------------------------

    @classmethod
    def get_by_genre(
        cls,
        genre: str
    ):

        return cls.find({

            "genres": genre

        })

    # ------------------------------------------------------------------
    # Charts
    # ------------------------------------------------------------------

    @classmethod
    def get_popular(
        cls,
        limit: int = 20
    ):

        return cls.find(

            sort=[
                ("popularity", -1)
            ],

            limit=limit

        )

    @classmethod
    def get_recent(
        cls,
        limit: int = 20
    ):

        return cls.find(

            sort=[
                ("year", -1),
                ("releaseDate", -1)
            ],

            limit=limit

        )

    # ------------------------------------------------------------------
    # Statistics
    # ------------------------------------------------------------------

    @classmethod
    def count_by_language(
        cls,
        language: str
    ):

        return cls.count({

            "language": language.lower()

        })

    @classmethod
    def count_by_genre(
        cls,
        genre: str
    ):

        return cls.count({

            "genres": genre

        })