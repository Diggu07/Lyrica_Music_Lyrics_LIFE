import pymongo
from bson import ObjectId
import os

_db = None

def get_db():
    global _db
    if _db is None:
        _mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        client = pymongo.MongoClient(_mongo_uri)
        _db = client['lyrica_music']
    return _db

class Playlist:
    def __init__(self):
        self.collection = get_db()['playlists']

    def create_playlist(self, user_id, name):
        playlist = {"user_id": user_id, "name": name, "songs": [], "cover_url": None}
        return self.collection.insert_one(playlist).inserted_id

    def get_playlists_by_user(self, user_id):
        return list(self.collection.find({"user_id": user_id}))

    def add_song(self, playlist_id, song_id):
        return self.collection.update_one(
            {"_id": ObjectId(playlist_id)},
            {"$addToSet": {"songs": song_id}}
        )

    def remove_song(self, playlist_id, song_id):
        return self.collection.update_one(
            {"_id": ObjectId(playlist_id)},
            {"$pull": {"songs": song_id}}
        )

    def delete_playlist(self, playlist_id):
        return self.collection.delete_one({"_id": ObjectId(playlist_id)})

    def rename_playlist(self, playlist_id, new_name):
        return self.collection.update_one(
            {"_id": ObjectId(playlist_id)},
            {"$set": {"name": new_name}}
        )

    def update_cover_url(self, playlist_id, cover_url):
        return self.collection.update_one(
            {"_id": ObjectId(playlist_id)},
            {"$set": {"cover_url": cover_url}}
        )
