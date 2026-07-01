# Lyrica - Backend Refactoring & Production Roadmap

> **Project Goal**
>
> Transform Lyrica from a prototype into a scalable, production-ready music streaming platform using **React + Flask + MongoDB** with a **provider abstraction architecture**.

---

# Overall Progress

* [x] UI Design
* [x] Frontend Components
* [x] Initial Flask Backend
* [ ] Production Backend Architecture
* [ ] Provider Abstraction Layer
* [ ] Canonical Data Models
* [ ] MongoDB Cache
* [ ] Real Metadata Integration
* [ ] Real Playback Integration
* [ ] Frontend API Integration

---

# Phase 1 — Project Cleanup (Highest Priority)

## 1. Clean Backend Structure

### Current Problems

* Provider logic mixed inside routes
* Business logic inside controllers
* No service layer
* No provider abstraction
* Difficult to scale

### Tasks

* [ ] Remove provider/API calls from routes
* [ ] Reduce app.py responsibilities
* [ ] Move initialization into dedicated modules
* [ ] Organize backend into production architecture

---

## 2. Create Production Folder Structure

Target structure

```text
backend/

app/

├── api/
├── providers/
├── services/
├── normalizers/
├── cache/
├── repositories/
├── models/
├── schemas/
├── middleware/
├── utils/
├── config/
├── extensions.py
└── __init__.py
```

Tasks

* [ ] Create providers package
* [ ] Create services package
* [ ] Create normalizers package
* [ ] Create repositories package
* [ ] Create cache package
* [ ] Create schemas package

---

# Phase 2 — Database Design

## MongoDB Collections

### User Collections

* [ ] users
* [ ] playlists
* [ ] playlistSongs
* [ ] library
* [ ] likes
* [ ] listeningHistory
* [ ] searchHistory
* [ ] recommendationCache
* [ ] editorialCollections

---

### Cache Collections

* [ ] cachedSongs
* [ ] cachedArtists
* [ ] cachedAlbums
* [ ] cachedLyrics
* [ ] cachedCharts
* [ ] providerMappings

---

### Analytics Collections

* [ ] songStatistics
* [ ] artistStatistics
* [ ] searchAnalytics

---

## Database Tasks

* [ ] Design complete schema
* [ ] Create indexes
* [ ] Design relationships
* [ ] TTL indexes for cached collections
* [ ] User collection validation

---

# Phase 3 — Canonical Models

Create internal models independent of providers.

## Song

* [ ] Canonical Song model

## Artist

* [ ] Canonical Artist model

## Album

* [ ] Canonical Album model

## Playlist

* [ ] Canonical Playlist model

## Lyrics

* [ ] Canonical Lyrics model

## Provider Mapping

* [ ] Canonical Provider Mapping model

---

# Phase 4 — Provider Layer

Each provider should communicate with only one external service.

## Spotify Provider

Responsibilities

* [ ] Search Songs
* [ ] Search Artists
* [ ] Search Albums
* [ ] Artist Metadata
* [ ] Album Metadata
* [ ] Audio Features
* [ ] Related Artists

---

## MusicBrainz Provider

Responsibilities

* [ ] Recording lookup
* [ ] Artist metadata
* [ ] Album metadata
* [ ] Release information

---

## Last.fm Provider

Responsibilities

* [ ] Artist Tags
* [ ] Similar Artists
* [ ] Similar Songs
* [ ] Popularity enrichment

---

## Cover Art Archive

Responsibilities

* [ ] Album Artwork
* [ ] Artist Artwork

---

## LRCLIB Provider

Responsibilities

* [ ] Synced Lyrics
* [ ] Plain Lyrics

---

## YTMusic Provider

Responsibilities

* [ ] Search
* [ ] Playback URL
* [ ] Album lookup
* [ ] Artist lookup

---

## JioSaavn Provider

Responsibilities

* [ ] Search
* [ ] Playback URL
* [ ] Album lookup
* [ ] Artist lookup

---

# Phase 5 — Normalizers

Every provider response should be normalized.

Create

* [ ] Spotify Normalizer
* [ ] MusicBrainz Normalizer
* [ ] LastFM Normalizer
* [ ] YTMusic Normalizer
* [ ] JioSaavn Normalizer
* [ ] LRCLIB Normalizer

Output should always become

```text
Canonical Song

Canonical Artist

Canonical Album

Canonical Lyrics
```

---

# Phase 6 — Service Layer

Create business logic.

## Search Service

Responsibilities

* [ ] Spotify Search
* [ ] MusicBrainz Fallback
* [ ] LastFM enrichment
* [ ] Merge Results
* [ ] Deduplicate
* [ ] Cache

---

## Metadata Service

Responsibilities

* [ ] Song metadata
* [ ] Artist metadata
* [ ] Album metadata

---

## Playback Service

Responsibilities

* [ ] Resolve playback
* [ ] YTMusic first
* [ ] JioSaavn fallback
* [ ] Cache stream URLs

---

## Lyrics Service

Responsibilities

* [ ] LRCLIB lookup
* [ ] Fallback lyrics
* [ ] Cache lyrics

---

## Recommendation Service

Responsibilities

* [ ] Similar Artists
* [ ] Similar Songs
* [ ] Audio Features
* [ ] User Behaviour

---

## Cache Service

Responsibilities

* [ ] Save cache
* [ ] Refresh cache
* [ ] Expire cache
* [ ] Provider mapping

---

# Phase 7 — Metadata Strategy

Priority

```
Spotify

↓

MusicBrainz

↓

Last.fm
```

Collect

* [ ] Song title
* [ ] Artist
* [ ] Album
* [ ] Release date
* [ ] Genres
* [ ] Audio Features
* [ ] Popularity
* [ ] Artist Images
* [ ] Album Images

---

# Phase 8 — Playback Strategy

Priority

```
YTMusic

↓

JioSaavn
```

Tasks

* [ ] Playback Resolver
* [ ] Quality Selection
* [ ] Expiring URL Handling
* [ ] Stream Validation

---

# Phase 9 — Artwork Strategy

Priority

```
Cover Art Archive

↓

Spotify

↓

JioSaavn

↓

YTMusic
```

Tasks

* [ ] Album Artwork
* [ ] Artist Artwork
* [ ] Playlist Artwork

---

# Phase 10 — Lyrics Strategy

Priority

```
LRCLIB

↓

JioSaavn
```

Tasks

* [ ] Synced Lyrics
* [ ] Plain Lyrics
* [ ] Time Stamps

---

# Phase 11 — API Endpoints

## Search

* [ ] /api/search

---

## Home

* [ ] /api/home

---

## Song

* [ ] /api/song/:id

---

## Artist

* [ ] /api/artist/:id

---

## Album

* [ ] /api/album/:id

---

## Playback

* [ ] /api/playback/:id

---

## Lyrics

* [ ] /api/lyrics/:id

---

## Recommendations

* [ ] /api/recommendations

---

# Phase 12 — React Integration

Tasks

* [ ] Remove all hardcoded JSON
* [ ] Connect Home Page
* [ ] Connect Search
* [ ] Connect Artist Page
* [ ] Connect Album Page
* [ ] Connect Player
* [ ] Connect Lyrics
* [ ] Connect Recommendations

---

# Phase 13 — Player

Tasks

* [ ] Queue
* [ ] Shuffle
* [ ] Repeat
* [ ] Seek
* [ ] Volume
* [ ] Continue Listening
* [ ] Recently Played
* [ ] Crossfade (Future)

---

# Phase 14 — Recommendation Engine

Use

* [ ] User History
* [ ] Genres
* [ ] Similar Artists
* [ ] Similar Songs
* [ ] Audio Features
* [ ] Recently Played
* [ ] Favorites

---

# Phase 15 — Performance

Tasks

* [ ] Redis (Future)
* [ ] Mongo Cache
* [ ] Lazy Loading
* [ ] Pagination
* [ ] Background Refresh
* [ ] Image Optimization

---

# Phase 16 — Documentation

Create

* [ ] Architecture.md
* [ ] Database.md
* [ ] API.md
* [ ] Provider Mapping.md
* [ ] Deployment.md
* [ ] Backend README
* [ ] Frontend README

---

# Phase 17 — Production Deployment

* [ ] Docker
* [ ] Nginx
* [ ] MongoDB
* [ ] Environment Variables
* [ ] Logging
* [ ] Monitoring
* [ ] Error Reporting

---

# Architecture Principles

Always follow these rules:

* Routes should never call providers directly.
* Providers should communicate with only one external API.
* Services should contain business logic.
* Every provider response must be normalized.
* React should only consume Flask APIs.
* MongoDB stores user data and normalized cache.
* Never expose provider-specific JSON to the frontend.
* Design around provider abstraction, not provider dependence.
* Every new provider should be pluggable without changing the frontend.
* Build for scalability from the beginning.

---

# Current Priority Order

1. Refactor backend architecture.
2. Design MongoDB schema.
3. Implement provider abstraction.
4. Create canonical models.
5. Build normalization layer.
6. Implement service layer.
7. Add MongoDB cache.
8. Build REST APIs.
9. Replace frontend hardcoded data.
10. Add recommendations and advanced features.

**Goal:** Build Lyrica as a production-grade music platform where metadata, playback, lyrics, and user data are cleanly separated, making the system scalable, maintainable, and easy to extend with new providers in the future.
