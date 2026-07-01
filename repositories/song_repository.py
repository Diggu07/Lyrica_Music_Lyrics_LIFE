import re
from utils.text_utils import TextUtils
from typing import List

from repositories.base_repository import BaseRepository
from schemas.song_schema import SongSchema


class SongRepository(BaseRepository):
    """
    Repository for canonical songs.

    Handles ONLY song-specific queries.
    Generic CRUD operations come from BaseRepository.
    """

    collection_name = "songs"
    

    # ---------------------------------------------------------
    # Save
    # ---------------------------------------------------------

    @classmethod
    def save(cls, song: SongSchema):

        cls.upsert_schema(
            song,
            key="songId"
        )

    # ---------------------------------------------------------
    # Getters
    # ---------------------------------------------------------

    @classmethod
    def get(cls, song_id: str):

        return cls.find_one({
            "songId": song_id
        })

    @classmethod
    def exists(cls, song_id: str):

        return super().exists({
            "songId": song_id
        })

    @classmethod
    def delete(cls, song_id: str):

        return cls.delete_one({
            "songId": song_id
        })

    # ---------------------------------------------------------
    # Search
    # ---------------------------------------------------------

    @classmethod
    def search(
        cls,
        query: str,
        source: str | None = None,
        limit: int = 20
    ):
        escaped = re.escape(TextUtils.normalize(query))
    
        mongo_query = {
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
        }
    
        if source:
            mongo_query["source"] = source.lower()
    
        return cls.find(
            mongo_query,
            limit=limit
        )

    # ---------------------------------------------------------
    # Songs
    # ---------------------------------------------------------

    @classmethod
    def get_songs(
        cls,
        song_ids: list[str]
    ) -> List[dict]:

        if not song_ids:
            return []

        return cls.find(

            {

                "songId": {

                    "$in": song_ids

                }

            }

        )
    # ---------------------------------------------------------
    # Artist
    # ---------------------------------------------------------

    @classmethod
    def get_by_artist(
        cls,
        artist_id: str
    ):
        return cls.find({
            "artistIds": artist_id
        })
    
    @classmethod
    def get_by_artists(
        cls,
        artist_ids,
        limit=100
    ):

        if not artist_ids:
            return []

        return cls.find(
            {
                "artistIds": {
                    "$in": artist_ids
                }
            },
            limit=limit
        )

    # ---------------------------------------------------------
    # Album
    # ---------------------------------------------------------

    @classmethod
    def get_by_album(
        cls,
        album_id: str
    ):

        return cls.find({

            "albumId": album_id

        })

    # ---------------------------------------------------------
    # Language
    # ---------------------------------------------------------

    @classmethod
    def get_by_language(
        cls,
        language: str
    ):

        return cls.find({

            "language": language.lower()

        })

    # ---------------------------------------------------------
    # Genre
    # ---------------------------------------------------------

    @classmethod
    def get_by_genre(
        cls,
        genre: str,
        limit=100
    ):
        return cls.get_songs_by_genres(
            [genre],
            limit
        )

    @classmethod
    def get_by_genres(
        cls,
        genres,
        limit=100
    ):
        """
        Returns songs matching any of the given genres.

        Compatible with canonical SongSchema.
        """

        if not genres:
            return []

        return cls.find(
            {
                "genres": {
                    "$in": genres
                }
            },
            limit=limit
        )
    # ---------------------------------------------------------
    # Charts
    # ---------------------------------------------------------

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

                ("releaseDate", -1)

            ],

            limit=limit

        )

    # ---------------------------------------------------------
    # Updates
    # ---------------------------------------------------------

    @classmethod
    def update_popularity(
        cls,
        song_id: str,
        popularity: float
    ):

        return cls.update_one(

            {

                "songId": song_id

            },

            {

                "popularity": popularity

            }

        )

    # ---------------------------------------------------------
    # Lists
    # ---------------------------------------------------------

    @classmethod
    def get_all(cls):

        return cls.find()