from flask_login import UserMixin
from pymongo import MongoClient
from bson import ObjectId
import bcrypt
from datetime import datetime, timezone, date
import os
from dotenv import load_dotenv

load_dotenv()

# Singleton MongoDB client — shared across all User method calls
_mongo_client = None

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
            self.created_at = user_data.get('created_at', datetime.now(timezone.utc))
            self.last_login = user_data.get('last_login')
            self.active = user_data.get('is_active', True)
            self.playlists = user_data.get('playlists', [])
            self.liked_songs = user_data.get('liked_songs', [])
            self.followed_artists = user_data.get('followed_artists')
            if self.followed_artists is None:
                self.followed_artists = ['arijit-singh', 'sabrina-carpenter', 'the-weeknd']
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
            self.created_at = datetime.now(timezone.utc)
            self.last_login = None
            self.active = True
            self.playlists = []
            self.liked_songs = []
            self.followed_artists = ['arijit-singh', 'sabrina-carpenter', 'the-weeknd']
            self.listening_history = []
            self.preferences = {
                'theme': 'dark',
                'language': 'en',
                'explicit_content': False,
                'autoplay': True
            }

    # -----------------------------
    # DATABASE CONNECTION
    # -----------------------------
    @staticmethod
    def get_db_connection():
        """Get MongoDB connection — uses a singleton client to share state across calls."""
        global _mongo_client
        if _mongo_client is None:
            mongo_uri = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
            _mongo_client = MongoClient(mongo_uri)
        db_name = os.getenv('DB_NAME', 'lyrica_music')
        return _mongo_client[db_name]

    # -----------------------------
    # PASSWORD METHODS
    # -----------------------------
    @staticmethod
    def hash_password(password):
        """Hash a password using bcrypt"""
        return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    def check_password(self, password):
        """Check if provided password matches the hash"""

        try:
            hash_bytes = (
                self.password_hash.encode("utf-8")
                if isinstance(self.password_hash, str)
                else self.password_hash
            )

            # If password_hash is invalid, this will raise ValueError
            return bcrypt.checkpw(password.encode("utf-8"), hash_bytes)

        except Exception:
            # Invalid or corrupted hash → always reject login
            return False


    
    # -----------------------------
    # SAVE / UPDATE
    # -----------------------------
    def save(self):
        db = self.get_db_connection()
        users_collection = db.users
        print("[DB] Saving user to DB -->", db.name)

        dob = self.date_of_birth
        if isinstance(dob, date) and not isinstance(dob, datetime):
            dob = datetime(dob.year, dob.month, dob.day)
        created = self.created_at if isinstance(self.created_at, datetime) else datetime.now(timezone.utc)

        user_data = {
            'username': self.username,
            'email': self.email,
            'password_hash': self.password_hash if isinstance(self.password_hash, str) else self.password_hash.decode('utf-8'),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': dob,
            'gender': self.gender,
            'profile_picture': self.profile_picture or '',
            'is_premium': self.is_premium,
            'created_at': created,
            'last_login': self.last_login,
            'is_active': self.active,
            'playlists': self.playlists,
            'liked_songs': self.liked_songs,
            'followed_artists': self.followed_artists,
            'listening_history': self.listening_history,
            'preferences': self.preferences,
        }

        if self.id:
            users_collection.update_one({'_id': ObjectId(self.id)}, {'$set': user_data})
            print("[DB] Updated user id:", self.id)
        else:
            result = users_collection.insert_one(user_data)
            self.id = str(result.inserted_id)
            print("[DB] Inserted new user id:", self.id)

        return self

    # -----------------------------
    # FIND METHODS
    # -----------------------------
    @staticmethod
    def find_by_email(email):
        db = User.get_db_connection()
        user_data = db.users.find_one({'email': email})
        return User(user_data) if user_data else None

    @staticmethod
    def find_by_username(username):
        db = User.get_db_connection()
        user_data = db.users.find_one({'username': username})
        return User(user_data) if user_data else None

    @staticmethod
    def find_by_id(user_id):
        db = User.get_db_connection()
        try:
            user_data = db.users.find_one({'_id': ObjectId(user_id)})
            return User(user_data) if user_data else None
        except:
            return None

    # -----------------------------
    # ACTIVITY + STATUS
    # -----------------------------
    def update_last_login(self):
        self.last_login = datetime.now(timezone.utc)
        self.save()

    def is_active(self):
        """Flask-Login uses this to check if the user is active."""
        return self.active

    # -----------------------------
    # PLAYLIST / SONG METHODS
    # -----------------------------
    def add_to_playlist(self, playlist_id):
        if playlist_id not in self.playlists:
            self.playlists.append(playlist_id)
            self.save()

    def remove_from_playlist(self, playlist_id):
        if playlist_id in self.playlists:
            self.playlists.remove(playlist_id)
            self.save()

    def like_song(self, song_id):
        if song_id not in self.liked_songs:
            self.liked_songs.append(song_id)
            self.save()

    def unlike_song(self, song_id):
        if song_id in self.liked_songs:
            self.liked_songs.remove(song_id)
            self.save()

    def add_to_history(self, song_id, timestamp=None):
        if timestamp is None:
            timestamp = datetime.now(timezone.utc)
        history_entry = {'song_id': song_id, 'timestamp': timestamp}
        self.listening_history.insert(0, history_entry)
        if len(self.listening_history) > 1000:
                self.listening_history = self.listening_history[:1000]
                self.save()
        # Add these methods to your User class

    def get_liked_songs(self):
        return self.liked_songs

    def add_liked_song(self, song_id):
        if not self.id:
            return
        if song_id not in self.liked_songs:
            self.liked_songs.append(song_id)
            db = self.get_db_connection()
            try:
                db.users.update_one({'_id': ObjectId(self.id)}, {'$addToSet': {'liked_songs': song_id}})
            except Exception:
                # Fallback: save entire user document
                self.save()

    def remove_liked_song(self, song_id):
        if not self.id:
            return
        if song_id in self.liked_songs:
            self.liked_songs.remove(song_id)
            db = self.get_db_connection()
            try:
                db.users.update_one({'_id': ObjectId(self.id)}, {'$pull': {'liked_songs': song_id}})
            except Exception:
                # Fallback: save entire user document
                self.save()

    def follow_artist(self, artist_id):
        if not self.id:
            return
        if artist_id not in self.followed_artists:
            self.followed_artists.append(artist_id)
            db = self.get_db_connection()
            try:
                db.users.update_one({'_id': ObjectId(self.id)}, {'$addToSet': {'followed_artists': artist_id}})
            except Exception:
                self.save()

    def unfollow_artist(self, artist_id):
        if not self.id:
            return
        if artist_id in self.followed_artists:
            self.followed_artists.remove(artist_id)
            db = self.get_db_connection()
            try:
                db.users.update_one({'_id': ObjectId(self.id)}, {'$pull': {'followed_artists': artist_id}})
            except Exception:
                self.save()

    # -----------------------------
    # PREFERENCES
    # -----------------------------
    def update_preferences(self, new_preferences):
        self.preferences.update(new_preferences)
        self.save()

    # -----------------------------
    # CONVERSION
    # -----------------------------
    def to_dict(self):
        def iso(obj):
            if isinstance(obj, (datetime, date)):
                return obj.isoformat()
            return obj

        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'date_of_birth': iso(self.date_of_birth),
            'gender': self.gender,
            'profile_picture': self.profile_picture,
            'is_premium': self.is_premium,
            'created_at': iso(self.created_at),
            'last_login': iso(self.last_login),
            'is_active': self.active,
            'playlists': self.playlists,
            'liked_songs': self.liked_songs,
            'followed_artists': self.followed_artists,
            'listening_history': [
                {'song_id': e['song_id'], 'timestamp': iso(e.get('timestamp'))}
                for e in self.listening_history
            ] if self.listening_history else [],
            'preferences': self.preferences
        }

    def __repr__(self):
        return f'<User {self.username}>'
