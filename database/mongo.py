import os
import pymongo

_db = None


def get_db():
    """
    Returns a singleton MongoDB database instance.
    """

    global _db

    if _db is None:

        mongo_uri = os.getenv(
            "MONGO_URI",
            "mongodb://localhost:27017/"
        )

        client = pymongo.MongoClient(mongo_uri)

        _db = client["lyrica_music"]

    return _db