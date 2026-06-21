# Implementation Tasks

## Backend
- [/] Rewrite `routes/music.py` — JioSaavn search, featured tracks, stream URL endpoint
- [ ] Create `routes/lyrics_routes.py` — LRCLIB fetch + LRC parser
- [ ] Register `lyrics_bp` in `app.py`

## Frontend
- [ ] Update `Track` interface in `App.tsx` — add `saavn_id`, keep `videoId` for YT fallback
- [ ] Update `loadInitialData()` in `App.tsx` — fetch JioSaavn featured tracks
- [ ] Update `playTrack()` in `App.tsx` — fetch fresh CDN URL before playing, fetch lyrics
- [ ] Add lyrics state + `requestAnimationFrame` sync loop in `App.tsx`
- [ ] Create `LyricsView.tsx` — karaoke panel component
- [ ] Update `BottomPlayer.tsx` — add lyrics toggle button (MicIcon)
- [ ] Update `HomePage.tsx` — use real JioSaavn album art URLs

## Cleanup
- [ ] Remove static TRACKS list from `music.py`
- [ ] Remove static file/image path references

## Build & Test
- [ ] `npm run build`
- [ ] Test search API (JioSaavn + YT fallback)
- [ ] Test stream URL endpoint
- [ ] Test lyrics endpoint
- [ ] Manual browser test: play song, lyrics sync, search
