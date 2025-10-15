from flask_login import UserMixin
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from datetime import datetime
import os
from dotenv import load_dotenv

load_dotenv()

class User(UserMixin):
    def __init__(self, user_data=None):
        if user_data:
            self.id = str(user_data.get('_id'))
            self.username = user_data.get('username')
            self.email = user_data.get('email')
            self.password_hash = user_data.get('password_hash')
            self.first_name = user_data.get('first_name', '')
            self.last_name = user_data.get('last_name', '')
            self.date_of_birth = user_data.get('date_of_birth')
            self.gender = user_data.get('gender', '')
            self.profile_picture = user_data.get('profile_picture', '')
            self.is_premium = user_data.get('is_premium', False)
            self.created_at = user_data.get('created_at', datetime.utcnow())
            self.last_login = user_data.get('last_login')
            self.is_active = user_data.get('is_active', True)
            self.playlists = user_data.get('playlists', [])
            self.liked_songs = user_data.get('liked_songs', [])
            self.listening_history = user_data.get('listening_history', [])
            self.preferences = user_data.get('preferences', {
                'theme': 'dark',
                'language': 'en',
                'explicit_content': False,
                'autoplay': True
            })
        else:
            self.id = None
            self.username = None
            self.email = None
            self.password_hash = None
            self.first_name = None
            self.last_name = None
            self.date_of_birth = None
            self.gender = None
            self.profile_picture = None
            self.is_premium = False
            self.created_at = datetime.utcnow()
            self.last_login = None
            self.is_active = True
            self.playlists = []
            self.liked_songs = []
            self.listening_history = []
            self.preferences = {
                'theme': 'dark',
                'language': 'en',
                'explicit_content': False,
                'autoplay': True
            }

    @staticmethod
    def get_db_connection():
        """Get MongoDB connection"""
        mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
        db_name = os.getenv('DB_NAME', 'lyrica_music')
        client = MongoClient(mongo_uri)
        return client[db_name]

    @staticmethod
    def hash_password(password):
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def check_password(self, password):
        """Check if provided password matches the hash"""
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash)

    def save(self):
        """Save user to database"""
        db = self.get_db_connection()
        users_collection = db.users
        
        user_data = {
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth,
            'gender': self.gender,
            'profile_picture': self.profile_picture,
            'is_premium': self.is_premium,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'is_active': self.is_active,
            'playlists': self.playlists,
            'liked_songs': self.liked_songs,
            'listening_history': self.listening_history,
            'preferences': self.preferences
        }
        
        if self.id:
            # Update existing user
            users_collection.update_one(
                {'_id': ObjectId(self.id)},
                {'$set': user_data}
            )
        else:
            # Create new user
            result = users_collection.insert_one(user_data)
            self.id = str(result.inserted_id)
        
        return self

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = User.get_db_connection()
        users_collection = db.users
        user_data = users_collection.find_one({'email': email})
        if user_data:
            return User(user_data)
        return None

    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        db = User.get_db_connection()
        users_collection = db.users
        user_data = users_collection.find_one({'username': username})
        if user_data:
            return User(user_data)
        return None

    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        db = User.get_db_connection()
        users_collection = db.users
        try:
            user_data = users_collection.find_one({'_id': ObjectId(user_id)})
            if user_data:
                return User(user_data)
        except:
            pass
        return None

    def update_last_login(self):
        """Update last login timestamp"""
        self.last_login = datetime.utcnow()
        self.save()

    def add_to_playlist(self, playlist_id):
        """Add playlist to user's playlists"""
        if playlist_id not in self.playlists:
            self.playlists.append(playlist_id)
            self.save()

    def remove_from_playlist(self, playlist_id):
        """Remove playlist from user's playlists"""
        if playlist_id in self.playlists:
            self.playlists.remove(playlist_id)
            self.save()

    def like_song(self, song_id):
        """Add song to liked songs"""
        if song_id not in self.liked_songs:
            self.liked_songs.append(song_id)
            self.save()

    def unlike_song(self, song_id):
        """Remove song from liked songs"""
        if song_id in self.liked_songs:
            self.liked_songs.remove(song_id)
            self.save()

    def add_to_history(self, song_id, timestamp=None):
        """Add song to listening history"""
        if timestamp is None:
            timestamp = datetime.utcnow()
        
        history_entry = {
            'song_id': song_id,
            'timestamp': timestamp
        }
        
        # Add to beginning of history (most recent first)
        self.listening_history.insert(0, history_entry)
        
        # Keep only last 1000 entries
        if len(self.listening_history) > 1000:
            self.listening_history = self.listening_history[:1000]
        
        self.save()

    def update_preferences(self, new_preferences):
        """Update user preferences"""
        self.preferences.update(new_preferences)
        self.save()

    def to_dict(self):
        """Convert user to dictionary (excluding sensitive data)"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': self.date_of_birth,
            'gender': self.gender,
            'profile_picture': self.profile_picture,
            'is_premium': self.is_premium,
            'created_at': self.created_at,
            'last_login': self.last_login,
            'is_active': self.is_active,
            'playlists': self.playlists,
            'liked_songs': self.liked_songs,
            'listening_history': self.listening_history,
            'preferences': self.preferences
        }

    def __repr__(self):
        return f'<User {self.username}>'
