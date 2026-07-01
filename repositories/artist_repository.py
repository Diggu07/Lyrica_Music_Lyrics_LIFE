import re
from datetime import datetime, timezone
from repositories.base_repository import BaseRepository
from schemas.artist_schema import ArtistSchema
from utils.text_utils import TextUtils


class ArtistRepository(BaseRepository):
    """
    Handles MongoDB operations for artists.

    Business logic should NOT live here.
    """


    collection_name = "artists"
    # ------------------------------------------------------------------
    # Canonical
    # ------------------------------------------------------------------

    @classmethod
    def search(
        cls,
        query: str,
        limit: int = 20
    ):

        return cls.find(

            {

                "$or":[

                    {

                        "name":{

                            "$regex": re.escape(query),

                            "$options":"i"

                        }

                    },

                    {

                        "normalizedName":{

                            "$regex": re.escape(
    TextUtils.normalize(query)
),

                            "$options":"i"

                        }

                    }

                ]

            },

            limit=limit

        )
    
    @classmethod
    def get_by_name(
        cls,
        name: str
    ):

        return cls.find_one({

            "normalizedName": TextUtils.normalize(name)

        })
    
    @classmethod
    def get(cls, artist_id:str):

        return cls.find_one({

            "artistId": artist_id

        })
    
    @classmethod
    def save(cls, artist: ArtistSchema):

        cls.upsert_schema(

            artist,

            key="artistId"

        )

    @classmethod
    def update(cls, artist_id:str, fields:dict):

        return cls.update_one(

            {

                "artistId": artist_id

            },

            fields

        )

    @classmethod
    def get_all(cls):
        return cls.find()

    @classmethod
    def exists(cls, artist_id:str):

        return super().exists({

            "artistId": artist_id

        })
    
    # ------------------------------------------------------------------
    # Artists
    # ------------------------------------------------------------------


    @classmethod
    def get_artist_by_alias(cls,alias):
        db = cls.collection().database
        return db.artist_aliases.find_one({"alias": alias.lower()})


    # ------------------------------------------------------------------
    # Albums
    # ------------------------------------------------------------------

    @classmethod
    def get_artist_albums(cls,artist_id:str):
        db = cls.collection().database
        return list(
            db.albums.find({"artistId": artist_id})
        )

    @classmethod
    def replace_artist_albums(cls,artist_id:str, albums):
        db = cls.collection().database

        db.albums.delete_many(
            {"artistId": artist_id}
        )

        if albums:
            db.albums.insert_many(albums)

    # ------------------------------------------------------------------
    # Songs
    # ------------------------------------------------------------------

    @classmethod
    def get_artist_songs(cls,artist_id:str):
        db = cls.collection().database

        return list(
            db.songs.find({"artistId": artist_id})
        )

    @classmethod
    def get_song(cls,song_id:str):
        db = cls.collection().database

        return db.songs.find_one(
            {"songId": song_id}
        )

    @classmethod
    def get_all_songs(cls):
        db = cls.collection().database

        return list(db.songs.find())

    # ------------------------------------------------------------------
    # Lyrics
    # ------------------------------------------------------------------

    @classmethod
    def get_artist_lyrics(cls,artist_id:str):
        db = cls.collection().database

        return list(
            db.lyrics.find({"artistId": artist_id})
        )

    @classmethod
    def get_song_lyrics(cls,song_id:str):
        db = cls.collection().database

        return db.lyrics.find_one(
            {"songId": song_id}
        )

    @classmethod
    def get_all_lyrics(cls):
        db = cls.collection().database

        return list(db.lyrics.find())

    @classmethod
    def save_lyric(cls,lyric):
        db = cls.collection().database

        db.lyrics.update_one(
            {"lyricId": lyric["lyricId"]},
            {"$set": lyric},
            upsert=True
        )

    @classmethod
    def increment_lyric_save_count(cls,lyric_id):
        db = cls.collection().database

        return db.lyrics.update_one(
            {"lyricId": lyric_id},
            {"$inc": {"saveCount": 1}}
        )

    # ------------------------------------------------------------------
    # Analytics
    # ------------------------------------------------------------------

    @classmethod
    def get_artist_analytics(cls,artist_id:str):
        db = cls.collection().database

        return db.artist_analytics.find_one(
            {"artistId": artist_id}
        )

    @classmethod
    def get_all_analytics(cls):
        db = cls.collection().database

        return list(
            db.artist_analytics.find()
        )

    # ------------------------------------------------------------------
    # Graph
    # ------------------------------------------------------------------

    @classmethod
    def get_artist_edges(cls,artist_id:str):
        db = cls.collection().database

        return list(
            db.artist_graph.find({
                "$or": [
                    {"source": artist_id},
                    {"target": artist_id}
                ]
            })
        )

    # ------------------------------------------------------------------
    # Discover
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
    
    # ------------------------------------------------------------------
    # Aggregation Queue
    # ------------------------------------------------------------------

    @classmethod
    def log_search(cls,query):
        db = cls.collection().database

        db.search_queries.insert_one({
            "query": query,
            "timestamp": datetime.now(timezone.utc)
        })

    @classmethod
    def enqueue_artist(cls,artist_id):
        db = cls.collection().database

        db.aggregation_queue.update_one(
            {"artistId": artist_id},
            {
                "$set": {
                    "priority": "user_search",
                    "status": "pending",
                    "createdAt": datetime.now(timezone.utc),
                    "attempts": 0
                }
            },
            upsert=True
        )

    # ------------------------------------------------------------------
    # Health
    # ------------------------------------------------------------------

    @classmethod
    def get_collection_counts(cls):
        db = cls.collection().database

        return {
            "artists": db.artists.count_documents({}),
            "albums": db.albums.count_documents({}),
            "songs": db.songs.count_documents({}),
            "lyrics": db.lyrics.count_documents({}),
            "syncedLyrics": db.lyrics.count_documents(
                {"hasSynced": True}
            ),
            "graphEdges": db.artist_graph.count_documents({}),
            "analytics": db.artist_analytics.count_documents({})
        }

    @classmethod
    def get_queue_counts(cls):
        db = cls.collection().database

        return {
            "pending": db.aggregation_queue.count_documents(
                {"status": "pending"}
            ),
            "running": db.aggregation_queue.count_documents(
                {"status": "running"}
            ),
            "complete": db.aggregation_queue.count_documents(
                {"status": "complete"}
            ),
            "failed": db.aggregation_queue.count_documents(
                {"status": "failed"}
            )
        }

    @classmethod
    def get_source_health(cls):
        db = cls.collection().database

        return list(db.source_health.find())
