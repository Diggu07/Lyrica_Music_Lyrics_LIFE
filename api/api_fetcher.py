"""
API Fetcher for Lyrica
Fetches 30-second preview songs (Deezer), podcasts, news, and concerts.
"""

import requests
import sqlite3
import time
from datetime import datetime
from api.config import APIConfig

DB_PATH = "database/content.db"


# ===========================================
#  Database Setup
# ===========================================
def create_tables():
    """Create tables if they do not exist"""
    conn = sqlite3.connect(DB_PATH)
    cur = conn.cursor()

    cur.execute("""
        CREATE TABLE IF NOT EXISTS songs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT,
            artist TEXT,
            album TEXT,
            preview_url TEXT,
            cover TEXT,
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
#  Fetch Songs from Deezer (30-sec previews)
# ===========================================
def fetch_songs():
    """Fetch 30-second preview songs from Deezer API"""
    print("\n🎵 Fetching trending songs from Deezer...")
    url = "https://api.deezer.com/search?q=pop"
    resp = requests.get(url)

    if resp.status_code == 200:
        data = resp.json().get("data", [])
        if not data:
            print("⚠️ No songs found from Deezer.")
            return

        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for s in data[:10]:
            cur.execute(
                "INSERT INTO songs (title, artist, album, preview_url, cover, fetched_at) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    s["title"],
                    s["artist"]["name"],
                    s["album"]["title"],
                    s["preview"],
                    s["album"]["cover_medium"],
                    datetime.now()
                )
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(data[:10])} songs (30-sec previews).")
    else:
        print("❌ Failed to fetch songs:", resp.status_code)


# ===========================================
#  Fetch Podcasts
# ===========================================
def fetch_podcasts():
    print("\n🎙️ Fetching top podcasts...")
    api_key = APIConfig.LASTFM_API_KEY or ""  # You can use a ListenNotes key here
    url = "https://listen-api.listennotes.com/api/v2/best_podcasts"
    headers = {"X-ListenAPI-Key": api_key} if api_key else {}
    resp = requests.get(url, headers=headers)

    if resp.status_code == 200:
        data = resp.json().get("podcasts", [])
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for p in data[:10]:
            cur.execute(
                "INSERT INTO podcasts (title, publisher, url, fetched_at) VALUES (?, ?, ?, ?)",
                (p["title"], p["publisher"], p["listennotes_url"], datetime.now())
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(data[:10])} podcasts.")
    else:
        print("❌ Failed to fetch podcasts:", resp.status_code)


# ===========================================
#  Fetch News
# ===========================================
def fetch_news():
    print("\n📰 Fetching entertainment news...")
    api_key = APIConfig.YOUTUBE_API_KEY or ""  # can reuse for NewsAPI
    url = f"https://newsapi.org/v2/top-headlines?category=entertainment&language=en&apiKey={api_key}"
    resp = requests.get(url)

    if resp.status_code == 200:
        data = resp.json().get("articles", [])
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for n in data[:10]:
            cur.execute(
                "INSERT INTO news (title, source, url, fetched_at) VALUES (?, ?, ?, ?)",
                (n["title"], n["source"]["name"], n["url"], datetime.now())
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(data[:10])} news articles.")
    else:
        print("❌ Failed to fetch news:", resp.status_code)


# ===========================================
#  Fetch Concerts
# ===========================================
def fetch_concerts():
    print("\n🎫 Fetching concerts from Ticketmaster...")
    url = "https://app.ticketmaster.com/discovery/v2/events.json?classificationName=music&city=Delhi&apikey=YOUR_TICKETMASTER_API_KEY"
    resp = requests.get(url)
    if resp.status_code == 200:
        events = resp.json().get("_embedded", {}).get("events", [])
        conn = sqlite3.connect(DB_PATH)
        cur = conn.cursor()
        for e in events[:10]:
            cur.execute(
                "INSERT INTO concerts (name, venue, date, url, fetched_at) VALUES (?, ?, ?, ?, ?)",
                (
                    e["name"],
                    e["_embedded"]["venues"][0]["name"],
                    e["dates"]["start"]["localDate"],
                    e["url"],
                    datetime.now()
                )
            )
        conn.commit()
        conn.close()
        print(f"✅ Stored {len(events[:10])} concerts.")
    else:
        print("❌ Failed to fetch concerts:", resp.status_code)


# ===========================================
#  Update All Content
# ===========================================
def update_content():
    """Run all fetchers"""
    print("\n🔄 Updating all external content...")
    fetch_songs()
    fetch_podcasts()
    fetch_news()
    fetch_concerts()
    print("\n✅ All content updated successfully at", datetime.now())


# ===========================================
#  Run standalone (hourly refresh)
# ===========================================
if __name__ == "__main__":
    create_tables()
    while True:
        update_content()
        time.sleep(3600)
