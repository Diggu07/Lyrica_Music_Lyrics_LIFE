from pymongo import MongoClient
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client['lyrica']

class Playlist:
    def __init__(self):
        self.collection = db['playlists']

    def create_playlist(self, user_id, name):
        playlist = {"user_id": user_id, "name": name, "songs": []}
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
