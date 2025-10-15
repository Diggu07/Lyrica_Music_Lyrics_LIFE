"""
Song model for storing music metadata
"""
from pymongo import MongoClient
from bson import ObjectId
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class Song:
    def __init__(self, song_data=None):
        if song_data:
            self.id = str(song_data.get('_id'))
            self.title = song_data.get('title')
            self.artist = song_data.get('artist')
            self.album = song_data.get('album')
            self.duration = song_data.get('duration')  # in seconds
            self.genre = song_data.get('genre')
            self.year = song_data.get('year')
            self.spotify_id = song_data.get('spotify_id')
            self.youtube_id = song_data.get('youtube_id')
            self.lastfm_id = song_data.get('lastfm_id')
            self.preview_url = song_data.get('preview_url')
            self.image_url = song_data.get('image_url')
            self.popularity = song_data.get('popularity', 0)
            self.explicit = song_data.get('explicit', False)
            self.created_at = song_data.get('created_at', datetime.utcnow())
            self.updated_at = song_data.get('updated_at', datetime.utcnow())
            self.play_count = song_data.get('play_count', 0)
            self.like_count = song_data.get('like_count', 0)
        else:
            self.id = None
            self.title = None
            self.artist = None
            self.album = None
            self.duration = None
            self.genre = None
            self.year = None
            self.spotify_id = None
            self.youtube_id = None
            self.lastfm_id = None
            self.preview_url = None
            self.image_url = None
            self.popularity = 0
            self.explicit = False
            self.created_at = datetime.utcnow()
            self.updated_at = datetime.utcnow()
            self.play_count = 0
            self.like_count = 0

    @staticmethod
    def get_db_connection():
        """Get MongoDB connection"""
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        db_name = os.getenv('DB_NAME', 'lyrica_music')
        client = MongoClient(mongo_uri)
        return client[db_name]

    def save(self):
        """Save song to database"""
        db = self.get_db_connection()
        songs_collection = db.songs
        
        song_data = {
            'title': self.title,
            'artist': self.artist,
            'album': self.album,
            'duration': self.duration,
            'genre': self.genre,
            'year': self.year,
            'spotify_id': self.spotify_id,
            'youtube_id': self.youtube_id,
            'lastfm_id': self.lastfm_id,
            'preview_url': self.preview_url,
            'image_url': self.image_url,
            'popularity': self.popularity,
            'explicit': self.explicit,
            'created_at': self.created_at,
            'updated_at': self.updated_at,
            'play_count': self.play_count,
            'like_count': self.like_count
        }
        
        if self.id:
            # Update existing song
            songs_collection.update_one(
                {'_id': ObjectId(self.id)},
                {'$set': song_data}
            )
        else:
            # Create new song
            result = songs_collection.insert_one(song_data)
            self.id = str(result.inserted_id)
        
        return self

    @staticmethod
    def find_by_id(song_id):
        """Find song by ID"""
        db = Song.get_db_connection()
        songs_collection = db.songs
        try:
            song_data = songs_collection.find_one({'_id': ObjectId(song_id)})
            if song_data:
                return Song(song_data)
        except:
            pass
        return None

    @staticmethod
    def find_by_spotify_id(spotify_id):
        """Find song by Spotify ID"""
        db = Song.get_db_connection()
        songs_collection = db.songs
        song_data = songs_collection.find_one({'spotify_id': spotify_id})
        if song_data:
            return Song(song_data)
        return None

    @staticmethod
    def search_songs(query, limit=20):
        """Search songs by title or artist"""
        db = Song.get_db_connection()
        songs_collection = db.songs
        
        # Create search query
        search_query = {
            '$or': [
                {'title': {'$regex': query, '$options': 'i'}},
                {'artist': {'$regex': query, '$options': 'i'}},
                {'album': {'$regex': query, '$options': 'i'}}
            ]
        }
        
        songs = songs_collection.find(search_query).limit(limit).sort('popularity', -1)
        return [Song(song) for song in songs]

    @staticmethod
    def get_trending_songs(limit=20):
        """Get trending songs based on play count and popularity"""
        db = Song.get_db_connection()
        songs_collection = db.songs
        
        # Aggregate query to calculate trending score
        pipeline = [
            {
                '$addFields': {
                    'trending_score': {
                        '$add': [
                            {'$multiply': ['$play_count', 0.3]},
                            {'$multiply': ['$popularity', 0.7]}
                        ]
                    }
                }
            },
            {'$sort': {'trending_score': -1}},
            {'$limit': limit}
        ]
        
        songs = songs_collection.aggregate(pipeline)
        return [Song(song) for song in songs]

    @staticmethod
    def get_songs_by_genre(genre, limit=20):
        """Get songs by genre"""
        db = Song.get_db_connection()
        songs_collection = db.songs
        
        songs = songs_collection.find({'genre': genre}).limit(limit).sort('popularity', -1)
        return [Song(song) for song in songs]

    def increment_play_count(self):
        """Increment play count"""
        self.play_count += 1
        self.updated_at = datetime.utcnow()
        self.save()

    def increment_like_count(self):
        """Increment like count"""
        self.like_count += 1
        self.updated_at = datetime.utcnow()
        self.save()

    def to_dict(self):
        """Convert song to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'artist': self.artist,
            'album': self.album,
            'duration': self.duration,
            'genre': self.genre,
            'year': self.year,
            'spotify_id': self.spotify_id,
            'youtube_id': self.youtube_id,
            'preview_url': self.preview_url,
            'image_url': self.image_url,
            'popularity': self.popularity,
            'explicit': self.explicit,
            'play_count': self.play_count,
            'like_count': self.like_count,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

    def __repr__(self):
        return f'<Song {self.title} by {self.artist}>'
