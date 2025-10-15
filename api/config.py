"""
API Configuration for external music services
"""
import os
from dotenv import load_dotenv

load_dotenv()

class APIConfig:
    """Configuration class for external APIs"""
    
    # Spotify API Configuration
    SPOTIFY_CLIENT_ID = os.getenv('SPOTIFY_CLIENT_ID', '')
    SPOTIFY_CLIENT_SECRET = os.getenv('SPOTIFY_CLIENT_SECRET', '')
    SPOTIFY_REDIRECT_URI = os.getenv('SPOTIFY_REDIRECT_URI', 'http://localhost:5000/auth/spotify/callback')
    SPOTIFY_SCOPE = 'user-read-private user-read-email user-library-read user-top-read'
    
    # YouTube API Configuration
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
    YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'
    
    # Last.fm API Configuration
    LASTFM_API_KEY = os.getenv('LASTFM_API_KEY', '')
    LASTFM_SECRET = os.getenv('LASTFM_SECRET', '')
    LASTFM_API_URL = 'http://ws.audioscrobbler.com/2.0/'
    
    # MusicBrainz API Configuration
    MUSICBRAINZ_API_URL = 'https://musicbrainz.org/ws/2/'
    
    # Rate limiting
    RATE_LIMIT_REQUESTS = 100  # requests per minute
    RATE_LIMIT_WINDOW = 60     # seconds
    
    # Cache settings
    CACHE_DURATION = 3600  # 1 hour in seconds
    
    @classmethod
    def get_spotify_credentials(cls):
        """Get Spotify API credentials"""
        return {
            'client_id': cls.SPOTIFY_CLIENT_ID,
            'client_secret': cls.SPOTIFY_CLIENT_SECRET,
            'redirect_uri': cls.SPOTIFY_REDIRECT_URI,
            'scope': cls.SPOTIFY_SCOPE
        }
    
    @classmethod
    def is_spotify_configured(cls):
        """Check if Spotify API is properly configured"""
        return bool(cls.SPOTIFY_CLIENT_ID and cls.SPOTIFY_CLIENT_SECRET)
    
    @classmethod
    def is_youtube_configured(cls):
        """Check if YouTube API is properly configured"""
        return bool(cls.YOUTUBE_API_KEY)
    
    @classmethod
    def is_lastfm_configured(cls):
        """Check if Last.fm API is properly configured"""
        return bool(cls.LASTFM_API_KEY)
