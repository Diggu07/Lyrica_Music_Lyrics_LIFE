from datetime import datetime, timezone
from models.user import User


class LyricsRepository:
    """
    Handles all MongoDB operations for lyrics.
    Business logic should NOT live here.
    """
    collection_name = "lyrics"

    @staticmethod
    def get_db():
        return User.get_db_connection()

    # ---------------------------------------------------------
    # Lyrics
    # ---------------------------------------------------------

    @staticmethod
    def save_lyrics(lyrics):

        db = LyricsRepository.get_db()

        db.lyrics.update_one(
            {
                "songId": lyrics["songId"]
            },
            {
                "$set": lyrics
            },
            upsert=True
        )

    @staticmethod
    def get_lyrics(song_id):

        db = LyricsRepository.get_db()

        return db.lyrics.find_one(
            {
                "songId": song_id
            }
        )

    @staticmethod
    def update_lyrics(song_id, fields):

        db = LyricsRepository.get_db()

        db.lyrics.update_one(
            {
                "songId": song_id
            },
            {
                "$set": fields
            }
        )

    @staticmethod
    def delete_lyrics(song_id):

        db = LyricsRepository.get_db()

        db.lyrics.delete_one(
            {
                "songId": song_id
            }
        )

    @staticmethod
    def lyrics_exist(song_id):

        db = LyricsRepository.get_db()

        return db.lyrics.count_documents(
            {
                "songId": song_id
            },
            limit=1
        ) > 0

    # ---------------------------------------------------------
    # Search
    # ---------------------------------------------------------

    @staticmethod
    def search_lyrics(query, limit=20):

        db = LyricsRepository.get_db()

        return list(

            db.lyrics.find(

                {
                    "$or": [

                        {
                            "plainLyrics": {
                                "$regex": query,
                                "$options": "i"
                            }
                        },

                        {
                            "syncedLyrics": {
                                "$regex": query,
                                "$options": "i"
                            }
                        }

                    ]
                }

            ).limit(limit)

        )

    # ---------------------------------------------------------
    # Helpers
    # ---------------------------------------------------------

    @staticmethod
    def serialize(document):

        if not document:
            return None

        if isinstance(document, list):

            return [

                LyricsRepository.serialize(d)

                for d in document

            ]

        if "_id" in document:

            document["_id"] = str(
                document["_id"]
            )

        return document