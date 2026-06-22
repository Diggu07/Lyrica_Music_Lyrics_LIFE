# utils/artist_aggregator.py
import os
import re
import time
import threading
import requests
from datetime import datetime, timezone
from abc import ABC, abstractmethod
from models.artist import ArtistModel

# Abstract Base Class for API Adapters
class ArtistSourceAdapter(ABC):
    @abstractmethod
    def fetch_metadata(self, artist_name):
        pass

    @abstractmethod
    def fetch_albums(self, artist_id, artist_name):
        pass

    @abstractmethod
    def fetch_popular_tracks(self, artist_name):
        pass

# Concrete Adapter: MusicBrainz
class MusicBrainzAdapter(ArtistSourceAdapter):
    def __init__(self):
        self.lock = threading.Lock()
        self.headers = {"User-Agent": "LyricaMusicLyrics/1.0 (contact: demo@lyrica.com)"}

    def fetch_metadata(self, artist_name):
        with self.lock:
            time.sleep(1.0) # rate limit 1s
            url = "https://musicbrainz.org/ws/2/artist/"
            params = {"query": f"artist:{artist_name}", "fmt": "json"}
            try:
                r = requests.get(url, headers=self.headers, params=params, timeout=10)
                if r.status_code == 200:
                    data = r.json()
                    artists = data.get("artists", [])
                    if artists:
                        mb_art = artists[0]
                        ArtistModel.track_source_health("musicbrainz", success=True)
                        return {
                            "mbid": mb_art.get("id"),
                            "name": mb_art.get("name"),
                            "country": mb_art.get("area", {}).get("name") or mb_art.get("country"),
                            "activeYears": f"{mb_art.get('life-span', {}).get('begin', 'N/A')} - Present",
                            "aliases": [a.get("name") for a in mb_art.get("aliases", [])],
                            "genres": [t.get("name").title() for t in mb_art.get("tags", []) if t.get("count", 0) > 2][:3]
                        }
            except Exception as e:
                ArtistModel.track_source_health("musicbrainz", success=False, error_msg=e)
        return None

    def fetch_albums(self, artist_mbid, artist_name):
        if not artist_mbid:
            return []
        with self.lock:
            time.sleep(1.0)
            url = f"https://musicbrainz.org/ws/2/release-group"
            params = {"artist": artist_mbid, "fmt": "json", "type": "album"}
            try:
                r = requests.get(url, headers=self.headers, params=params, timeout=10)
                if r.status_code == 200:
                    data = r.json()
                    release_groups = data.get("release-groups", [])
                    albums = []
                    for rg in release_groups[:5]:
                        albums.append({
                            "albumId": rg.get("id"),
                            "title": rg.get("title"),
                            "year": rg.get("first-release-date", "")[:4] or "2020",
                            "type": rg.get("primary-type") or "Album",
                            "cover": f"https://coverartarchive.org/release-group/{rg.get('id')}/front"
                        })
                    ArtistModel.track_source_health("coverartarchive", success=True)
                    return albums
            except Exception as e:
                ArtistModel.track_source_health("coverartarchive", success=False, error_msg=e)
        return []

    def fetch_popular_tracks(self, artist_name):
        return [] # MB doesn't resolve popular songs as cleanly as Last.fm

# Concrete Adapter: Last.fm
class LastFmAdapter(ArtistSourceAdapter):
    def __init__(self):
        self.api_key = "4a9f55e5c8e31a89c25f4621516f494c" # Shared fallback key

    def fetch_metadata(self, artist_name):
        url = "http://ws.audioscrobbler.com/2.0/"
        params = {
            "method": "artist.getinfo",
            "artist": artist_name,
            "api_key": self.api_key,
            "format": "json"
        }
        try:
            r = requests.get(url, params=params, timeout=8)
            if r.status_code == 200:
                data = r.json()
                art = data.get("artist")
                if art:
                    ArtistModel.track_source_health("lastfm", success=True)
                    bio_content = art.get("bio", {}).get("summary", "")
                    clean_bio = re.sub('<[^<]+?>', '', bio_content)
                    return {
                        "name": art.get("name"),
                        "bio": clean_bio,
                        "listeners": int(art.get("stats", {}).get("listeners") or 0),
                        "playcount": int(art.get("stats", {}).get("playcount") or 0),
                        "similar": [a.get("name") for a in art.get("similar", {}).get("artist", [])],
                        "tags": [t.get("name").title() for t in art.get("tags", {}).get("tag", [])][:3]
                    }
        except Exception as e:
            ArtistModel.track_source_health("lastfm", success=False, error_msg=e)
        return None

    def fetch_albums(self, artist_id, artist_name):
        return []

    def fetch_popular_tracks(self, artist_name):
        url = "http://ws.audioscrobbler.com/2.0/"
        params = {
            "method": "artist.gettoptracks",
            "artist": artist_name,
            "api_key": self.api_key,
            "limit": 10,
            "format": "json"
        }
        try:
            r = requests.get(url, params=params, timeout=8)
            if r.status_code == 200:
                data = r.json()
                tracks = data.get("toptracks", {}).get("track", [])
                formatted = []
                for t in tracks:
                    tid = "yt_" + str(abs(hash(t.get("name") + artist_name)))
                    formatted.append({
                        "id": tid,
                        "title": t.get("name"),
                        "duration": "3:30",
                        "album": "Single",
                        "listeners": int(t.get("listeners") or 0)
                    })
                return formatted
        except Exception:
            pass
        return []

# Concrete Adapter: LRCLIB
class LRCLibAdapter(ArtistSourceAdapter):
    def fetch_metadata(self, artist_name):
        return None

    def fetch_albums(self, artist_id, artist_name):
        return []

    def fetch_popular_tracks(self, artist_name):
        return []

    def fetch_lyrics(self, artist_name, song_title):
        url = "https://lrclib.net/api/get"
        params = {"artist_name": artist_name, "track_name": song_title}
        try:
            r = requests.get(url, params=params, timeout=5)
            if r.status_code == 200:
                data = r.json()
                ArtistModel.track_source_health("lrclib", success=True)
                return data.get("plainLyrics") or ""
        except Exception as e:
            ArtistModel.track_source_health("lrclib", success=False, error_msg=e)
        return ""

# Source Confidence resolving pipeline
class MergedArtistPipeline:
    def __init__(self):
        self.mb = MusicBrainzAdapter()
        self.lfm = LastFmAdapter()
        self.lrc = LRCLibAdapter()

    def aggregate_profile(self, artist_id, seed_metadata):
        artist_name = seed_metadata.get("name")
        print(f"[Pipeline] Aggregating artist profile: {artist_name}")

        # 1. Fetch metadata (MusicBrainz > Last.fm > Seed)
        mb_data = self.mb.fetch_metadata(artist_name)
        lfm_data = self.lfm.fetch_metadata(artist_name)

        final_name = artist_name
        if mb_data and mb_data.get("name"):
            final_name = mb_data["name"]
        elif lfm_data and lfm_data.get("name"):
            final_name = lfm_data["name"]

        country = seed_metadata.get("country")
        if mb_data and mb_data.get("country"):
            country = mb_data["country"]

        active_years = seed_metadata.get("activeYears")
        if mb_data and mb_data.get("activeYears"):
            active_years = mb_data["activeYears"]

        bio = seed_metadata.get("bio")
        if lfm_data and lfm_data.get("bio"):
            bio = lfm_data["bio"]

        genres = seed_metadata.get("genres")
        if mb_data and mb_data.get("genres"):
            genres = mb_data["genres"]
        elif lfm_data and lfm_data.get("tags"):
            genres = lfm_data["tags"]

        listeners = seed_metadata.get("monthlyListeners", 100000)
        if lfm_data and lfm_data.get("listeners"):
            listeners = lfm_data["listeners"]

        # 2. Fetch image (Last.fm > Seed)
        image = seed_metadata.get("cover")
        banner = seed_metadata.get("banner")

        # 3. Fetch albums (MusicBrainz)
        mbid = mb_data.get("mbid") if mb_data else None
        albums = self.mb.fetch_albums(mbid, final_name)
        if not albums:
            albums = [{"albumId": f"alb_{artist_id}_1", "title": "Greatest Hits", "year": "2023", "cover": image, "type": "Album"}]

        # 4. Fetch tracks (Last.fm)
        tracks = self.lfm.fetch_popular_tracks(final_name)
        if not tracks:
            tracks = [
                {"id": f"yt_track_{artist_id}_1", "title": "Popular Anthem", "duration": "3:15", "album": "Greatest Hits"},
                {"id": f"yt_track_{artist_id}_2", "title": "Lyrical Symphony", "duration": "4:02", "album": "Greatest Hits"}
            ]

        # 5. Fetch lyrics and calculate Lyrical DNA
        lyrics_wall_quotes = []
        dna_scores_list = []
        for t in tracks[:3]: # check top 3 songs
            plain = self.lrc.fetch_lyrics(final_name, t["title"])
            if plain:
                lines = [l.strip() for l in plain.splitlines() if len(l.strip()) > 20]
                if lines:
                    lyrics_wall_quotes.append({
                        "quote": lines[0],
                        "song": t["title"],
                        "album": t.get("album", "Single"),
                        "emotion": "nostalgia" if len(lines) % 2 == 0 else "motivation",
                        "saveCount": 5000 + int(hash(lines[0]) % 4000),
                        "shareCount": 200 + int(hash(lines[0]) % 200)
                    })
                dna_scores = analyze_lyrics_dna(plain)
                dna_scores_list.append(dna_scores)

        # Average DNA
        final_dna = {cat: 0 for cat in EMOTION_KEYWORDS.keys()}
        if dna_scores_list:
            for cat in final_dna.keys():
                final_dna[cat] = int(sum(scores[cat] for scores in dna_scores_list) / len(dna_scores_list))
        else:
            # Seed fallback DNA
            final_dna = {
                "love": 70 if "Pop" in genres or "Romantic" in genres else 30,
                "heartbreak": 60 if "Romantic" in genres or "Alternative" in genres else 20,
                "nostalgia": 50,
                "ambition": 80 if "Hip-Hop" in genres or "Rap" in genres else 40,
                "motivation": 70 if "Hip-Hop" in genres else 30,
                "spirituality": 20,
                "loneliness": 40,
                "freedom": 50,
                "rebellion": 85 if "Rap" in genres or "Rebellion" in genres else 10,
                "selfReflection": 60
            }

        sorted_dna = sorted(final_dna.items(), key=lambda x: x[1], reverse=True)
        primary = sorted_dna[0][0].title() if sorted_dna else "Love"
        secondary = sorted_dna[1][0].title() if len(sorted_dna) > 1 else "Motivation"

        # Populate songs & albums collections
        db = ArtistModel.get_db()
        for alb in albums:
            ArtistModel.save_album({
                "albumId": alb["albumId"],
                "title": alb["title"],
                "artistId": artist_id,
                "cover": alb["cover"] or image,
                "year": alb["year"],
                "type": alb["type"]
            })
            ArtistModel.add_search_index("album", alb["title"], artist_id, album_name=alb["title"])

        for t in tracks:
            ArtistModel.save_song({
                "songId": t["id"],
                "title": t["title"],
                "artistId": artist_id,
                "albumId": albums[0]["albumId"] if albums else None,
                "duration": t["duration"],
                "lyrics": "",
                "popularity": 80,
                "releaseYear": albums[0]["year"] if albums else "2023"
            })
            ArtistModel.add_search_index("song", t["title"], artist_id, song_id=t["id"], album_name=albums[0]["title"] if albums else None)

        # Seeding quotes
        for w in lyrics_wall_quotes:
            ArtistModel.save_lyric({
                "quote": w["quote"],
                "songId": tracks[0]["id"],
                "artistId": artist_id,
                "emotion": w["emotion"],
                "saveCount": w["saveCount"],
                "shareCount": w["shareCount"]
            })
            ArtistModel.add_search_index("lyrics", w["quote"], artist_id, song_id=tracks[0]["id"], metadata={
                "lyricSnippet": w["quote"],
                "song": w["song"],
                "emotion": w["emotion"]
            })

        # Save main artist profile
        ArtistModel.save_artist({
            "artistId": artist_id,
            "name": final_name,
            "bio": bio,
            "genres": genres,
            "country": country,
            "languages": seed_metadata.get("languages", ["English"]),
            "cover": image,
            "banner": banner,
            "activeYears": active_years,
            "followers": seed_metadata.get("followers", 50000),
            "monthlyListeners": listeners,
            "popularityScore": seed_metadata.get("popularityScore", 75),
            "aggregationStatus": "completed",
            "aggregationProgress": 100,
            "lastSuccessfulAggregation": datetime.now(timezone.utc).isoformat()
        })

        # Save analytics
        ArtistModel.save_analytics({
            "artistId": artist_id,
            "topEmotion": primary,
            "secondaryEmotion": secondary,
            "discoveryScore": int(seed_metadata.get("popularityScore", 75) * 1.1),
            "lyricalDNA": final_dna,
            "quotedLyrics": lyrics_wall_quotes if lyrics_wall_quotes else [
                {"quote": "Stay in the middle, like you a little...", "song": tracks[0]["title"], "saveCount": 4200, "shareCount": 150}
            ],
            "relatedArtists": lfm_data.get("similar", []) if lfm_data else [],
            "listenerJourney": {
                "mostPlayedSongs": [t["title"] for t in tracks[:3]],
                "mostSavedLyrics": [w["quote"] for w in lyrics_wall_quotes[:2]] if lyrics_wall_quotes else [],
                "mostSharedQuotes": [w["quote"] for w in lyrics_wall_quotes[:2]] if lyrics_wall_quotes else []
            }
        })

        # Enqueue related artists for background discovery job!
        if lfm_data and lfm_data.get("similar"):
            for sim in lfm_data["similar"][:3]: # limit 3 to prevent runaway aggregation
                sim_id = sim.lower().replace(" ", "-").replace("$", "s").replace("&", "and")
                # check if already exists
                existing = db.artists.find_one({"artistId": sim_id})
                if not existing:
                    # insert placeholder metadata
                    db.artists.insert_one({
                        "artistId": sim_id,
                        "name": sim,
                        "bio": "Discovered through relationships. Queueing for aggregation.",
                        "genres": genres,
                        "country": country,
                        "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300",
                        "banner": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
                        "aggregationStatus": "seeded",
                        "aggregationProgress": 0
                    })
                    # Add aliases for matching
                    db.artist_aliases.update_one(
                        {"alias": sim.lower()},
                        {"$set": {"alias": sim.lower(), "artistId": sim_id}},
                        upsert=True
                    )
                    # Enqueue to persistent queue
                    db.aggregation_queue.update_one(
                        {"artistId": sim_id},
                        {"$set": {
                            "artistId": sim_id,
                            "priority": 2,
                            "status": "pending",
                            "createdAt": datetime.now(timezone.utc),
                            "attempts": 0
                        }},
                        upsert=True
                    )

# Abstract Aggregation Worker interface
class AggregationWorker(ABC):
    @abstractmethod
    def enqueue(self, artist_id, priority=1):
        pass

    @abstractmethod
    def process(self):
        pass

# Concrete Execution: Thread-based background crawler
class ThreadWorker(AggregationWorker):
    def __init__(self):
        self.pipeline = MergedArtistPipeline()
        self.active = True
        self.thread = None

    def enqueue(self, artist_id, priority=1):
        db = ArtistModel.get_db()
        db.aggregation_queue.update_one(
            {"artistId": artist_id},
            {
                "$set": {
                    "artistId": artist_id,
                    "priority": priority,
                    "status": "pending",
                    "createdAt": datetime.now(timezone.utc),
                    "attempts": 0
                }
            },
            upsert=True
        )

    def process(self):
        db = ArtistModel.get_db()
        while self.active:
            try:
                job = db.aggregation_queue.find_one_and_update(
                    {"status": "pending"},
                    {"$set": {"status": "processing"}},
                    sort=[("priority", 1), ("createdAt", 1)]
                )
                if job:
                    artist_id = job["artistId"]
                    db.artists.update_one(
                        {"artistId": artist_id},
                        {"$set": {"aggregationStatus": "aggregating", "aggregationProgress": 30}}
                    )

                    # Lookup seed metadata
                    seed_meta = SEED_ARTISTS.get(artist_id)
                    if not seed_meta:
                        # Fetch default fallback placeholders
                        seed_meta = {
                            "name": artist_id.replace("-", " ").title(),
                            "genres": ["Pop"],
                            "country": "United States",
                            "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300",
                            "banner": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200",
                            "bio": "Artist queued dynamically.",
                            "activeYears": "2020 - Present"
                        }

                    try:
                        self.pipeline.aggregate_profile(artist_id, seed_meta)
                        db.aggregation_queue.update_one(
                            {"artistId": artist_id},
                            {"$set": {"status": "completed"}}
                        )
                    except Exception as e:
                        attempts = job.get("attempts", 0) + 1
                        status = "failed" if attempts >= 3 else "pending"
                        db.aggregation_queue.update_one(
                            {"artistId": artist_id},
                            {"$set": {"status": status, "attempts": attempts}}
                        )
                        db.artists.update_one(
                            {"artistId": artist_id},
                            {"$set": {"aggregationStatus": "failed", "aggregationProgress": 100}}
                        )
                else:
                    time.sleep(5.0)
            except Exception as e:
                print(f"[ThreadWorker] Error: {e}")
                time.sleep(5.0)

    def start(self):
        self.thread = threading.Thread(target=self.process, daemon=True)
        self.thread.start()

# Global Worker Instance
worker_instance = ThreadWorker()

def trigger_background_refresh(artist_id):
    worker_instance.enqueue(artist_id, priority=1)

EMOTION_KEYWORDS = {
    "love": ["love", "romantic", "heart", "baby", "kiss", "pyaar", "ishq", "mohobbat", "dil", "sweet", "forever"],
    "heartbreak": ["break", "cry", "tears", "pain", "hurt", "sorrow", "broken", "gone", "sad", "goodbye", "alone"],
    "nostalgia": ["remember", "back then", "memories", "young", "past", "history", "school", "time", "recall"],
    "ambition": ["dream", "future", "win", "grow", "build", "chase", "climb", "legacy", "crown", "high", "star"],
    "motivation": ["power", "strong", "win", "rise", "fight", "alive", "stand", "run", "survive", "push"],
    "spirituality": ["pray", "god", "lord", "spirit", "soul", "peace", "faith", "holy", "divine", "prayer"],
    "loneliness": ["alone", "empty", "shadow", "silent", "night", "dark", "lost", "nobody", "quiet", "isolation"],
    "freedom": ["free", "fly", "wings", "break out", "run", "wild", "open", "wind", "sky", "escape"],
    "rebellion": ["fight", "system", "war", "weapon", "diss", "fake", "rival", "rebel", "bullet", "truth"],
    "selfReflection": ["mirror", "myself", "who am i", "change", "think", "mind", "question", "path", "growth"]
}

def analyze_lyrics_dna(lyrics_text):
    scores = {cat: 0 for cat in EMOTION_KEYWORDS.keys()}
    if not lyrics_text:
        return scores
    clean_text = lyrics_text.lower()
    words = re.findall(r"\w+", clean_text)
    total_words = len(words)
    if total_words == 0:
        return scores
    for category, keywords in EMOTION_KEYWORDS.items():
        count = sum(clean_text.count(kw) for kw in keywords)
        scores[category] = min(int((count / total_words) * 3000), 100)
    return scores

# Procedural generation of 100+ Seed Artists metadata list
SEED_ARTISTS = {}

GLOBAL_ARTISTS = [
    ("taylor-swift", "Taylor Swift", ["Pop", "Country", "Folk"], "United States"),
    ("the-weeknd", "The Weeknd", ["R&B", "Pop", "Synthwave"], "Canada"),
    ("billie-eilish", "Billie Eilish", ["Alternative", "Pop", "Indie"], "United States"),
    ("sabrina-carpenter", "Sabrina Carpenter", ["Pop", "Dance"], "United States"),
    ("olivia-rodrigo", "Olivia Rodrigo", ["Pop", "Rock", "Alternative"], "United States"),
    ("kendrick-lamar", "Kendrick Lamar", ["Hip-Hop", "Rap"], "United States"),
    ("drake", "Drake", ["Hip-Hop", "Rap", "R&B"], "Canada"),
    ("bruno-mars", "Bruno Mars", ["Pop", "Funk", "Soul"], "United States"),
    ("dua-lipa", "Dua Lipa", ["Pop", "Dance", "Disco"], "United Kingdom"),
    ("ariana-grande", "Ariana Grande", ["Pop", "R&B"], "United States"),
    ("ed-sheeran", "Ed Sheeran", ["Pop", "Singer-Songwriter"], "United Kingdom"),
    ("justin-bieber", "Justin Bieber", ["Pop", "R&B"], "Canada"),
    ("post-malone", "Post Malone", ["Pop", "Hip-Hop", "Rock"], "United States"),
    ("harry-styles", "Harry Styles", ["Pop", "Rock"], "United Kingdom"),
    ("eminem", "Eminem", ["Hip-Hop", "Rap"], "United States"),
    ("rihanna", "Rihanna", ["Pop", "R&B", "Dancehall"], "Barbados"),
    ("beyonce", "Beyoncé", ["Pop", "R&B"], "United States"),
    ("coldplay", "Coldplay", ["Alternative Rock", "Pop"], "United Kingdom"),
    ("sza", "SZA", ["R&B", "Neo-Soul"], "United States"),
    ("travis-scott", "Travis Scott", ["Hip-Hop", "Trap", "Rap"], "United States"),
    ("lana-del-rey", "Lana Del Rey", ["Alternative", "Dream Pop"], "United States"),
    ("miley-cyrus", "Miley Cyrus", ["Pop", "Rock"], "United States"),
    ("adele", "Adele", ["Soul", "Pop"], "United Kingdom"),
    ("shawn-mendes", "Shawn Mendes", ["Pop"], "Canada"),
    ("lady-gaga", "Lady Gaga", ["Pop", "Dance", "Electronic"], "United States"),
    ("selena-gomez", "Selena Gomez", ["Pop", "Dance"], "United States"),
    ("camila-cabello", "Camila Cabello", ["Pop", "Latin"], "Cuba"),
    ("hozier", "Hozier", ["Indie Rock", "Folk", "Soul"], "Ireland"),
    ("khalid", "Khalid", ["R&B", "Pop"], "United States"),
    ("chappell-roan", "Chappell Roan", ["Pop", "Synthpop"], "United States"),
    ("charli-xcx", "Charli XCX", ["Hyperpop", "Pop", "Electronic"], "United Kingdom"),
    ("lorde", "Lorde", ["Art Pop", "Indie Pop"], "New Zealand"),
    ("mitski", "Mitski", ["Indie Rock", "Alternative"], "Japan"),
    ("clairo", "Clairo", ["Indie Pop", "Lo-Fi"], "United States"),
    ("phoebe-bridgers", "Phoebe Bridgers", ["Indie Folk", "Alternative"], "United States"),
    ("frank-ocean", "Frank Ocean", ["R&B", "Neo-Soul"], "United States"),
    ("mac-miller", "Mac Miller", ["Hip-Hop", "Rap"], "United States"),
    ("tyler-the-creator", "Tyler the Creator", ["Hip-Hop", "Alternative Rap"], "United States"),
    ("childish-gambino", "Childish Gambino", ["Hip-Hop", "R&B", "Funk"], "United States"),
    ("j-cole", "J. Cole", ["Hip-Hop", "Rap"], "United States")
]

INDIA_ARTISTS = [
    ("arijit-singh", "Arijit Singh", ["Bollywood", "Romantic", "Classical"], "India"),
    ("shreya-ghoshal", "Shreya Ghoshal", ["Bollywood", "Classical", "Romantic"], "India"),
    ("diljit-dosanjh", "Diljit Dosanjh", ["Punjabi", "Pop", "Bhangra"], "India"),
    ("ap-dhillon", "AP Dhillon", ["Punjabi", "Hip-Hop", "Synthwave"], "India"),
    ("karan-aujla", "Karan Aujla", ["Punjabi", "Hip-Hop", "Rap"], "India"),
    ("krsna", "Kr$na", ["Hip-Hop", "Rap", "Lyrical"], "India"),
    ("badshah", "Badshah", ["Bollywood", "Pop", "Rap"], "India"),
    ("vishal-mishra", "Vishal Mishra", ["Bollywood", "Romantic", "Indie"], "India"),
    ("atif-aslam", "Atif Aslam", ["Bollywood", "Sufi", "Romantic"], "Pakistan"),
    ("sonu-nigam", "Sonu Nigam", ["Bollywood", "Pop", "Classical"], "India"),
    ("jubin-nautiyal", "Jubin Nautiyal", ["Bollywood", "Romantic"], "India"),
    ("sid-sriram", "Sid Sriram", ["Carnatic", "R&B", "Indie"], "India"),
    ("armaan-malik", "Armaan Malik", ["Bollywood", "Pop"], "India"),
    ("jonita-gandhi", "Jonita Gandhi", ["Bollywood", "Pop", "Indie"], "Canada"),
    ("neha-kakkar", "Neha Kakkar", ["Bollywood", "Pop"], "India"),
    ("yo-yo-honey-singh", "Yo Yo Honey Singh", ["Punjabi", "Pop", "Rap"], "India"),
    ("divine", "Divine", ["Hip-Hop", "Gully Rap"], "India"),
    ("raftaar", "Raftaar", ["Hip-Hop", "Rap"], "India"),
    ("seedhe-maut", "Seedhe Maut", ["Hip-Hop", "Alternative Rap"], "India"),
    ("talha-anjum", "Talha Anjum", ["Hip-Hop", "Urdu Rap"], "Pakistan"),
    ("talha-yunus", "Talha Yunus", ["Hip-Hop", "Urdu Rap"], "Pakistan"),
    ("mc-stan", "MC Stan", ["Hip-Hop", "Trap"], "India"),
    ("king", "King", ["Pop", "Hip-Hop", "R&B"], "India"),
    ("anuv-jain", "Anuv Jain", ["Indie Pop", "Acoustic"], "India"),
    ("prateek-kuhad", "Prateek Kuhad", ["Indie Folk", "Pop"], "India"),
    ("ritviz", "Ritviz", ["Electronic", "Folk-Hop"], "India"),
    ("local-train", "The Local Train", ["Indie Rock", "Alternative"], "India"),
    ("when-chai-met-toast", "When Chai Met Toast", ["Indie Folk", "Acoustic"], "India"),
    ("lucky-ali", "Lucky Ali", ["Indie Pop", "Romantic"], "India"),
    ("kk", "KK", ["Bollywood", "Rock", "Romantic"], "India"),
    ("mohit-chauhan", "Mohit Chauhan", ["Bollywood", "Sufi", "Folk"], "India"),
    ("sunidhi-chauhan", "Sunidhi Chauhan", ["Bollywood", "Pop", "Dance"], "India"),
    ("alka-yagnik", "Alka Yagnik", ["Bollywood", "Romantic"], "India"),
    ("udit-narayan", "Udit Narayan", ["Bollywood", "Romantic"], "India"),
    ("kumar-sanu", "Kumar Sanu", ["Bollywood", "Romantic"], "India")
]

KPOP_ARTISTS = [
    ("newjeans", "NewJeans", ["K-Pop", "R&B"], "South Korea"),
    ("aespa", "aespa", ["K-Pop", "EDM", "Cyberpunk"], "South Korea"),
    ("bts", "BTS", ["K-Pop", "Pop", "Hip-Hop"], "South Korea"),
    ("blackpink", "BLACKPINK", ["K-Pop", "EDM", "Hip-Hop"], "South Korea"),
    ("twice", "TWICE", ["K-Pop", "Bubblegum Pop"], "South Korea"),
    ("stray-kids", "Stray Kids", ["K-Pop", "EDM", "Noise Pop"], "South Korea"),
    ("seventeen", "SEVENTEEN", ["K-Pop", "Pop"], "South Korea"),
    ("red-velvet", "Red Velvet", ["K-Pop", "R&B", "Velvet"], "South Korea"),
    ("ive", "IVE", ["K-Pop", "Dance Pop"], "South Korea"),
    ("le-sserafim", "LE SSERAFIM", ["K-Pop", "Dance"], "South Korea"),
    ("txt", "TXT", ["K-Pop", "Rock Pop"], "South Korea"),
    ("enhypen", "ENHYPEN", ["K-Pop", "Synthpop"], "South Korea"),
    ("itzy", "ITZY", ["K-Pop", "EDM"], "South Korea"),
    ("fifty-fifty", "FIFTY FIFTY", ["K-Pop", "Pop"], "South Korea"),
    ("illit", "ILLIT", ["K-Pop", "Bubblegum Pop"], "South Korea")
]

HIPHOP_ARTISTS = [
    ("kanye-west", "Kanye West", ["Hip-Hop", "Rap", "Art Pop"], "United States"),
    ("jay-z", "Jay-Z", ["Hip-Hop", "East Coast Rap"], "United States"),
    ("lil-wayne", "Lil Wayne", ["Hip-Hop", "Southern Rap"], "United States"),
    ("future", "Future", ["Trap", "Hip-Hop"], "United States"),
    ("21-savage", "21 Savage", ["Trap", "Rap"], "United States"),
    ("travis-scott-h", "Travis Scott (HH)", ["Hip-Hop", "Trap"], "United States"),
    ("eminem-h", "Eminem (HH)", ["Hip-Hop", "Rap"], "United States"),
    ("drake-h", "Drake (HH)", ["Hip-Hop", "Rap"], "Canada"),
    ("kendrick-lamar-h", "Kendrick Lamar (HH)", ["Hip-Hop", "Rap"], "United States"),
    ("j-cole-h", "J. Cole (HH)", ["Hip-Hop", "Rap"], "United States")
]

# Unsplash image banks to make layouts premium
PORTRAITS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=300",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300",
    "https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=300",
    "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=300"
]

BANNERS = [
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1200",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1200",
    "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1200"
]

def populate_seed_definitions():
    idx = 0
    all_artists_list = GLOBAL_ARTISTS + INDIA_ARTISTS + KPOP_ARTISTS + HIPHOP_ARTISTS
    for aid, name, genres, country in all_artists_list:
        pop = 70 + (idx % 26)
        SEED_ARTISTS[aid] = {
            "name": name,
            "bio": f"{name} is a highly acclaimed artist from {country}, known for pushing musical limits in {', '.join(genres)}.",
            "genres": genres,
            "country": country,
            "languages": ["Hindi", "English"] if country == "India" or country == "Pakistan" else ["Korean"] if country == "South Korea" else ["English"],
            "cover": PORTRAITS[idx % len(PORTRAITS)],
            "banner": BANNERS[idx % len(BANNERS)],
            "activeYears": "2012 - Present",
            "followers": 100000 + (idx * 1530),
            "monthlyListeners": 500000 + (idx * 7210),
            "popularityScore": pop
        }
        idx += 1

populate_seed_definitions()

def seed_database():
    db = ArtistModel.get_db()
    # Check if we already have artists
    if db.artists.count_documents({}) > 0:
        return

    print("[Seeder] Starting dynamic DB populator for 100+ artists...")
    
    # 1. Seed core artist documents
    for aid, item in SEED_ARTISTS.items():
        db.artists.insert_one({
            "artistId": aid,
            "name": item["name"],
            "bio": item["bio"],
            "genres": item["genres"],
            "country": item["country"],
            "languages": item["languages"],
            "cover": item["cover"],
            "banner": item["banner"],
            "activeYears": item["activeYears"],
            "followers": item["followers"],
            "monthlyListeners": item["monthlyListeners"],
            "popularityScore": item["popularityScore"],
            "aggregationStatus": "seeded",
            "aggregationProgress": 0,
            "lastAggregationAttempt": None,
            "lastSuccessfulAggregation": None
        })

        # Base Analytics Seeding (so it never feels empty on first boot!)
        dna = {cat: 30 + (hash(aid + cat) % 60) for cat in EMOTION_KEYWORDS.keys()}
        sorted_dna = sorted(dna.items(), key=lambda x: x[1], reverse=True)
        primary = sorted_dna[0][0].title()
        secondary = sorted_dna[1][0].title()

        db.artist_analytics.insert_one({
            "artistId": aid,
            "topEmotion": primary,
            "secondaryEmotion": secondary,
            "discoveryScore": int(item["popularityScore"] * 1.1),
            "lyricalDNA": dna,
            "quotedLyrics": [
                {"quote": f"Memories bring back memories of you, back then...", "song": "Memory Symphony", "saveCount": 9200, "shareCount": 420}
            ],
            "relatedArtists": [],
            "listenerJourney": {
                "mostPlayedSongs": ["Memory Symphony", "Vibe Avenue"],
                "mostSavedLyrics": ["Memories bring back memories..."],
                "mostSharedQuotes": ["Memories bring back memories..."]
            }
        })

        # Seeding aliases
        db.artist_aliases.insert_one({"alias": item["name"].lower(), "artistId": aid})
        db.artist_aliases.insert_one({"alias": aid.replace("-", " "), "artistId": aid})

        # Add to search index
        ArtistModel.add_search_index("artist", item["name"], aid)
        for g in item["genres"]:
            ArtistModel.add_search_index("emotion", g, aid)
        ArtistModel.add_search_index("emotion", primary, aid)
        ArtistModel.add_search_index("emotion", secondary, aid)

    # 2. Seed 1400+ relationships programmatically
    print("[Seeder] Generating 1400+ relationship edges...")
    keys = list(SEED_ARTISTS.keys())
    for idx, aid in enumerate(keys):
        # find other artists of similar categories
        category_matches = []
        for other in keys:
            if other != aid:
                # check genre overlap
                shared = set(SEED_ARTISTS[aid]["genres"]).intersection(set(SEED_ARTISTS[other]["genres"]))
                if shared:
                    category_matches.append(other)
        
        # Fallback to nearest neighbors if sparse
        if len(category_matches) < 14:
            category_matches = [keys[(idx + i) % len(keys)] for i in range(1, 15)]

        # Insert relationship
        for other in category_matches[:14]:
            score = 65 + (hash(aid + other) % 30)
            db.artist_graph.insert_one({
                "source": aid,
                "target": other,
                "score": score,
                "reasons": [
                    "Lyrical Similarity",
                    f"Shared Genre: {SEED_ARTISTS[aid]['genres'][0]}",
                    "Shared Audience Interest",
                    f"{score}% Emotional Overlap"
                ]
            })

    # 3. Seed Featured Content
    print("[Seeder] Generating homepage featured contents...")
    db.featured_content.insert_many([
        {"type": "hero", "artistId": "taylor-swift"},
        {"type": "featuredArtist", "artistId": "arijit-singh"},
        {"type": "featuredEmotion", "value": "nostalgia"},
        {"type": "featuredQuote", "value": "Tu hi hai aashiqui, tu hi hai awaargi...", "artistId": "arijit-singh"}
    ])

    # Start the aggregation processor worker thread automatically!
    worker_instance.start()
    print("[Seeder] Decoupled aggregation queue listener started successfully.")

# Auto-seed trigger
populate_seed_definitions()
