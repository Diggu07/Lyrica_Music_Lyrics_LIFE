You are improving the existing Lyrica HomePage, NOT rebuilding it.

Keep the existing architecture, styling system, typography, colors, components, and code quality wherever possible.

The current page already has:

- Editorial Hero
- Global Charts
- Regional Charts
- Mood Collections
- Recently Played
- Trending Artists
- Fresh Releases
- Genres
- For You
- Editors Picks
- Trending Playlists
- Live Events
- Music Videos
- Lyrics Spotlight
- Continue Exploring

The page is visually good but still feels too static, repetitive, and desktop space isn't being utilized efficiently.

I want the homepage to feel like a premium editorial magazine rather than a dashboard.

=========================================================
GENERAL GOALS
=========================================================

Increase information density by approximately 25%.

Reduce repetitive layouts.

Reduce unnecessary whitespace.

Increase discovery.

Make every scroll reveal something visually different.

The homepage should feel alive.

Do NOT clutter.

Do NOT increase complexity for the user.

Everything should remain elegant.

=========================================================
1. HERO IMPROVEMENTS
=========================================================

Keep the existing Hero.

Improve it by adding:

• animated waveform
• live popularity rank
• total streams
• weekly growth
• monthly listeners
• listening countries
• friends listening
• subtle background animation
• animated glow behind artwork
• rotating gradient
• artist avatars
• richer metadata

Replace

Release Date

with

#2 Worldwide

18.6M Plays

+12% this week

instead.

The right-side statistics panel should feel like Spotify Wrapped.

Hero companions should contain

Artist

Album

Playlist

instead of only tracks.

=========================================================
2. HOMEPAGE ORDER
=========================================================

Rearrange the homepage.

Recommended order:

Hero

Continue Listening

Global Charts

Regional Charts

For You

Trending Artists

Fresh Releases

Mood Collections

Genres

Editorial Picks

Trending Playlists

Explore

Move

Lyrics

Videos

Events

towards the bottom.

These should not interrupt discovery.

=========================================================
3. REDUCE REPETITION
=========================================================

Currently almost every section is

Horizontal Carousel

↓

Horizontal Carousel

↓

Horizontal Carousel

↓

Horizontal Carousel

This feels repetitive.

Mix layouts.

Examples:

carousel

grid

magazine

masonry

featured card

split layout

staggered layout

Pinterest-style blocks

Alternating layouts create a premium experience.

=========================================================
4. CARD VARIETY
=========================================================

Do NOT make every card identical.

Introduce

Large landscape cards

Square cards

Portrait cards

Feature cards

Mini cards

Magazine cards

Editorial cards

Mixed height cards

Different border radii

Some sections should contain

2 large cards

6 small cards

instead of

8 identical cards.

=========================================================
5. BETTER CHARTS
=========================================================

Global Charts should contain more chart types.

Examples

Worldwide Top 50

Global Pulse

Pop Now

Hip Hop Radar

Rock Circuit

Dance Signal

Electronic

Country

Latin

Afrobeats

K-Pop

J-Pop

Trending Albums

New Releases

Most Saved

Fastest Rising

Regional Charts should include

India

Hindi

Punjabi

Tamil

Telugu

Malayalam

Kannada

Marathi

Gujarati

Bengali

USA

UK

Japan

Korea

France

Germany

Brazil

Canada

Australia

Mexico

Add

Updated Today

Weekly movement

Followers

Track count

Play button

=========================================================
6. CONTINUE LISTENING
=========================================================

Move Recently Played near the Hero.

Rename to

Continue Listening

Show

Progress

Remaining duration

Resume button

Last played

Listening percentage

=========================================================
7. TRENDING ARTISTS
=========================================================

Improve artist cards.

Show

Monthly listeners

Followers

Trending rank

Top 3 songs

Follow button

Hover animation

Verified badge

=========================================================
8. FRESH RELEASES
=========================================================

Use one large featured release

followed by

smaller releases.

Not all identical.

=========================================================
9. GENRES
=========================================================

Genre pills should update recommendations instantly.

Animate transitions.

Show

Top artist

Top playlist

Top album

when selected.

=========================================================
10. FOR YOU
=========================================================

Make this section feel smarter.

Examples

Because you liked...

Recently obsessed

Hidden gems

Continue artist journey

Rediscover

Deep cuts

=========================================================
11. EDITORIAL PICKS
=========================================================

Magazine style.

Large photography.

Beautiful typography.

Not identical cards.

=========================================================
12. PLAYLISTS
=========================================================

Use beautiful covers.

Different layouts.

Editorial feeling.

Not simple square artwork.

=========================================================
13. IMAGES
=========================================================

Current implementation relies heavily on Unsplash.

Replace generic photography wherever possible with

album art

artist photography

concerts

vinyl textures

abstract music artwork

cinematic gradients

Only use Unsplash as placeholder.

Everything should feel music-centric.

=========================================================
14. TYPOGRAPHY
=========================================================

Currently almost every heading uses Instrument Serif.

Reduce repetition.

Use

Hero

Large Serif

Section Titles

Medium Serif

Cards

Sans

Metadata

Small Sans

Statistics

Monospace / condensed

Increase hierarchy.

=========================================================
15. ANIMATIONS
=========================================================

Add

fade-in

stagger

hover glow

parallax

album zoom

waveform animation

cursor lighting

micro interactions

Do NOT over animate.

Everything should feel smooth.

=========================================================
16. HOMEPAGE PERSONALIZATION
=========================================================

The homepage should adapt.

Examples

Good Evening, <User>

Continue where you left off

Your Top Genre

Your Mood Today

Based on Yesterday

Trending near you

Recently Loved

=========================================================
17. REMOVE HARDCODED CONTENT
=========================================================

Do NOT hardcode

statistics

artists

playlists

streams

followers

metadata

All should come from services or mock API structures.

Only placeholder images are acceptable.

=========================================================
18. COMPONENT ARCHITECTURE
=========================================================

The current HomePage.tsx is becoming very large.

Split into reusable components.

HeroSection

ContinueListening

ChartsCarousel

RegionalCharts

MoodCollections

TrendingArtists

FreshReleases

Genres

EditorialPicks

Playlists

ExploreGrid

Each section should have its own file.

Move business logic into hooks/services.

=========================================================
19. PERFORMANCE
=========================================================

Lazy load sections below the fold.

Virtualize large lists.

Memoize expensive computations.

Prevent unnecessary rerenders.

=========================================================
20. FINAL RESULT
=========================================================

The final homepage should feel comparable to

Spotify

Apple Music

Tidal

Arc Browser

Pinterest Editorial

Luxury fashion websites

High information density.

Minimal clutter.

Premium typography.

Editorial storytelling.

Excellent discovery.

Smooth scrolling.

No repetitive layouts.

No large empty spaces.

Maintain Lyrica's luxury aesthetic while making the homepage feel alive, intelligent, dynamic, and production-ready.

# 21. REAL DATA, AUTHENTIC CONTENT & NO PLACEHOLDERS (MANDATORY)

This is the highest priority requirement.

The homepage MUST NOT use hardcoded artists, songs, albums, statistics, playlist names, covers, or repeated placeholder content.

The current implementation reuses the same songs, album covers, and artists across multiple sections. This breaks immersion and makes the application feel like a prototype instead of a production music platform.

Everything displayed on the homepage should be dynamically fetched from APIs, the backend aggregation service, or the local database.

---

## REAL ALBUM ARTWORK

Replace every placeholder, Unsplash image, and generic photography with real album artwork.

Album covers should come from the music metadata pipeline.

Preferred sources:

* Cover Art Archive
* MusicBrainz
* Spotify metadata
* Apple Music metadata
* Deezer metadata
* Last.fm artwork
* Local cached artwork

Artwork should always match the actual song or album being displayed.

Do not reuse the same artwork for unrelated songs.

Fallback only when absolutely necessary.

---

## REAL ARTIST IMAGES

Artist profile pictures must be authentic.

Use artist images retrieved from:

* MusicBrainz
* Last.fm
* Spotify metadata
* Deezer
* Wikipedia/Wikidata (where licensing permits)

Never use random portrait photography.

Every artist card must display the correct artist image.

---

## AUTHENTIC SONGS

Every section must contain real songs.

Do not generate fake titles.

Do not duplicate the same tracks throughout the homepage.

Examples:

Trending Charts

→ real chart songs

Recently Played

→ actual user listening history

For You

→ recommendation engine output

Mood Collections

→ curated playlists

Fresh Releases

→ latest releases

Trending Artists

→ artists related to current charts

Everything should represent genuine music metadata.

---

## UNIQUE CHART DATA

Every chart must contain its own independent dataset.

Examples:

Worldwide Top 50

→ Global trending songs

India Top 50

→ Songs currently trending in India

Hindi Top 50

→ Hindi songs only

Punjabi Top 50

→ Punjabi songs only

Tamil Top 50

→ Tamil songs only

Telugu Top 50

→ Telugu songs only

Malayalam Top 50

→ Malayalam songs only

K-Pop Top 50

→ Korean artists only

J-Pop Top 50

→ Japanese artists only

Rock Charts

→ Rock songs only

Hip-Hop Charts

→ Hip-Hop only

Electronic

→ Electronic only

Jazz

→ Jazz only

Classical

→ Classical only

Country

→ Country only

Lo-fi

→ Lo-fi only

Phonk

→ Phonk only

No chart should reuse another chart's dataset.

Each chart should have completely different songs, artists, artwork, and rankings.

---

## REGIONAL AUTHENTICITY

Regional charts must represent the actual language and region.

Examples:

Hindi chart

→ Hindi artists only

Punjabi chart

→ Punjabi artists only

Tamil chart

→ Tamil artists only

Korea

→ Korean artists

Japan

→ Japanese artists

Brazil

→ Brazilian artists

France

→ French artists

Do not mix languages across regional charts.

---

## LIVE CHARTS

Charts should display dynamic metadata such as:

* Current ranking
* Weekly movement
* Previous rank
* Track count
* Updated time
* Popularity score
* Trend direction
* Plays
* Saves
* Likes

Display labels like:

Updated 12 minutes ago

Updated Today

This Week

instead of static placeholder text.

---

## AUTHENTIC PLAYLISTS

Mood collections should not contain fake playlists.

Generate them dynamically using real tracks.

Examples:

Late Night

Rainy Evening

Road Trip

Workout

Study

Focus

Coffee House

Heartbreak

Each playlist should contain songs that genuinely match the mood.

---

## RECOMMENDATION ENGINE

The "For You" section should never reuse chart songs unless they are genuinely relevant.

Recommendations should be based on:

* Listening history
* Likes
* Recently played
* Favorite artists
* Favorite genres
* Time of day
* Mood
* Discovery score
* Similar artists

Examples:

Because you listened to...

Continue Artist Journey

Rediscover

Hidden Gems

Albums You May Like

Deep Cuts

Recently Obsessed

---

## IMAGE QUALITY

Every artwork should be:

High resolution

Consistent aspect ratio

Properly cached

Dominant color extracted

Used for dynamic UI theming

No blurry placeholders.

No stretched artwork.

No duplicated images.

---

## NO REPEATED CONTENT

The homepage should avoid showing the same album, artist, or song multiple times unless there is a meaningful reason.

Example:

If "Birds of a Feather" appears in Global Charts, it should not also appear in Fresh Releases, Trending Playlists, Editors' Picks, Continue Exploring, and For You simultaneously.

Ensure content diversity across sections.

---

## DATA ARCHITECTURE

The frontend should never contain hardcoded arrays for:

artists

albums

songs

playlists

covers

statistics

followers

monthly listeners

charts

Everything should be fetched from backend services or the aggregation layer.

The homepage should act as a renderer of live data rather than a container of static content.

---

## OVERALL GOAL

The homepage should feel like opening Spotify, Apple Music, YouTube Music, or TIDAL on a real account.

Every chart, artist, playlist, recommendation, album cover, and image should be authentic, relevant, unique, and dynamically generated instead of being repeated placeholder content.
