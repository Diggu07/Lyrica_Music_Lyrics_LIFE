# models/artist.py
from datetime import datetime, timezone
from bson import ObjectId
from models.user import User

class ArtistModel:
    @staticmethod
    def get_db():
        return User.get_db_connection()

    @staticmethod
    def init_indexes():
        """
        Initializes MongoDB indexes for Lyrica Artist Universe collections.
        Called during app startup.
        """
        db = ArtistModel.get_db()
        try:
            # Index for artist lookups and search
            db.artists.create_index([("artistId", 1)], unique=True)
            db.artists.create_index([("name", "text"), ("aliases", "text")])
            
            # Index for album lookup
            db.albums.create_index([("albumId", 1)], unique=True)
            db.albums.create_index([("artistId", 1)])
            
            # Index for songs lookup and sorting by popularity
            db.songs.create_index([("songId", 1)], unique=True)
            db.songs.create_index([("artistId", 1), ("popularity", -1)])
            db.songs.create_index([("albumId", 1)])
            
            # Index for lyrics filtering by emotion and search
            db.lyrics.create_index([("lyricId", 1)], unique=True)
            db.lyrics.create_index([("songId", 1)])
            db.lyrics.create_index([("artistId", 1), ("emotion", 1)])
            
            # Indexes for related artist graph traversal
            db.artist_graph.create_index([("source", 1)])
            db.artist_graph.create_index([("target", 1)])
            db.artist_graph.create_index([("source", 1), ("target", 1)], unique=True)
            
            # Indexes for analytics lookups
            db.artist_analytics.create_index([("artistId", 1)], unique=True)
            
            # Indexes for persistent aggregation queue
            db.aggregation_queue.create_index([("artistId", 1)], unique=True)
            db.aggregation_queue.create_index([("status", 1), ("priority", 1), ("createdAt", 1)])
            
            # Indexes for source health tracking
            db.source_health.create_index([("source", 1)], unique=True)
            
            # Indexes for aliases
            db.artist_aliases.create_index([("alias", 1)], unique=True)
            db.artist_aliases.create_index([("artistId", 1)])
            
            # Indexes for featured content
            db.featured_content.create_index([("type", 1), ("expiresAt", 1)])
            
            # Indexes for user discovery mix personalization
            db.user_discovery.create_index([("sessionId", 1)], unique=True)
            
            # Indexes for search logging
            db.search_queries.create_index([("query", 1)])
            db.search_queries.create_index([("timestamp", -1)])
            
            # Indexes for general search index collection
            db.search_index.create_index([("text", 1)])
            db.search_index.create_index([("type", 1), ("artistId", 1)])
            
            print("[DATABASE] Indexes initialized successfully.")
        except Exception as e:
            print(f"[DATABASE] Error creating indexes: {e}")

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
        return list(db.artist_graph.find({"source": source_artist}))

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
