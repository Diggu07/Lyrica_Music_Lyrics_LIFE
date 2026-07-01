from datetime import datetime, timezone

from repositories.base_repository import BaseRepository


class HistoryRepository(BaseRepository):

    collection_name = "recently_played"

    @classmethod
    def add_song(
        cls,
        user_id: str,
        song: dict
    ):

        history_item = {

            "songId": song["songId"],

            "playedAt": datetime.now(
                timezone.utc
            )

        }

        # Remove duplicate entry
        cls.collection().update_one(

            {

                "userId": user_id

            },

            {

                "$pull": {

                    "songs": {

                        "songId": song["songId"]

                    }

                }

            },

            upsert=True

        )

        # Push newest song to the beginning
        cls.collection().update_one(

            {

                "userId": user_id

            },

            {

                "$push": {

                    "songs": {

                        "$each": [history_item],

                        "$position": 0,

                        "$slice": 100

                    }

                }

            },

            upsert=True

        )

    @classmethod
    def get_recent(
        cls,
        user_id: str,
        limit: int = 20
    ):

        history = cls.find_one({

            "userId": user_id

        })

        if not history:

            return []

        return history.get(

            "songs",

            []

        )[:limit]

    @classmethod
    def remove_song(
        cls,
        user_id: str,
        song_id: str
    ):

        cls.collection().update_one(

            {

                "userId": user_id

            },

            {

                "$pull": {

                    "songs": {

                        "songId": song_id

                    }

                }

            }

        )

    @classmethod
    def clear_history(
        cls,
        user_id: str
    ):

        cls.collection().update_one(

            {

                "userId": user_id

            },

            {

                "$set": {

                    "songs": []

                }

            },

            upsert=True

        )

    @classmethod
    def history_exists(
        cls,
        user_id: str
    ):

        return cls.exists({

            "userId": user_id

        })

    @classmethod
    def get_history_count(
        cls,
        user_id: str
    ):

        history = cls.find_one(

            {

                "userId": user_id

            }

        )

        if not history:

            return 0

        return len(

            history.get(

                "songs",

                []

            )

        )