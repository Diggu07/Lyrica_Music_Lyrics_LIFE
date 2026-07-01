import os
from datetime import datetime

import pymongo


_db = None


def get_db():
    global _db

    if _db is None:
        mongo_uri = os.getenv(
            "MONGO_URI",
            "mongodb://localhost:27017/"
        )

        client = pymongo.MongoClient(mongo_uri)
        _db = client["lyrica_music"]

    return _db


class SongActivity:
    """
    Global song analytics.

    This class is NOT responsible for user history.

    User history:
        -> HistoryRepository

    This class:
        -> Play count
        -> Leaderboard
        -> Trending
        -> Analytics
    """

    def __init__(self):
        self.collection = get_db()["song_activity"]

    # ----------------------------------------------------
    # Increment play count
    # ----------------------------------------------------

    def log_play(self, song):

        song_id = song["songId"]

        self.collection.update_one(
            {
                "songId": song_id
            },
            {
                "$inc": {
                    "playCount": 1
                },
                "$set": {
                    "title": song.get("title"),
                    "artist": song.get("artist"),
                    "album": song.get("album"),
                    "coverArt": song.get("coverArt"),
                    "lastPlayed": datetime.utcnow()
                }
            },
            upsert=True
        )

    # ----------------------------------------------------
    # Get play count
    # ----------------------------------------------------

    def get_play_count(self, song_id):

        song = self.collection.find_one(
            {
                "songId": song_id
            }
        )

        if not song:
            return 0

        return song.get("playCount", 0)

    # ----------------------------------------------------
    # Leaderboard
    # ----------------------------------------------------

    def get_leaderboard(self, limit=20):

        return list(

            self.collection

            .find()

            .sort(

                "playCount",

                pymongo.DESCENDING

            )

            .limit(limit)

        )

    # ----------------------------------------------------
    # Trending
    # ----------------------------------------------------

    def get_trending(self, limit=20):

        return list(

            self.collection

            .find()

            .sort(

                [

                    ("lastPlayed", pymongo.DESCENDING),

                    ("playCount", pymongo.DESCENDING)

                ]

            )

            .limit(limit)

        )

    # ----------------------------------------------------
    # Reset Analytics
    # ----------------------------------------------------

    def reset_song(self, song_id):

        self.collection.delete_one(

            {

                "songId": song_id

            }

        )

    # ----------------------------------------------------
    # Total Plays
    # ----------------------------------------------------

    def total_plays(self):

        pipeline = [

            {

                "$group": {

                    "_id": None,

                    "plays": {

                        "$sum": "$playCount"

                    }

                }

            }

        ]

        result = list(

            self.collection.aggregate(

                pipeline

            )

        )

        if not result:

            return 0

        return result[0]["plays"]