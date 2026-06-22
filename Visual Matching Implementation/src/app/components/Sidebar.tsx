import { Page, Playlist, Track } from '../App'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  playlists?: Playlist[]
  onCreatePlaylist?: () => void
  allTracks?: Track[]
}

const MusicNoteIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M9 18V5L21 3V16" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={active ? 1 : 0.6} />
    <circle cx="6" cy="18" r="3" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
    <circle cx="18" cy="16" r="3" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
  </svg>
)

const HomeIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H14V14H10V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={active ? 1 : 0.6} fill={active ? 'rgba(226, 251, 94, 0.1)' : 'none'} />
  </svg>
)

const LibraryIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="2" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
    <path d="M7 8H17M7 12H17M7 16H13" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.6} />
  </svg>
)

const ArtistsIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={active ? 1 : 0.6} />
    <path d="M6 21V19C6 16.7909 9.58172 15 14 15" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.6} />
  </svg>
)

const AlbumsIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="5" y="3" width="14" height="14" rx="1.5" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
    <path d="M3 7V19C3 20.1046 3.89543 21 5 21H17" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.6} />
  </svg>
)

const RadioIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <rect x="2" y="6" width="20" height="15" rx="2" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
    <circle cx="8" cy="13.5" r="3.5" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeOpacity={active ? 1 : 0.6} />
    <path d="M15 11H18M15 14H18M15 17H17M6 2.5L18 2.5" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.6} />
  </svg>
)

const SparkleIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={active ? 1 : 0.4} />
  </svg>
)

const HeartIcon = ({ active }: { active: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21L10.55 19.705C5.375 15.01 2 11.95 2 8.2C2 5.15 4.4 2.75 7.5 2.75C9.25 2.75 10.93 3.57 12 4.86C13.07 3.57 14.75 2.75 16.5 2.75C19.6 2.75 22 5.15 22 8.2C22 11.95 18.625 15.01 13.45 19.71L12 21Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.4} fill={active ? 'rgba(226, 251, 94, 0.15)' : 'none'} />
  </svg>
)

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20M4 12H15M4 18H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.4} />
  </svg>
)


export function Sidebar({ currentPage, onNavigate, playlists, onCreatePlaylist, allTracks = [] }: SidebarProps) {
  const navItems = [
    { id: 'home' as Page, label: 'HOME', icon: <HomeIcon active={currentPage === 'home'} /> },
    { id: 'library' as Page, label: 'LIBRARY', icon: <LibraryIcon active={currentPage === 'library'} /> },
    { id: 'artists' as Page, label: 'ARTISTS', icon: <ArtistsIcon active={currentPage === 'artists'} /> },
    { id: 'albums' as Page, label: 'ALBUMS', icon: <AlbumsIcon active={currentPage === 'albums'} /> },
    { id: 'radio' as Page, label: 'RADIO', icon: <RadioIcon active={currentPage === 'radio'} /> },
  ]

  return (
    <div
      className="flex-shrink-0 flex flex-col h-full px-6 py-8"
      style={{
        width: 260,
        backdropFilter: 'blur(12px)',
        background: 'rgba(22, 22, 26, 0.75)',
        borderRight: '1px solid var(--border)',
      }}
    >
      {/* Logo */}
      <div className="flex flex-col gap-1.5 mb-10 px-2">
        <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: 'white', letterSpacing: '2px', lineHeight: 1 }}>Lyrica</div>
        <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6 }}>sound · memory · words</div>
      </div>

      {/* Nav items */}
      <div className="flex flex-col gap-1 flex-1">
        {navItems.map((item, i) => {
          const isActive = currentPage === item.id
          return (
            <button
              key={i}
              onClick={() => onNavigate(item.id)}
              className="flex items-center gap-[18px] px-4 py-2 rounded-[24px] w-full text-left transition-colors hover:bg-white/5"
              style={{
                background: isActive ? 'rgba(255,255,255,0.05)' : 'transparent',
                cursor: 'pointer',
              }}
            >
              <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">{item.icon}</span>
              <span
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: 14,
                  color: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.6)',
                  letterSpacing: 0,
                }}
              >
                {item.label}
              </span>
            </button>
          )
        })}

        {/* Divider + MY MUSIC */}
        <div className="mt-8 pt-8 overflow-y-auto max-h-[calc(100vh-320px)]" style={{ borderTop: '1px solid var(--border)' }}>
          <div className="flex items-center justify-between px-3 mb-4">
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 10, color: 'var(--text-muted)', letterSpacing: '1px', textTransform: 'uppercase' }}>MY MUSIC</span>
            <SortIcon />
          </div>

          {/* Create Playlist */}
          <button
            onClick={onCreatePlaylist}
            className="w-full rounded-[24px] py-3 flex items-center justify-center mb-4 hover:bg-white/5 transition-colors"
            style={{ border: '1px solid var(--border)' }}
          >
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 11, color: 'var(--text)', letterSpacing: '0.6px', textTransform: 'uppercase' }}>+ Create Playlist</span>
          </button>

          {/* Daily Mix 1 */}
          <button
            onClick={() => onNavigate('daily-mix')}
            className="flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left hover:bg-white/5 transition-colors"
            style={{
              background: currentPage === 'daily-mix' ? 'rgba(255,255,255,0.05)' : 'transparent'
            }}
          >
            <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <SparkleIcon active={currentPage === 'daily-mix'} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: currentPage === 'daily-mix' ? 700 : 500,
                fontSize: 12,
                color: currentPage === 'daily-mix' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              Daily Mix 1
            </span>
          </button>

          {/* Liked Songs */}
          <button
            onClick={() => onNavigate('liked-songs')}
            className="flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left mt-3 hover:bg-white/5 transition-colors"
            style={{
              background: currentPage === 'liked-songs' ? 'rgba(255,255,255,0.05)' : 'transparent'
            }}
          >
            <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <HeartIcon active={currentPage === 'liked-songs'} />
            </div>
            <span
              style={{
                fontFamily: 'var(--font-sans)',
                fontWeight: currentPage === 'liked-songs' ? 700 : 500,
                fontSize: 12,
                color: currentPage === 'liked-songs' ? 'var(--primary)' : 'var(--text-muted)'
              }}
            >
              Liked Songs
            </span>
          </button>

          {/* Dynamic Playlists */}
          {playlists && playlists.map((pl) => {
            const pageId = `playlist:${pl.id}`;
            const isPlActive = currentPage === pageId;
            let coverArt: string | null = pl.cover_url || null;
            if (!coverArt && pl.songs && pl.songs.length > 0 && allTracks.length > 0) {
              const firstSongId = pl.songs[0];
              const matchedSong = allTracks.find(t => t.id === firstSongId);
              if (matchedSong && matchedSong.cover) {
                coverArt = matchedSong.cover;
              }
            }

            return (
              <button
                key={pl.id}
                onClick={() => onNavigate(pageId)}
                className="flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left mt-3 hover:bg-white/5 transition-colors animate-fade-in"
                style={{
                  background: isPlActive ? 'rgba(255,255,255,0.05)' : 'transparent'
                }}
              >
                <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0 overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {coverArt ? (
                    <img src={coverArt} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <MusicNoteIcon active={isPlActive} />
                  )}
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-sans)',
                    fontWeight: isPlActive ? 700 : 500,
                    fontSize: 12,
                    color: isPlActive ? 'var(--primary)' : 'var(--text-muted)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {pl.name}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
