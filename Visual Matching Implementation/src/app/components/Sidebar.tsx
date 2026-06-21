import { Page, Playlist, Track } from '../App'

interface SidebarProps {
  currentPage: Page
  onNavigate: (page: Page) => void
  playlists?: Playlist[]
  onCreatePlaylist?: () => void
  allTracks?: Track[]
  isOpen?: boolean
  onClose?: () => void
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
    <path d="M3 9.5L12 3L21 9.5V20C21 20.5523 20.5523 21 20 21H14V14H10V21H4C3.44772 21 3 20.5523 3 20V9.5Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" strokeOpacity={active ? 1 : 0.6} fill={active ? 'var(--primary-tint-12)' : 'none'} />
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
    <path d="M12 21L10.55 19.705C5.375 15.01 2 11.95 2 8.2C2 5.15 4.4 2.75 7.5 2.75C9.25 2.75 10.93 3.57 12 4.86C13.07 3.57 14.75 2.75 16.5 2.75C19.6 2.75 22 5.15 22 8.2C22 11.95 18.625 15.01 13.45 19.71L12 21Z" stroke={active ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinecap="round" strokeOpacity={active ? 1 : 0.4} fill={active ? 'var(--primary-tint-20)' : 'none'} />
  </svg>
)

const SortIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
    <path d="M4 6H20M4 12H15M4 18H10" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeOpacity={0.4} />
  </svg>
)

export function Sidebar({ currentPage, onNavigate, playlists, onCreatePlaylist, allTracks = [], isOpen = false, onClose }: SidebarProps) {
  const navItems = [
    { id: 'home' as Page, label: 'HOME', icon: <HomeIcon active={currentPage === 'home'} /> },
    { id: 'library' as Page, label: 'LIBRARY', icon: <LibraryIcon active={currentPage === 'library'} /> },
    { id: 'artists' as Page, label: 'ARTISTS', icon: <ArtistsIcon active={currentPage === 'artists'} /> },
    { id: 'albums' as Page, label: 'ALBUMS', icon: <AlbumsIcon active={currentPage === 'albums'} /> },
    { id: 'radio' as Page, label: 'RADIO', icon: <RadioIcon active={currentPage === 'radio'} /> },
  ]

  return (
    <>
      {/* Mobile Drawer Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}

      <div
        className={`flex-shrink-0 flex flex-col h-full py-8 transition-all duration-200 z-50 md:z-auto fixed md:static inset-y-0 left-0 bg-[#0B0B0D]/95 md:bg-white/0 border-r border-white/5 ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        } ${
          // Expanded: 260px; Collapsed tablet: 80px
          'w-[260px] md:w-20 lg:w-64 px-4 lg:px-6'
        }`}
        style={{
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo and Mobile Close Button */}
        <div className="flex items-center justify-between mb-10 px-2">
          {/* Logo container */}
          <div className="flex flex-col gap-1.5 md:hidden lg:flex">
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: 'white', letterSpacing: '2px', lineHeight: 1 }}>Lyrica</div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 9, color: 'var(--text-muted)', letterSpacing: '1.5px', textTransform: 'uppercase', opacity: 0.6 }}>sound · memory · words</div>
          </div>
          {/* Compact Logo for collapsed tablet */}
          <div className="hidden md:flex lg:hidden w-full justify-center">
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 36, color: 'var(--primary)' }}>L</span>
          </div>

          {/* Close button for mobile drawer */}
          {onClose && (
            <button
              onClick={onClose}
              className="md:hidden text-stone-400 hover:text-white p-1 rounded-full hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Nav items */}
        <div className="flex flex-col gap-1 flex-1">
          {navItems.map((item, i) => {
            const isActive = currentPage === item.id
            return (
              <button
                key={i}
                onClick={() => {
                  onNavigate(item.id)
                  if (onClose) onClose()
                }}
                className={`flex items-center gap-[18px] py-2.5 rounded-r-[24px] w-full text-left transition-all duration-150 border-l-[3px] focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none justify-start md:justify-center lg:justify-start px-4 md:px-0 lg:px-4 ${
                  isActive
                    ? 'bg-[var(--primary-tint-12)] border-[var(--primary)] text-[var(--primary)]'
                    : 'border-transparent text-white/60 hover:bg-white/5 hover:text-white'
                }`}
                style={{
                  cursor: 'pointer',
                }}
              >
                <span className="flex items-center justify-center w-5 h-5 flex-shrink-0">{item.icon}</span>
                <span
                  className="hidden lg:inline font-sans font-bold text-sm tracking-wide"
                  style={{
                    color: isActive ? 'var(--primary)' : 'inherit',
                  }}
                >
                  {item.label}
                </span>
              </button>
            )
          })}

          {/* Divider + MY MUSIC */}
          <div className="mt-8 pt-8 overflow-y-auto max-h-[calc(100vh-320px)] border-t border-white/5">
            <div className="flex items-center justify-between px-3 mb-4 hidden lg:flex">
              <span className="font-sans font-bold text-[10px] text-white/40 tracking-wider uppercase">MY MUSIC</span>
              <SortIcon />
            </div>

            {/* Create Playlist */}
            <button
              onClick={onCreatePlaylist}
              className="w-full rounded-[24px] py-3 flex items-center justify-center mb-4 hover:bg-white/5 transition-all duration-150 border border-white/10 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{ minHeight: 44 }}
            >
              <span className="hidden lg:inline font-sans font-bold text-xs uppercase tracking-wider">+ Create Playlist</span>
              <span className="inline lg:hidden font-sans font-bold text-lg">+</span>
            </button>

            {/* Daily Mix 1 */}
            <button
              onClick={() => {
                onNavigate('daily-mix')
                if (onClose) onClose()
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left hover:bg-white/5 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none justify-start md:justify-center lg:justify-start ${
                currentPage === 'daily-mix' ? 'bg-white/5' : 'transparent'
              }`}
            >
              <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0 bg-white/5">
                <SparkleIcon active={currentPage === 'daily-mix'} />
              </div>
              <span
                className={`hidden lg:inline font-sans text-xs font-semibold ${
                  currentPage === 'daily-mix' ? 'text-[var(--primary)]' : 'text-white/60'
                }`}
              >
                Daily Mix 1
              </span>
            </button>

            {/* Liked Songs */}
            <button
              onClick={() => {
                onNavigate('liked-songs')
                if (onClose) onClose()
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left mt-3 hover:bg-white/5 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none justify-start md:justify-center lg:justify-start ${
                currentPage === 'liked-songs' ? 'bg-white/5' : 'transparent'
              }`}
            >
              <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0 bg-white/5">
                <HeartIcon active={currentPage === 'liked-songs'} />
              </div>
              <span
                className={`hidden lg:inline font-sans text-xs font-semibold ${
                  currentPage === 'liked-songs' ? 'text-[var(--primary)]' : 'text-white/60'
                }`}
              >
                Liked Songs
              </span>
            </button>

            {/* Dynamic Playlists */}
            {playlists && playlists.map((pl) => {
              const pageId = `playlist:${pl.id}`
              const isPlActive = currentPage === pageId
              let coverArt: string | null = null
              if (pl.songs && pl.songs.length > 0 && allTracks.length > 0) {
                const firstSongId = pl.songs[0]
                const matchedSong = allTracks.find(t => t.id === firstSongId)
                if (matchedSong && matchedSong.cover) {
                  coverArt = matchedSong.cover
                }
              }

              return (
                <button
                  key={pl.id}
                  onClick={() => {
                    onNavigate(pageId)
                    if (onClose) onClose()
                  }}
                  className={`flex items-center gap-3 px-3 py-2 rounded-[24px] w-full text-left mt-3 hover:bg-white/5 transition-all duration-150 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none justify-start md:justify-center lg:justify-start ${
                    isPlActive ? 'bg-white/5' : 'transparent'
                  }`}
                >
                  <div className="flex items-center justify-center rounded-[8px] w-10 h-10 flex-shrink-0 overflow-hidden bg-white/5">
                    {coverArt ? (
                      <img src={coverArt} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <MusicNoteIcon active={isPlActive} />
                    )}
                  </div>
                  <span
                    className={`hidden lg:inline font-sans text-xs font-semibold ${
                      isPlActive ? 'text-[var(--primary)]' : 'text-white/60'
                    }`}
                    style={{
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
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
    </>
  )
}
