"""
API Fetcher for Lyrica
Fetches songs (YouTube) and concerts (Ticketmaster) and stores them in MongoDB.
"""

import requests
import sys
import os
from datetime import datetime

try:
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(project_root)
except Exception:
    pass

from api.config import APIConfig
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from models.user import User

# ===========================================
#  Helper Functions
# ===========================================
def log_api_error(api_name, status_code, response_text=None):
    """Helper function to log API errors for better debugging."""
    print(f"Failed to fetch from {api_name}:")
    print(f"   Status Code: {status_code}")
    if response_text:
        print(f"   Response: {response_text[:200]}...")

# ===========================================
#  Database Setup
# ===========================================
def create_tables():
    """No-op for MongoDB-backed projects.

    This project uses MongoDB for persistence. Table creation for SQLite
    is not necessary. This function exists for backwards compatibility
    when the fetcher is run standalone.
    """
    print("Using MongoDB for persistence; no SQLite tables to create.")


# ===========================================
#  Fetch Songs from YouTube
# ===========================================
def fetch_songs_from_youtube():
    """Fetches trending music videos from the YouTube Data API."""
    print("\n🎵 Fetching trending songs from YouTube...")
    api_key = APIConfig.YOUTUBE_API_KEY
    if not api_key:
        print("YOUTUBE_API_KEY not found in environment variables. Skipping YouTube fetch.")
        return

    try:
        youtube = build('youtube', 'v3', developerKey=api_key)

        # Get the most popular music videos for the US
        request = youtube.videos().list(
            part="snippet",
            chart="mostPopular",
            regionCode="US",
            videoCategoryId="10", # 10 is the category for Music
            maxResults=10
        )
        response = request.execute()

        items = response.get('items', [])
        if not items:
            print("No popular music videos found on YouTube.")
            return

        db = User.get_db_connection()
        songs_collection = db.songs

        stored_count = 0
        for item in items:
            title = item['snippet']['title']
            video_id = item['id']
            thumbnail_url = item['snippet']['thumbnails']['high']['url']
            artist = item['snippet'].get('channelTitle', 'Unknown Artist')

            doc = {
                'title': title,
                'artist': artist,
                'video_id': video_id,
                'thumbnail_url': thumbnail_url,
                'fetched_at': datetime.now().isoformat()
            }

            # Use upsert to avoid duplicates (based on `video_id`)
            res = songs_collection.update_one(
                {'video_id': video_id},
                {'$setOnInsert': doc},
                upsert=True
            )
            if getattr(res, 'upserted_id', None):
                stored_count += 1
            else:
                print(f"   - Skipping '{title}' (already in database).")

        print(f"Stored {stored_count} new songs from YouTube.")

    except HttpError as e:
        if e.resp.status == 403 and 'quotaExceeded' in str(e.content):
            print("YouTube API quota exceeded. Please wait until it resets (Pacific Time).")
        else:
            log_api_error("YouTube Videos", e.resp.status, e.content)
    except Exception as e:
        print(f"An unexpected error occurred while fetching from YouTube: {e}")



# ===========================================
#  Fetch Concerts
# ===========================================
def fetch_concerts():
    print("\nFetching concerts from Ticketmaster...")
    api_key = APIConfig.TICKETMASTER_API_KEY
    if not api_key:
        print("TICKETMASTER_API_KEY not found in environment variables. Skipping concerts.")
        return
        
    url = f"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=10&apikey={api_key}"
    resp = requests.get(url)
    
    if resp.status_code == 200:
        response_json = resp.json()
        events = response_json.get("_embedded", {}).get("events", [])

        if not events:
            print("No concerts found from Ticketmaster.")
            return

        db = User.get_db_connection()
        concerts_collection = db.concerts

        stored_count = 0
        for e in events[:10]:
            venue_name = "Unknown Venue"
            if "_embedded" in e and "venues" in e["_embedded"] and len(e["_embedded"]["venues"]) > 0:
                venue_name = e["_embedded"]["venues"][0].get("name", "Unknown Venue")

            event_id = e.get('id') or None
            doc = {
                'event_id': event_id,
                'name': e.get('name'),
                'venue': venue_name,
                'date': e.get('dates', {}).get('start', {}).get('localDate'),
                'url': e.get('url'),
                'fetched_at': datetime.now().isoformat()
            }

            if event_id:
                res = concerts_collection.update_one(
                    {'event_id': event_id},
                    {'$setOnInsert': doc},
                    upsert=True
                )
                if getattr(res, 'upserted_id', None):
                    stored_count += 1
            else:
                # Fallback: insert new doc without an event_id
                concerts_collection.insert_one(doc)
                stored_count += 1

        print(f"Stored {stored_count} concerts.")
    else:
        log_api_error("Ticketmaster", resp.status_code, resp.text)


# ===========================================
#  Update All Content
# ===========================================
def update_content():
    """Run all fetchers"""
    print("\nUpdating all external content...")
    
    
    fetch_songs_from_youtube()
    fetch_concerts()
    print("\nAll content updated successfully at", datetime.now().isoformat())


# ===========================================
#  Run standalone
# ===========================================
if __name__ == "__main__":
    create_tables()
    update_content()
    
    