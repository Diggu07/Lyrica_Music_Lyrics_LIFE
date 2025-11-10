from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

client = MongoClient("mongodb://localhost:27017/")
db = client['lyrica']

class SongActivity:
    def __init__(self):
        self.collection = db['song_activity']

    def log_play(self, user_id, song_id, song_title):
        """Called when a user plays a song."""
        existing = self.collection.find_one({"song_id": song_id})
        if existing:
            self.collection.update_one(
                {"song_id": song_id},
                {"$inc": {"play_count": 1}, "$set": {"last_played": datetime.utcnow()}}
            )
        else:
            self.collection.insert_one({
                "song_id": song_id,
                "song_title": song_title,
                "play_count": 1,
                "last_played": datetime.utcnow()
            })
        # log to recent user history
        db['recently_played'].update_one(
            {"user_id": user_id},
            {"$push": {
                "songs": {
                    "song_id": song_id,
                    "song_title": song_title,
                    "played_at": datetime.utcnow()
                }
            }},
            upsert=True
        )

    def get_leaderboard(self, limit=10):
        return list(self.collection.find().sort("play_count", -1).limit(limit))

    def get_recent_by_user(self, user_id, limit=10):
        user_recent = db['recently_played'].find_one({"user_id": user_id})
        if not user_recent or "songs" not in user_recent:
            return []
        # sort and limit manually
        songs = sorted(user_recent["songs"], key=lambda x: x["played_at"], reverse=True)
        return songs[:limit]
    def delete_from_recent(self, user_id, song_title):
        """Remove a specific song from a user's recently played list."""
        result = db['recently_played'].update_one(
            {"user_id": user_id},
            {"$pull": {"songs": {"song_title": song_title}}}
        )
        return result.modified_count > 0
    
