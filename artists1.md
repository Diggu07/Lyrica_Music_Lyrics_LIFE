# Implementation Plan — Lyrica Artists Page (v2)
# Production Architecture · API-First · Full Data Aggregation

---

## Strategic Overview

This revision shifts the Artists Page from a partially-seeded system to a
**fully API-driven aggregation architecture**. Every artist's complete catalog
(songs, albums, lyrics, relationships) is fetched from real APIs, cached in
MongoDB, and served through a unified data layer.

Unique differentiators baked into this plan:
- Real-time "Lyrical Pulse" — live emotion sentiment derived from lyrics
- Music Universe Explorer — interactive graph: Artist → Album → Song → Lyric → Emotion
- Artist DNA cards — algorithmically generated identity from actual song data
- Lyric Cinema — full-screen immersive lyric reader with auto-scroll
- "Sound Neighbors" — graph-based artist recommendations, not collaborative filtering

---

## API Sources & Data Contracts

### Primary APIs (no auth required or free tier)

| Source | Data | Rate Limit | Base URL |
|---|---|---|---|
| MusicBrainz | Artist, albums, songs, relationships | 1 req/s | `https://musicbrainz.org/ws/2` |
| LRCLib | Synced + plain lyrics | Generous | `https://lrclib.net/api` |
| Last.fm | Popularity, tags, similar artists | 5 req/s | `http://ws.audioscrobbler.com/2.0` |
| Cover Art Archive | Album art | Generous | `https://coverartarchive.org` |
| Deezer | Preview URLs, genres, fan count | 50 req/5s | `https://api.deezer.com` |

### Secondary / Enrichment APIs

| Source | Data | Notes |
|---|---|---|
| AcousticBrainz (legacy dump) | Audio features (BPM, key, mood) | Use archived dataset |
| Wikidata | Nationality, active years, bio | SPARQL endpoint, free |
| MusicBrainz Relations | Band members, collaborations | Part of MB response |

### Data Flow


---

## MongoDB Collections (Final Schema)

### `artists`
```json
{
  "artistId": "string (MB MBID)",
  "name": "string",
  "aliases": ["string"],
  "country": "string",
  "nationality": "string",
  "activeYears": { "start": 1989, "end": null },
  "genres": ["string"],
  "bio": "string",
  "imageUrl": "string",
  "fanCount": 0,
  "popularity": 0,
  "aggregationStatus": "seeded | in_progress | complete | failed",
  "lastAggregated": "ISO date",
  "sources": {
    "mbid": "string",
    "deezerId": "string",
    "lastfmUrl": "string"
  }
}
```

### `albums`
```json
{
  "albumId": "string (MB release-group MBID)",
  "title": "string",
  "artistId": "string",
  "year": 2020,
  "type": "album | single | ep | compilation | live",
  "coverUrl": "string",
  "trackCount": 0,
  "genres": ["string"],
  "deezerPreviewUrl": "string"
}
```

### `songs`
```json
{
  "songId": "string (MB recording MBID)",
  "title": "string",
  "artistId": "string",
  "albumId": "string",
  "duration": 210,
  "releaseYear": 2020,
  "popularity": 0,
  "previewUrl": "string (Deezer 30s clip)",
  "bpm": 128,
  "key": "C minor",
  "mood": "string (from AcousticBrainz)"
}
```

### `lyrics`
```json
{
  "lyricId": "string",
  "songId": "string",
  "artistId": "string",
  "plainText": "string",
  "syncedLrc": "string (LRC format)",
  "hasSynced": true,
  "emotion": "melancholy | euphoric | angry | nostalgic | romantic | defiant | hopeful | dark",
  "emotionScore": 0.87,
  "quotableLines": ["string"],
  "saveCount": 0,
  "shareCount": 0
}
```

### `artist_graph`
```json
{
  "source": "artistId",
  "target": "artistId",
  "score": 0.92,
  "reasons": ["same genre", "collaborated", "similar tags"],
  "edgeType": "similar | collaborated | influenced | same_label"
}
```

### `artist_analytics`
```json
{
  "artistId": "string",
  "dna": {
    "emotionProfile": { "melancholy": 0.4, "euphoric": 0.2, "...": 0 },
    "topThemes": ["heartbreak", "rebellion", "nostalgia"],
    "avgBpm": 118,
    "dominantKey": "C minor",
    "lyricalDensity": 0.73,
    "vocabularyRichness": 0.61
  },
  "essence": "string (1-line generated descriptor, e.g. 'Melancholic storyteller with dark undertones')",
  "discoveryScore": 0.84,
  "topQuotedLyrics": ["string"],
  "listenerJourney": ["songId ordered by recommended listen sequence"],
  "collaborators": ["artistId"],
  "peakPopularityYear": 2019
}
```

### `aggregation_queue`
```json
{
  "artistId": "string",
  "priority": 1,
  "priorityReason": "seed | user_search | trending | manual",
  "status": "pending | running | complete | failed",
  "attempts": 0,
  "lastAttempt": "ISO date",
  "createdAt": "ISO date",
  "errorLog": "string"
}
```

### `source_health`
```json
{
  "source": "musicbrainz | lastfm | lrclib | deezer | coverart | wikidata",
  "lastRequest": "ISO date",
  "requestsToday": 0,
  "successCount": 0,
  "failureCount": 0,
  "lastFailure": "ISO date",
  "isRateLimited": false,
  "cooldownUntil": "ISO date"
}
```

### Additional collections (unchanged)
- `artist_aliases` — `{ alias, artistId }`
- `featured_content` — `{ type: "spotlight|trending|editorial", artistId, expiresAt }`
- `user_discovery` — `{ sessionId, favoriteEmotions, favoriteArtists, favoriteLyrics, favoriteGenres }`
- `search_queries` — `{ query, results, timestamp }`
- `search_index` — tokenized text + weights

---

## Emotion Taxonomy (Fixed Enum)

These 8 emotions are the canonical set used across all features:

| Emotion | Color | Icon |
|---|---|---|
| melancholy | indigo | rainy cloud |
| euphoric | yellow | sun burst |
| angry | red | lightning |
| nostalgic | amber | hourglass |
| romantic | pink | heart |
| defiant | coral | fist |
| hopeful | teal | seedling |
| dark | near-black | moon |

Detection method: keyword scoring on `lyrics.plainText` using a curated
word-emotion weight map. Score stored as `emotionScore` (0–1). Top emotion
tag stored as `lyrics.emotion`.

---

## Backend Components

---

### [MODIFY] `models/artist.py`

Define all Pydantic/Motor models for the collections above with:
- `ArtistModel`, `AlbumModel`, `SongModel`, `LyricsModel`
- `ArtistGraphModel`, `ArtistAnalyticsModel`
- `AggregationQueueModel`, `SourceHealthModel`
- `SearchIndexModel`, `UserDiscoveryModel`

Indexes to create at startup:
- `artists`: `{ name: text, aliases: text }` for search
- `songs`: `{ artistId: 1, popularity: -1 }`
- `lyrics`: `{ artistId: 1, emotion: 1 }`
- `artist_graph`: `{ source: 1 }`, `{ target: 1 }`

---

### [MODIFY] `utils/artist_aggregator.py`

#### Adapter ABC
```python
class ArtistSourceAdapter(ABC):
    @abstractmethod
    async def fetch_artist(self, mbid: str) -> dict: ...
    @abstractmethod
    async def fetch_albums(self, mbid: str) -> list[dict]: ...
    @abstractmethod
    async def fetch_songs(self, album_id: str) -> list[dict]: ...
    @abstractmethod
    async def fetch_lyrics(self, song: dict) -> dict: ...
    async def update_health(self, success: bool): ...
```

#### Concrete Adapters
- `MusicBrainzAdapter` — artist metadata, discography, relationships
  - Respect 1 req/s hard limit. Use `include=recordings+releases+artist-rels`
  - Parse `artist-relation-list` for collaborations → populate `artist_graph`
- `DeezerAdapter` — fan count, genre, 30s preview URL
  - Search by artist name, match by name similarity score
- `LRCLibAdapter` — lyrics fetch per song
  - `GET /api/get?artist_name=...&track_name=...`
  - Prefer synced LRC when available
- `LastFmAdapter` — popularity score, similar artists, tag list
  - `artist.getInfo` + `artist.getSimilar`
- `CoverArtArchiveAdapter` — album cover image
  - `GET https://coverartarchive.org/release-group/{mbid}/front`
- `WikidataAdapter` — bio, nationality via SPARQL
- `EmotionEnrichmentAdapter` — local, no external call
  - Scores lyrics against emotion word map → writes `lyrics.emotion` + `lyrics.emotionScore`
- `DNAEnrichmentAdapter` — local aggregation
  - Reads all lyrics for artist → computes `artist_analytics.dna`

#### AggregationWorker
```python
class AggregationWorker:
    PRIORITY_ORDER = {
        "user_search": 1,  # highest — triggered by live search miss
        "trending":    2,  # Last.fm trending bump
        "seed":        3,  # initial 100+ artist list
        "manual":      4,
    }

    async def run(self):
        while True:
            job = await self.dequeue_next()  # ORDER BY priority ASC, createdAt ASC
            await self.process(job)
            await asyncio.sleep(1.1)  # MusicBrainz rate limit buffer
```

Full pipeline per job:
1. `MusicBrainzAdapter.fetch_artist` → write `artists`
2. `DeezerAdapter` → update `artists.fanCount`, `artists.sources.deezerId`
3. `WikidataAdapter` → update `artists.bio`, `artists.nationality`
4. `MusicBrainzAdapter.fetch_albums` → write `albums` + `artist_graph` edges
5. Per album: `MusicBrainzAdapter.fetch_songs` → write `songs`
6. `CoverArtArchiveAdapter` per album → update `albums.coverUrl`
7. Per song: `DeezerAdapter` → update `songs.previewUrl`
8. Per song: `LRCLibAdapter` → write `lyrics`
9. `EmotionEnrichmentAdapter` → update `lyrics.emotion`
10. `LastFmAdapter.getSimilar` → upsert `artist_graph`
11. `DNAEnrichmentAdapter` → write `artist_analytics`
12. Update `aggregation_queue.status = "complete"`

---

### [MODIFY] `routes/artist_routes.py`

#### Existing routes (updated)
- `GET /api/artists/health` — counts per collection + source health summary
- `GET /api/artists/search?q=&limit=` — scoring: `exact*100 + popularity*20 + fuzzy*15 + recency*10`
  - On cache miss for unknown artist: push to `aggregation_queue` with `priority=user_search`
- `GET /api/artists/search/suggest?q=` — alias-aware autocomplete, top 8 results
- `GET /api/artists/discovery` — curated segments (trending, emotion-based, region-based)
- `GET /api/artists/emotion/<emotion_id>` — artists + lyrics filtered by emotion

#### New routes (required by unique features)
- `GET /api/artists/<id>` — full artist profile (artist + top songs + albums + analytics)
- `GET /api/artists/<id>/songs` — paginated, sortable (`popularity|releaseYear|bpm`)
- `GET /api/artists/<id>/albums` — full discography
- `GET /api/artists/<id>/lyrics/quoted` — top quoted lyrics for this artist
- `GET /api/artists/<id>/graph/neighbors?depth=1` — graph neighbors for Universe Explorer
- `GET /api/artists/<id>/dna` — full DNA object for DNA visualization
- `GET /api/artists/<id>/listen-journey` — ordered `listenerJourney` song list
- `GET /api/lyrics/<song_id>/synced` — LRC synced lyrics for Lyric Cinema
- `GET /api/artists/emotion/<emotion>/quotes` — cross-artist lyric quotes by emotion
- `GET /api/artists/trending` — Last.fm-informed trending list (cached 1hr)
- `POST /api/artists/<id>/lyrics/<lyric_id>/save` — increment `saveCount`

---

## Frontend — `ArtistsPage.tsx`

### Layout Architecture