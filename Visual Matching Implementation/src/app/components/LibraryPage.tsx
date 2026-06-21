import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { Track, Playlist } from '../App'
import { artistsList } from './ArtistsPage'

import imgTrack1 from 'figma:asset/14e70c7b032c1011dac6585594e2485187ee4b38.png'
import imgTrack2 from 'figma:asset/746c0f3335f4ce57c6ce8e8b0a80b9e3e46fbcc9.png'

interface LibraryPageProps {
  onNavigate: (page: any, artistId?: string | null, albumId?: string | null) => void
  onPlayTrack: (track: Track, queue?: Track[]) => void
  playlists?: Playlist[]
  likedTrackIds: string[]
  allTracks: Track[]
  followedArtistIds?: string[]
  onCreatePlaylist?: () => void
  user?: any
}

const getGreeting = () => {
  const hr = new Date().getHours();
  if (hr < 12) return 'Good Morning';
  if (hr < 17) return 'Good Afternoon';
  return 'Good Evening';
};

// Count-up animation hook
function useCountUp(target: number, duration = 600) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref as any, { once: true });

  useEffect(() => {
    if (!inView) return;
    if (target === 0) { setValue(0); return; }
    const steps = 28;
    const increment = target / steps;
    const intervalMs = duration / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setValue(target);
        clearInterval(timer);
      } else {
        setValue(Math.floor(current));
      }
    }, intervalMs);
    return () => clearInterval(timer);
  }, [inView, target, duration]);

  return { value, ref };
}

// Icons
const PlaylistIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2" />
    <line x1="8" y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

const HeartIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const ArtistIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

function StatSegment({
  label,
  count,
  icon,
  onClick,
  accent = false,
}: {
  label: string;
  count: number;
  icon: React.ReactNode;
  onClick: () => void;
  accent?: boolean;
}) {
  const { value, ref } = useCountUp(count);
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-3 flex-1 py-3 px-5 hover:bg-white/5 transition-all rounded-xl cursor-pointer group min-w-0"
    >
      <span className="opacity-40 group-hover:opacity-70 transition-opacity flex-shrink-0 text-white">
        {icon}
      </span>
      <div className="flex flex-col items-start min-w-0">
        <span
          ref={ref as any}
          style={{
            fontFamily: 'var(--font-mono)',
            fontWeight: 700,
            fontSize: 22,
            color: accent ? 'var(--primary)' : 'var(--text)',
            lineHeight: 1,
          }}
        >
          {value}
        </span>
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontWeight: 600,
            fontSize: 9,
            color: 'var(--text-muted)',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.9px',
            marginTop: 2,
          }}
        >
          {label}
        </span>
      </div>
    </button>
  );
}

export function LibraryPage({
  onNavigate,
  onPlayTrack,
  playlists = [],
  likedTrackIds = [],
  allTracks = [],
  followedArtistIds = [],
  onCreatePlaylist = () => {},
  user
}: LibraryPageProps) {
  const username = user?.username || user?.name || 'Listener';
  const greeting = getGreeting();

  // Build playlist display list
  const displayPlaylists = [
    { title: 'Liked Songs', count: `${likedTrackIds.length} songs`, img: imgTrack2, page: 'liked-songs' },
    ...playlists.map(pl => {
      const firstSongId = pl.songs?.[0];
      const firstTrack = allTracks.find(t => t.id === firstSongId);
      return {
        title: pl.name,
        count: `${pl.songs?.length || 0} songs`,
        img: firstTrack?.cover || imgTrack1,
        page: `playlist:${pl.id}`
      };
    })
  ];

  // Resolve followed artists from DB relationship IDs — no fuzzy-matching
  const followedArtists = followedArtistIds
    .map(id => artistsList.find(a => a.id === id))
    .filter((a): a is typeof artistsList[number] => !!a);

  // E3 — Suggested For You: top tracks sourced from followed artists' popularTracks field
  // No new API endpoint. JioSaavn recommendation endpoint was NOT verified, not used.
  const suggestedTracks: Track[] = [];
  const seenIds = new Set<string>();
  for (const artist of followedArtists) {
    for (const t of artist.popularTracks) {
      if (!seenIds.has(t.id)) {
        seenIds.add(t.id);
        suggestedTracks.push(t);
      }
    }
  }
  const suggestedDisplay = suggestedTracks.slice(0, 10);

  const isSoloPlaylist = displayPlaylists.length === 1;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 overflow-y-auto px-8 mt-4"
      style={{ minHeight: 0, paddingBottom: 120 }}
    >
      {/* Greeting + heading — compact spacing */}
      <div className="flex flex-col gap-0.5 mb-4">
        <span
          className="uppercase tracking-wider font-semibold"
          style={{ fontFamily: 'var(--font-sans)', fontSize: 10, color: 'var(--primary)' }}
        >
          {greeting}, {username}
        </span>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 26, color: 'var(--text)' }}>
          Your Library
        </h1>
      </div>

      {/* Part B — Compact stat strip */}
      {/* ⚠ FLAGGED: "Artists Following" onClick navigates to 'artists' page as fallback.
          A dedicated 'followed-artists' route does NOT exist in App.tsx router.
          To wire it properly, add `case 'followed-artists':` to App.tsx switch first. */}
      <div
        className="flex items-stretch mb-7 rounded-[12px] overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', height: 64 }}
      >
        <StatSegment
          label="Playlists"
          count={displayPlaylists.length}
          icon={<PlaylistIcon />}
          onClick={() => onNavigate('library')}
        />
        <div style={{ width: 1, background: 'var(--border)' }} />
        <StatSegment
          label="Liked Tracks"
          count={likedTrackIds.length}
          icon={<HeartIcon />}
          onClick={() => onNavigate('liked-songs')}
          accent
        />
        <div style={{ width: 1, background: 'var(--border)' }} />
        <StatSegment
          label="Artists Following"
          count={followedArtists.length}
          icon={<ArtistIcon />}
          onClick={() => onNavigate('artists')}
        />
      </div>

      {/* Part C — Recent Playlists */}
      <div className="mb-7">
        <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 19, color: 'var(--text)' }}>
          Recent Playlists
        </h2>
        {/* Part C3: flex-start (not grid fill), large tile when only 1 real playlist */}
        <div className="flex gap-4 flex-wrap items-start">
          {displayPlaylists.map((playlist, i) => (
            <button
              key={i}
              onClick={() => onNavigate(playlist.page)}
              className="group flex flex-col items-start p-3 rounded-[12px] transition-all text-left hover:scale-[1.02] cursor-pointer flex-shrink-0"
              style={{
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                width: isSoloPlaylist ? 200 : 152,
              }}
            >
              <div className="w-full aspect-square rounded-[8px] overflow-hidden mb-3 relative border border-white/5">
                <img
                  src={playlist.img}
                  alt={playlist.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary">
                    <svg width="9" height="11" viewBox="0 0 11 14" fill="none">
                      <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>
              </div>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 12, color: 'var(--text)' }}>
                {playlist.title}
              </span>
              <span className="mt-0.5" style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10, color: 'var(--text-muted)' }}>
                {playlist.count}
              </span>
            </button>
          ))}

          {/* Part C2: Exactly one ghost tile, always present */}
          <button
            onClick={onCreatePlaylist}
            className="group flex flex-col items-center justify-center p-3 rounded-[12px] border-2 border-dashed border-white/10 hover:border-primary/40 hover:bg-white/5 transition-all text-center flex-shrink-0 cursor-pointer hover:scale-[1.02]"
            style={{ width: 152, aspectRatio: '1 / 1.3' }}
          >
            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center mb-2 group-hover:border-primary/30 group-hover:bg-primary/5 transition-all">
              <span className="text-lg text-white/40 group-hover:text-primary transition-colors font-light leading-none">+</span>
            </div>
            <span
              style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--text-muted)' }}
              className="group-hover:text-white transition-colors"
            >
              Create Playlist
            </span>
          </button>
        </div>
      </div>

      {/* E1 — Artists You Follow: hidden entirely when zero */}
      {followedArtists.length > 0 && (
        <div className="mb-7">
          <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 19, color: 'var(--text)' }}>
            Artists You Follow
          </h2>
          <div className="flex gap-5 flex-wrap">
            {followedArtists.map((artist) => (
              <button
                key={artist.id}
                onClick={() => onNavigate('artists', artist.id)}
                className="group flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <div
                  className="rounded-full overflow-hidden border-2 border-transparent group-hover:border-primary transition-all group-hover:scale-105"
                  style={{ width: 56, height: 56 }}
                >
                  <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
                </div>
                <span
                  className="text-center line-clamp-1 max-w-[72px]"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 10, color: 'var(--text-muted)' }}
                >
                  {artist.name.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* E3 — Suggested For You: horizontal scrollable strip, hidden when empty */}
      {suggestedDisplay.length > 0 && (
        <div className="mb-7">
          <h2 className="mb-4" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 19, color: 'var(--text)' }}>
            Suggested For You
          </h2>
          <div
            className="flex gap-4 overflow-x-auto pb-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
          >
            {suggestedDisplay.map((track) => (
              <button
                key={track.id}
                onClick={() => onPlayTrack(track, suggestedDisplay)}
                className="group flex-shrink-0 flex flex-col items-start cursor-pointer hover:scale-[1.02] transition-all"
                style={{ width: 128 }}
              >
                <div className="w-full aspect-square rounded-[8px] overflow-hidden mb-2 relative border border-white/5">
                  <img
                    src={track.cover}
                    alt={track.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary">
                      <svg width="7" height="9" viewBox="0 0 11 14" fill="none">
                        <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    </div>
                  </div>
                </div>
                <span
                  className="truncate w-full"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--text)' }}
                >
                  {track.title}
                </span>
                <span
                  className="truncate w-full mt-0.5"
                  style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 10, color: 'var(--text-muted)' }}
                >
                  {track.artist}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* E2 — Recently Played: ⚠ FLAGGED — not wired.
          Data exists in App.tsx (localStorage-based `recentlyPlayed` state) but is NOT
          passed as a prop to LibraryPage. To complete E2:
          1. Add `recentlyPlayed?: Track[]` to LibraryPageProps
          2. Pass `recentlyPlayed={recentlyPlayed}` from App.tsx case 'library'
          3. Render a horizontal strip identically to E3 above
          Backend persistence is localStorage-only — no server-side play history collection exists.
          This is fine for a client session but means history resets on logout/new device. */}
    </motion.div>
  );
}
