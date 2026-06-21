"""
API Configuration for Lyrica (trimmed to active providers)

This file exposes only the configuration needed for the current
project: YouTube and Ticketmaster. It reads environment variables
from the project's `.env` when present.
"""

import os
from dotenv import load_dotenv

ROOT_DIR = os.path.dirname(os.path.dirname(__file__))
DOTENV_PATH = os.path.join(ROOT_DIR, ".env")
load_dotenv(dotenv_path=DOTENV_PATH)


class APIConfig:
    """Configuration class exposing only YouTube and Ticketmaster keys.

    Add other providers back only if you actually integrate them.
    """

    # YouTube API
    YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY', '')
    YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3'

    # Ticketmaster
    TICKETMASTER_API_KEY = os.getenv('TICKETMASTER_API_KEY', '')

    # Useful operational defaults
    RATE_LIMIT_REQUESTS = 100  # requests per minute (kept for fetchers)
    CACHE_DURATION = 3600      # seconds

    @classmethod
    def is_youtube_configured(cls):
        return bool(cls.YOUTUBE_API_KEY)

    @classmethod
    def is_ticketmaster_configured(cls):
        return bool(cls.TICKETMASTER_API_KEY)

    @classmethod
    def get_ticketmaster_key(cls):
        return cls.TICKETMASTER_API_KEY
