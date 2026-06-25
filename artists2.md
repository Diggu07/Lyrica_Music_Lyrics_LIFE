Seed Script (startup)

└─> AggregationWorker picks from aggregation_queue

└─> MusicBrainzAdapter → artist + albums + songs

└─> DeezerAdapter → fan count, genre, preview URL

└─> LRCLibAdapter → lyrics per song

└─> LastFmAdapter → popularity, similar artists, tags

└─> CoverArtAdapter → album images

└─> WikidataAdapter → bio, nationality, active years

└─> Enrichment pipeline → DNA, emotion, essence scores

└─> MongoDB write (all collections)

<ArtistsPage>
  ├── <HeroSection>              ← Editorial spotlight + search
  ├── <SearchDropdown>           ← Autosuggest inline
  ├── <LyricalPulseBar>          ← NEW: live emotion heatmap strip
  ├── <MostQuotedLyrics>         ← Masonry grid
  ├── <TrendingArtists>          ← Horizontal scroll cards
  ├── <PopularInIndia>           ← Bento grid
  ├── <EmotionExplorer>          ← Chip filter → sub-layouts
  ├── <ArtistEssenceCards>       ← DNA summary cards
  └── <MusicUniverseExplorer>    ← Interactive graph visualizer
````

Unique & Modern Features (Differentiators)
These features do not exist in Spotify, Apple Music, or any public music web app.

They are Lyrica-native.

1. Lyrical Pulse Bar
A real-time horizontal heatmap strip at the top of the page showing the

current emotion distribution across all artists in the database.

8 colored segments, width proportional to emotion frequency
Updates on page load from a lightweight /api/artists/pulse endpoint
On hover: shows top 3 artists for that emotion + a quoted lyric
On click: scrolls to Emotion Explorer filtered to that emotion

Implementation: GET /api/artists/pulse returns { emotion: count } dict.

Frontend renders as a CSS flex strip with width: {pct}% per segment.

2. Artist DNA Cards
Each artist card in Essence Cards view shows a mini radar/bar visualization:

5 axes: Emotion Intensity, Lyrical Density, Vocabulary Richness, BPM Range, Theme Darkness
Values sourced from artist_analytics.dna
Rendered as an inline SVG pentagon/radar — no chart library needed
Clicking a DNA card opens a full DNA deep-dive modal

This is the "identity fingerprint" of the artist — visually unique per artist.

3. Lyric Cinema Mode
Full-screen immersive lyric reader, triggered from any song card.

Dark overlay, large centered type
If lyrics.hasSynced = true: auto-scrolls line by line (driven by Howler.js

timer using songs.previewUrl 30s Deezer clip)
If no synced lyrics: fades lines sequentially at estimated reading pace
Current line scales up slightly; past lines fade; future lines are dim
Bottom strip shows song emotion tag + 1-tap save/share

Implementation: GET /api/lyrics/<song_id>/synced → parse LRC timestamps →

sequence transitions in a useEffect interval.

4. Music Universe Explorer
Progressive SVG/HTML5 graph — the signature feature of the Artists Page.
Levels expand on click:
Artist node
  └─> Albums (ring around artist)
        └─> Songs (ring around album)
              └─> Lyric snippet (tooltip)
              └─> Emotion tag (color-coded node)
  └─> Similar Artists (connected nodes via artist_graph)
Technical approach:

D3.js force-directed layout
Nodes sized by popularity
Edge thickness by artist_graph.score
Color-coded by primary emotion from artist_analytics.dna.emotionProfile
"Explode" animation on node click expanding children
Sidebar panel showing node details on hover

Data: GET /api/artists/<id>/graph/neighbors?depth=1 per expansion.

Lazily loads neighbors — never fetches the full graph at once.

5. Sound Neighbors (Recommendations)
Not collaborative filtering — purely graph-topology-based.
Algorithm:
neighbors = artist_graph where source=artistId, ORDER BY score DESC LIMIT 10
For each neighbor: fetch top 1 quoted lyric
Display as: [Artist card] + [Connecting reason] + [Shared lyric mood]
UI: Horizontal scroll strip with connection reason pill

(e.g. "Both melancholy · shared label · similar BPM")

6. Emotion Journey
Instead of a static genre filter, users can build a "listening mood path":

Select a start emotion chip (e.g. Nostalgic)
Page generates a sequenced list of 10 songs across artists that transition

through related emotions (Nostalgic → Melancholy → Hopeful)
Each song shows a 10s lyric preview
Route: GET /api/artists/emotion-journey?start=nostalgic

Server logic: BFS through emotion adjacency graph (pre-defined emotion

transition weights) → pick 2 songs per emotion node from top-scored artists.
Emotion adjacency:
pythonEMOTION_TRANSITIONS = {
    "euphoric":   ["hopeful", "romantic"],
    "hopeful":    ["nostalgic", "romantic"],
    "nostalgic":  ["melancholy", "hopeful"],
    "melancholy": ["dark", "nostalgic"],
    "dark":       ["angry", "melancholy"],
    "angry":      ["defiant", "dark"],
    "defiant":    ["euphoric", "angry"],
    "romantic":   ["euphoric", "nostalgic"],
}

7. Lyric Quote Wall (Most Quoted)
Masonry grid of the most-saved lyric cards across all artists.

Card shows: quote, artist, song, emotion tag, save count
Cards sized by saveCount (more saves = larger card)
"Save" heart increments lyrics.saveCount via POST /api/artists/.../save
Real-time sort: top saved floats up on page refresh
Filter by emotion chip above the grid


Development Sprints (Revised)
Sprint 0: API Layer Foundation (new — do this before everything)

Implement all 7 adapters with rate limiting and health tracking
Implement AggregationWorker with priority queue logic
Write and run seed script for 100+ artists → queue all for aggregation
Verify: health endpoint shows all artists with aggregationStatus: complete
Do NOT build any frontend until this passes

Sprint 1: Core Collections & Search

Finalize all MongoDB models with indexes
Implement search pipeline + alias-aware suggest
Implement /api/artists/<id> full profile route
Implement artist_graph population from MB relations + LastFm similar

Sprint 2: Lyric & Analytics Layer

Implement LRC lyrics fetch + storage
Implement EmotionEnrichmentAdapter with taxonomy
Implement DNAEnrichmentAdapter
Implement /api/lyrics/<id>/synced and /api/artists/<id>/dna
Implement Lyrical Pulse endpoint

Sprint 3: Core UI (ArtistsPage.tsx)

Build Hero + Search + SuggestDropdown
Build Lyrical Pulse Bar
Build Most Quoted Masonry (Quote Wall)
Build Trending + Popular In India bento grids
Build Emotion Explorer chips + sub-layout

Sprint 4: Signature Features

Build Artist DNA Cards with inline SVG radar
Build Lyric Cinema Mode (synced + fallback)
Build Sound Neighbors strip
Build Emotion Journey generator UI + API

Sprint 5: Music Universe Explorer

Integrate D3.js force graph
Implement lazy neighbor loading
Album → Song → Lyric node expansion
Sidebar detail panel
Performance: limit visible nodes to 50, virtualize beyond that


Verification Plan
Data completeness checks (run after Sprint 0)
pythonassert artists.count({ aggregationStatus: "complete" }) >= 100
assert albums.count() >= 800
assert songs.count() >= 8000
assert lyrics.count() >= 6000
assert lyrics.count({ hasSynced: true }) >= 2000
assert artist_graph.count() >= 1400
assert artist_analytics.count() >= 100
API smoke tests
GET /api/artists/health → all counts above threshold
GET /api/artists/search?q=taylor → score > 100, first result is Taylor Swift
GET /api/artists/taylor-swift/graph/neighbors?depth=1 → min 5 nodes
GET /api/lyrics/<known-song-id>/synced → LRC string with timestamps
GET /api/artists/pulse → 8 emotion keys with positive counts
Frontend checks

npm run build passes with 0 type errors
Lyric Cinema opens and auto-scrolls on synced song
Universe Explorer renders and expands on node click
DNA radar renders without overflow on mobile viewport


Seed Artists (100+)
Global Pop & Rock (25)
Taylor Swift, Ed Sheeran, The Weeknd, Billie Eilish, Ariana Grande,

Harry Styles, Olivia Rodrigo, Dua Lipa, Post Malone, Drake,

Kendrick Lamar, Eminem, Coldplay, Imagine Dragons, Arctic Monkeys,

Radiohead, The Beatles, Queen, Pink Floyd, David Bowie,

Bruno Mars, Lady Gaga, Beyoncé, Rihanna, Justin Bieber
Indian (Hindi/Bollywood & Indie) (25)
Arijit Singh, Shreya Ghoshal, Sonu Nigam, Udit Narayan, Lata Mangeshkar,

Kishore Kumar, Mohammed Rafi, A.R. Rahman, Vishal-Shekhar, Pritam,

Shankar-Ehsaan-Loy, Diljit Dosanjh, Badshah, Honey Singh, Divine,

Nucleya, Prateek Kuhad, Aastha Gill, Jubin Nautiyal, B Praak,

Darshan Raval, Neha Kakkar, Guru Randhawa, Raftaar, Jasleen Royal
K-Pop (20)
BTS, BLACKPINK, EXO, TWICE, Red Velvet, Stray Kids, MONSTA X,

NCT 127, IU, G-Dragon, BIGBANG, 2NE1, SHINee, GOT7, ITZY,

aespa, NewJeans, LE SSERAFIM, (G)I-DLE, Seventeen
Hip-Hop & R&B (20)
Jay-Z, Nas, J. Cole, Travis Scott, Cardi B, Nicki Minaj,

21 Savage, Lil Baby, Gunna, Future, SZA, H.E.R., Frank Ocean,

The Weeknd, Metro Boomin, Jack Harlow, Lil Uzi Vert, Juice WRLD,

XXXTentacion, Pop Smoke
Alternative & Indie (10)
Tame Impala, Mac DeMarco, Bon Iver, Phoebe Bridgers, Fleet Foxes,

Vampire Weekend, LCD Soundsystem, Beach House, Sufjan Stevens, Mitski

Open Items (resolve before Sprint 3)
#ItemOwnerDeadline1Confirm Deezer preview URL licensing for playbackLegal/productBefore S32Decide session-based vs auth-based for user_discoveryProductBefore S33Finalize emotion word-weight map for EnrichmentAdapterBackendBefore S24Define featured_content.type enum valuesFrontendBefore S35Mobile breakpoint spec for Masonry gridFrontendBefore S36D3.js version pin + performance budget for Universe ExplorerFrontendBefore S5

---

Here's a visual of the 7 unique features and where they live in the page:
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.25s;
    animation-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
  }
VvisualizeVvisualize show_widgetKey decisions baked into the plan worth calling out:
Sprint 0 is non-negotiable. Don't touch the frontend until the aggregation pipeline is verified complete for all 100+ artists. Building UI against incomplete data causes cascading layout bugs that are painful to unpick.
Deezer is your playback layer. Spotify's API removed preview URLs in 2024. Deezer still serves 30s previews freely — this is what powers Lyric Cinema's audio sync.
D3.js for the Universe Explorer is the right call but also the riskiest Sprint 5 scope item. If it runs long, ship the Explorer as a separate lazy-loaded route (/artists/universe) rather than blocking the main page release.
The 5 truly novel features — Lyrical Pulse Bar, DNA Cards, Lyric Cinema, Emotion Journey, and Sound Neighbors — none of these exist on any major music platform. That's your moat. Prioritize those four over polish elsewhere if you hit time pressure.