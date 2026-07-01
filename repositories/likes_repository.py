from datetime import datetime, timezone

from repositories.base_repository import BaseRepository


class LikesRepository(BaseRepository):

    collection_name = "likes"

    @classmethod
    def like_song(
        cls,
        user_id: str,
        song_id: str
    ):

        like = {

            "songId": song_id,

            "likedAt": datetime.now(
                timezone.utc
            )

        }

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

            },

            upsert=True

        )

        cls.collection().update_one(

            {

                "userId": user_id

            },

            {

                "$push": {

                    "songs": {

                        "$each": [like],

                        "$position": 0

                    }

                }

            },

            upsert=True

        )

    @classmethod
    def unlike_song(
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
    def get_likes(
        cls,
        user_id: str,
        limit=100
    ):

        doc = cls.find_one({

            "userId": user_id

        })

        if not doc:

            return []

        return doc.get(

            "songs",

            []

        )[:limit]

    @classmethod
    def is_liked(
        cls,
        user_id,
        song_id
    ):

        doc = cls.find_one({

            "userId": user_id,

            "songs.songId": song_id

        })

        return doc is not None

    @classmethod
    def clear(
        cls,
        user_id
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
    def count(
        cls,
        user_id
    ):

        doc = cls.find_one({

            "userId": user_id

        })

        if not doc:

            return 0

        return len(

            doc.get(

                "songs",

                []

            )

        )