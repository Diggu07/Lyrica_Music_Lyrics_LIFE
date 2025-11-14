"""
API Fetcher for Lyrica
Fetches songs (YouTube), podcasts, news, and concerts.
"""

import requests
import sqlite3
import time
import sys
import os
from datetime import datetime

# --- Fix for ModuleNotFoundError ---
# The recommended way to run is from the project root: `python -m api.api_fetcher`
try:
    project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    sys.path.append(project_root)
except Exception:
    pass

from api.config import APIConfig
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError

DB_PATH = "database/content.db"

# ===========================================
#  Helper Functions
# ===========================================
def log_api_error(api_name, status_code, response_text=None):
    """Helper function to log API errors for better debugging."""
    print(f"❌ Failed to fetch from {api_name}:")
    print(f"   Status Code: {status_code}")
    if response_text:
        print(f"   Response: {response_text[:200]}...")

# ===========================================
#  Database Setup
# ===========================================
def create_tables():
    """Create tables if they do not exist"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    # Updated schema for YouTube
    cur.execute("""
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            artist TEXT,
            album TEXT,
            video_id TEXT NOT NULL UNIQUE,
            thumbnail_url TEXT,
            fetched_at TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS podcasts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            publisher TEXT,
            url TEXT,
            fetched_at TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS news (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            source TEXT,
            url TEXT,
            fetched_at TEXT
        )
    """)

    cur.execute("""
        CREATE TABLE IF NOT EXISTS concerts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            venue TEXT,
            date TEXT,
            url TEXT,
            fetched_at TEXT
        )
    """)

    conn.commit()
    conn.close()
    print("✅ Database tables verified or created successfully.")


# ===========================================
#  Fetch Songs from YouTube
# ===========================================
def fetch_songs_from_youtube():
    """Fetches trending music videos from the YouTube Data API."""
    print("\n🎵 Fetching trending songs from YouTube...")
    api_key = APIConfig.YOUTUBE_API_KEY
    if not api_key:
        print("⚠️ YOUTUBE_API_KEY not found in environment variables. Skipping YouTube fetch.")
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
            print("⚠️ No popular music videos found on YouTube.")
            return

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        
        stored_count = 0
        for item in items:
            title = item['snippet']['title']
            # Check if we already have this song to save on API quota and avoid duplicates
            cur.execute("SELECT id FROM songs WHERE title = ?", (title,))
            if cur.fetchone():
                print(f"   - Skipping '{title}' (already in database).")
                continue

            video_id = item['id']
            thumbnail_url = item['snippet']['thumbnails']['high']['url']
            
            # Note: YouTube API doesn't always provide a clean 'artist' field in this response.
            # The title usually contains "Artist - Song Name".
            artist = item['snippet'].get('channelTitle', 'Unknown Artist')
            
            cur.execute(
                "INSERT INTO songs (title, artist, video_id, thumbnail_url, fetched_at) VALUES (?, ?, ?, ?, ?)",
                (title, artist, video_id, thumbnail_url, datetime.now().isoformat())
            )
            stored_count += 1
            
        conn.commit()
        conn.close()
        print(f"✅ Stored {stored_count} new songs from YouTube.")

    except HttpError as e:
        if e.resp.status == 403 and 'quotaExceeded' in str(e.content):
            print("❌ YouTube API quota exceeded. Please wait until it resets (Pacific Time).")
        else:
            log_api_error("YouTube Videos", e.resp.status, e.content)
    except Exception as e:
        print(f"❌ An unexpected error occurred while fetching from YouTube: {e}")


# ===========================================
#  Fetch Songs from Deezer (30-sec previews) - DISABLED
# ===========================================
# def fetch_songs():
#     """Fetch 30-second preview songs from Deezer API"""
#     print("\n🎵 Fetching trending songs from Deezer...")
#     # ... (original Deezer code) ...
#     print("⚠️ Deezer fetcher is currently disabled.")


# ===========================================
#  Fetch Podcasts
# ===========================================
def fetch_podcasts():
    print("\n🎙️ Fetching top podcasts...")
    api_key = APIConfig.LISTEN_NOTES_API_KEY
    if not api_key:
        print("⚠️ LISTEN_NOTES_API_KEY not found in environment variables. Skipping podcasts.")
        return
        
    url = "https://listen-api.listennotes.com/api/v2/best_podcasts"
    headers = {"X-ListenAPI-Key": api_key}
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        data = resp.json().get("podcasts", [])
        if not data:
            print("⚠️ No podcasts found from Listen Notes.")
            return
            
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for p in data[:10]:
            cur.execute(
                "INSERT INTO podcasts (title, publisher, url, fetched_at) VALUES (?, ?, ?, ?)",
                (p["title"], p["publisher"], p["listennotes_url"], datetime.now().isoformat())
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(data[:10])} podcasts.")
    else:
        log_api_error("Listen Notes", resp.status_code, resp.text)


# ===========================================
#  Fetch News
# ===========================================
def fetch_news():
    print("\n📰 Fetching entertainment news...")
    api_key = APIConfig.NEWS_API_KEY
    if not api_key:
        print("⚠️ NEWS_API_KEY not found in environment variables. Skipping news.")
        return
        
    url = f"https://newsapi.org/v2/top-headlines?category=entertainment&language=en&apiKey={api_key}"
    resp = requests.get(url)

    if resp.status_code == 200:
        data = resp.json().get("articles", [])
        if not data:
            print("⚠️ No news articles found from NewsAPI.")
            return

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for n in data[:10]:
            cur.execute(
                "INSERT INTO news (title, source, url, fetched_at) VALUES (?, ?, ?, ?)",
                (n["title"], n["source"]["name"], n["url"], datetime.now().isoformat())
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(data[:10])} news articles.")
    else:
        log_api_error("NewsAPI", resp.status_code, resp.text)


# ===========================================
#  Fetch Concerts
# ===========================================
def fetch_concerts():
    print("\n🎫 Fetching concerts from Ticketmaster...")
    api_key = APIConfig.TICKETMASTER_API_KEY
    if not api_key:
        print("⚠️ TICKETMASTER_API_KEY not found in environment variables. Skipping concerts.")
        return
        
    url = f"https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&size=10&apikey={api_key}"
    resp = requests.get(url)
    
    if resp.status_code == 200:
        response_json = resp.json()
        events = response_json.get("_embedded", {}).get("events", [])
        
        if not events:
            print("⚠️ No concerts found from Ticketmaster.")
            return
            
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for e in events[:10]:
            venue_name = "Unknown Venue"
            if "_embedded" in e and "venues" in e["_embedded"] and len(e["_embedded"]["venues"]) > 0:
                venue_name = e["_embedded"]["venues"][0].get("name", "Unknown Venue")
                
            cur.execute(
                "INSERT INTO concerts (name, venue, date, url, fetched_at) VALUES (?, ?, ?, ?, ?)",
                (
                    e["name"],
                    venue_name,
                    e["dates"]["start"]["localDate"],
                    e["url"],
                    datetime.now().isoformat()
                )
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(events[:10])} concerts.")
    else:
        log_api_error("Ticketmaster", resp.status_code, resp.text)


# ===========================================
#  Update All Content
# ===========================================
def update_content():
    """Run all fetchers"""
    print("\n🔄 Updating all external content...")
    
    # --- CHOOSE YOUR SONG SOURCE ---
    # Option 1: Fetch from YouTube (New Method)
    fetch_songs_from_youtube()
    
    # Option 2: Fetch from Deezer (Old Method)
    # fetch_songs() 

    fetch_podcasts()
    fetch_news()
    fetch_concerts()
    print("\n✅ All content updated successfully at", datetime.now().isoformat())


# ===========================================
#  Run standalone
# ===========================================
if __name__ == "__main__":
    create_tables()
    update_content()
    
    # Option 2: Run continuously (uncomment if you want this behavior)
    # try:
    #     print("\n⏳ Starting hourly content refresh. Press Ctrl+C to stop.")
    #     while True:
    #         update_content()
    #         print("\n⏳ Waiting for 1 hour before next update...")
    #         time.sleep(3600)
    # except KeyboardInterrupt:
    #     print("\n⏹️ Stopping content updates.")