# models/artist.py
from datetime import datetime, timezone
from bson import ObjectId
from models.user import User

class ArtistModel:
    @staticmethod
    def get_db():
        return User.get_db_connection()

    @staticmethod
    def get_artist(artist_id):
        db = ArtistModel.get_db()
        return db.artists.find_one({"artistId": artist_id})

    @staticmethod
    def save_artist(artist_data):
        db = ArtistModel.get_db()
        artist_id = artist_data.get("artistId")
        if not artist_id:
            return None
        db.artists.update_one(
            {"artistId": artist_id},
            {"$set": artist_data},
            upsert=True
        )
        return artist_id

    @staticmethod
    def get_analytics(artist_id):
        db = ArtistModel.get_db()
        return db.artist_analytics.find_one({"artistId": artist_id})

    @staticmethod
    def save_analytics(analytics_data):
        db = ArtistModel.get_db()
        artist_id = analytics_data.get("artistId")
        if not artist_id:
            return None
        db.artist_analytics.update_one(
            {"artistId": artist_id},
            {"$set": analytics_data},
            upsert=True
        )
        return artist_id

    @staticmethod
    def get_graph_edges(source_artist):
        db = ArtistModel.get_db()
        return list(db.artist_graph.find({"sourceArtist": source_artist}))

    @staticmethod
    def save_graph_edge(edge_data):
        db = ArtistModel.get_db()
        db.artist_graph.update_one(
            {
                "source": edge_data["source"],
                "target": edge_data["target"]
            },
            {"$set": edge_data},
            upsert=True
        )

    @staticmethod
    def add_search_index(doc_type, text, artist_id, song_id=None, album_name=None, metadata=None):
        db = ArtistModel.get_db()
        index_doc = {
            "type": doc_type,
            "text": text.lower().strip(),
            "artistId": artist_id,
            "songId": song_id,
            "albumName": album_name,
            "metadata": metadata or {}
        }
        db.search_index.update_one(
            {
                "type": doc_type,
                "text": index_doc["text"],
                "artistId": artist_id,
                "songId": song_id
            },
            {"$set": index_doc},
            upsert=True
        )

    @staticmethod
    def save_song(song_data):
        db = ArtistModel.get_db()
        song_id = song_data.get("songId")
        if not song_id:
            return None
        db.songs.update_one(
            {"songId": song_id},
            {"$set": song_data},
            upsert=True
        )
        return song_id

    @staticmethod
    def save_album(album_data):
        db = ArtistModel.get_db()
        album_id = album_data.get("albumId")
        if not album_id:
            return None
        db.albums.update_one(
            {"albumId": album_id},
            {"$set": album_data},
            upsert=True
        )
        return album_id

    @staticmethod
    def save_lyric(lyric_data):
        db = ArtistModel.get_db()
        quote = lyric_data.get("quote")
        song_id = lyric_data.get("songId")
        if not quote or not song_id:
            return None
        db.lyrics.update_one(
            {"quote": quote, "songId": song_id},
            {"$set": lyric_data},
            upsert=True
        )
        return quote

    @staticmethod
    def log_search_query(query, results_count):
        db = ArtistModel.get_db()
        db.search_queries.insert_one({
            "query": query.strip().lower(),
            "results": results_count,
            "timestamp": datetime.now(timezone.utc)
        })

    @staticmethod
    def track_source_health(source_name, success=True, error_msg=None):
        db = ArtistModel.get_db()
        update_fields = {
            "lastRequest": datetime.now(timezone.utc)
        }
        inc_fields = {
            "requestsToday": 1
        }
        if success:
            inc_fields["successCount"] = 1
        else:
            inc_fields["failureCount"] = 1
            update_fields["lastFailure"] = datetime.now(timezone.utc)
            if error_msg:
                update_fields["lastErrorMessage"] = str(error_msg)

        db.source_health.update_one(
            {"source": source_name.lower()},
            {
                "$set": update_fields,
                "$inc": inc_fields
            },
            upsert=True
        )
