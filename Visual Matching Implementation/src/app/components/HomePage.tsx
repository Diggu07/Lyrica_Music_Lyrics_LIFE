import { useState, useEffect, useRef } from 'react'
import { Track } from '../App'
import imgHeroBanner from 'figma:asset/2127cd02c303f92e451186421fc741ebbe9956cc.png'
import imgNowPlaying from 'figma:asset/4ee233c9fd9f345420928c5ccf8cba2ae01305c9.png'

const artistCovers: Record<string, string> = {
  'Sabrina Carpenter': 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300',
  'Arijit Singh': 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
  'The Weeknd': 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300',
  'NewJeans': 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300',
  'Karan Aujla': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300'
};

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13.8333 15L8.58333 9.75C8.16667 10.0833 7.6875 10.3472 7.14583 10.5417C6.60417 10.7361 6.02778 10.8333 5.41667 10.8333C3.90278 10.8333 2.62153 10.309 1.57292 9.26042C0.524305 8.21181 0 6.93056 0 5.41667C0 3.90278 0.524305 2.62153 1.57292 1.57292C2.62153 0.524305 3.90278 0 5.41667 0C6.93056 0 8.21181 0.524305 9.26042 1.57292C10.309 2.62153 10.8333 3.90278 10.8333 5.41667C10.8333 6.02778 10.7361 6.60417 10.5417 7.14583C10.3472 7.6875 10.0833 8.16667 9.75 8.58333L15 13.8333L13.8333 15V15M5.41667 9.16667C6.45833 9.16667 7.34375 8.80208 8.07292 8.07292C8.80208 7.34375 9.16667 6.45833 9.16667 5.41667C9.16667 4.375 8.80208 3.48958 8.07292 2.76042C7.34375 2.03125 6.45833 1.66667 5.41667 1.66667C4.375 1.66667 3.48958 2.03125 2.76042 2.76042C2.03125 3.48958 1.66667 4.375 1.66667 5.41667C1.66667 6.45833 2.03125 7.34375 2.76042 8.07292C3.48958 8.80208 4.375 9.16667 5.41667 9.16667V9.16667" fill="#78716c" />
  </svg>
)

const HeartOutlineIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#78716c" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#C6FF33" />
  </svg>
)

const DotsIcon = () => (
  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
    <path d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4ZM8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4ZM14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4Z" fill="#78716c" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="17" viewBox="0 0 14 17" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0V17M8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20V20" fill="white" fillOpacity={0.5} />
  </svg>
)

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16.75 16.6667" fill="none">
    <path d="M6.08333 16.6667L5.75 14C5.56944 13.9306 5.39931 13.8472 5.23958 13.75C5.07986 13.6528 4.92361 13.5486 4.77083 13.4375L2.29167 14.4792L0 10.5208L2.14583 8.89583C2.13194 8.79861 2.125 8.70486 2.125 8.61458C2.125 8.52431 2.125 8.43056 2.125 8.33333C2.125 8.23611 2.125 8.14236 2.125 8.05208C2.125 7.96181 2.13194 7.86806 2.14583 7.77083L0 6.14583L2.29167 2.1875L4.77083 3.22917C4.92361 3.11806 5.08333 3.01389 5.25 2.91667C5.41667 2.81944 5.58333 2.73611 5.75 2.66667L6.08333 0H10.6667L11 2.66667C11.1806 2.73611 11.3507 2.81944 11.5104 2.91667C11.6701 3.01389 11.8264 3.11806 11.9792 3.22917L14.4583 2.1875L16.75 6.14583L14.6042 7.77083C14.6181 7.86806 14.625 7.96181 14.625 8.05208V8.33333V8.61458V8.89583L16.7292 10.5208L14.4375 14.4792L11.9792 13.4375C11.8264 13.5486 11.6667 13.6528 11.5 13.75C11.3333 13.8472 11.1667 13.9306 11 14L10.6667 16.6667H6.08333V16.6667" fill="white" fillOpacity={0.5} />
  </svg>
)

const TicketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
    <path d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 100 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 100-4V7a2 2 0 012-2z" fill="none" stroke="white" />
  </svg>
)

const PlayIcon = () => (
  <svg width="11" height="14" viewBox="0 0 11 14" fill="none">
    <path d="M0 14V0L11 7L0 14V14" fill="black" />
  </svg>
)

const PlayIconGreen = () => (
  <svg width="16" height="20" viewBox="0 0 11 14" fill="none">
    <path d="M0 14V0L11 7L0 14V14" fill="#000" />
  </svg>
)

interface HomePageProps {
  onPlayTrack: (track: Track, queue?: Track[]) => void
  currentTrack: Track
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
  likedTrackIds: string[]
  onToggleLike: (trackId: string) => void
  allTracks: Track[]
  queue: Track[]
  queueIndex: number
  recentlyPlayed?: Track[]
}

export function HomePage({
  onPlayTrack,
  currentTrack,
  onNavigate,
  likedTrackIds,
  onToggleLike,
  allTracks = [],
  queue = [],
  queueIndex = 0,
  recentlyPlayed = [],
}: HomePageProps) {
  interface ChartHeader {
    type: string
    language: string | null
    title: string
    description: string
    ratio: '16:9' | '4:5'
    cover: string
    trackCount: number
  }

  const [charts, setCharts] = useState<ChartHeader[]>([])
  const [loadingCharts, setLoadingCharts] = useState(true)

  const getArtistId = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('arijit')) return 'arijit-singh';
    if (lower.includes('sabrina')) return 'sabrina-carpenter';
    if (lower.includes('weeknd')) return 'the-weeknd';
    if (lower.includes('newjeans')) return 'newjeans';
    if (lower.includes('karan')) return 'karan-aujla';
    if (lower.includes('billie')) return 'billie-eilish';
    if (lower.includes('kendrick')) return 'kendrick-lamar';
    if (lower.includes('aespa')) return 'aespa';
    return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const getAlbumIdForTrack = (track: Track) => {
    const albumName = (track.album || '').toLowerCase();
    if (albumName.includes('short')) return '1';
    if (albumName.includes('starboy')) return '2';
    if (albumName.includes('jawan')) return 'jawan-ost';
    if (albumName.includes('sweet')) return '5';
    if (albumName.includes('making') || albumName.includes('memories') || albumName.includes('bad newz') || albumName.includes('softly')) return '6';
    return track.album ? track.album.toLowerCase().replace(/[^a-z0-9]+/g, '-') : '1';
  }

  const topArtistsList = ['Sabrina Carpenter', 'Arijit Singh', 'The Weeknd', 'NewJeans', 'Karan Aujla']

  useEffect(() => {
    setLoadingCharts(true)
    fetch('/api/music/charts?overview=true')
      .then(res => res.json())
      .then(data => {
        if (data.charts) {
          setCharts(data.charts)
        }
        setLoadingCharts(false)
      })
      .catch(err => {
        console.error('Failed to fetch charts overview:', err)
        setLoadingCharts(false)
      })
  }, [])

  // Use the first dynamic track from combined feed as the Featured Release
  const featuredTrack = allTracks[0] || {
    id: 'featured-none',
    title: 'Discover New Music',
    artist: 'Lyrica Studio',
    cover: imgHeroBanner,
    album: 'Trending Releases',
    duration: '4:00'
  }

  // Get upcoming tracks from the real queue
  const nextInQueue = queue.slice(queueIndex + 1, queueIndex + 4)

  // Only display Recently Played if the user has actually played songs
  const displayRecentlyPlayed = recentlyPlayed || []

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'var(--background)' }}>
      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-8 pb-8">
          {/* Dynamic Featured Trending Hits Grid (Replacing Hero Banner) */}
          <div className="mb-12 mt-6">
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
                Trending Releases
              </span>
            </div>
            <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
              {allTracks.slice(0, 4).map((track, idx) => {
                const trendingQueue = allTracks.slice(0, 4);
                return (
                  <div
                    key={`trending_hero_${track.id}`}
                    onClick={() => onPlayTrack(track, trendingQueue)}
                    className="group flex flex-col items-start p-4 rounded-[16px] border transition-all text-left w-full hover:scale-[1.02] cursor-pointer"
                    style={{ background: 'var(--surface-2)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-full aspect-square rounded-[12px] overflow-hidden mb-4 relative">
                      <img src={track.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-black shadow-lg">
                          <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                            <path d="M0 14V0L11 7L0 14V14" fill="var(--background)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'white', display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                      dangerouslySetInnerHTML={{ __html: track.title }}
                    />
                    <span className="mt-1" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.artist}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recently Played */}
          {displayRecentlyPlayed.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
                  Recently Played
                </span>
              </div>
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {displayRecentlyPlayed.slice(0, 4).map((track) => (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrack(track, displayRecentlyPlayed)}
                    className="group flex flex-col items-start p-4 rounded-[16px] border border-white/5 transition-all text-left w-full hover:scale-[1.02] cursor-pointer"
                    style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
                  >
                    <div className="w-full aspect-square rounded-[12px] overflow-hidden mb-4 relative">
                      <img src={track.cover} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-black">
                          <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                            <path d="M0 14V0L11 7L0 14V14" fill="var(--background)" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 13, color: 'white', display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.title}
                    </span>
                    <span className="mt-1" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', display: 'block', width: '100%', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {track.artist}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dynamic Popular Artists */}
          {topArtistsList.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
                  Popular Artists
                </span>
                <button onClick={() => onNavigate('artists', null)}>
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>See All</span>
                </button>
              </div>
              <div className="grid grid-cols-5 gap-8">
                {topArtistsList.map((artist, idx) => {
                  return (
                    <div
                      key={artist}
                      onClick={() => onNavigate('artists', getArtistId(artist))}
                      className="flex flex-col items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className="rounded-full overflow-hidden group-hover:scale-105 transition-transform flex items-center justify-center"
                        style={{
                          width: 80,
                          height: 80,
                          background: 'var(--surface-2)',
                          border: '1px solid var(--border)',
                          boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
                        }}
                      >
                        <img
                          src={artistCovers[artist] || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300'}
                          alt={artist}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--text)', textAlign: 'center' }}>
                        {artist}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Billboard Trending Charts */}
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
                Billboard Top Charts
              </span>
            </div>

            {loadingCharts ? (
              <div className="py-12 flex justify-center text-primary font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
                Loading Billboard Charts...
              </div>
            ) : (
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))' }}>
                {charts.filter(c => c.ratio === '16:9').map((chart) => (
                  <div
                    key={`${chart.type}-${chart.language || ''}`}
                    onClick={() => onNavigate(`chart:${chart.type}:${chart.language || ''}`)}
                    className="group relative w-full rounded-[20px] overflow-hidden border border-white/5 cursor-pointer hover:scale-[1.02] transition-all duration-300"
                    style={{ aspectRatio: '16/9' }}
                  >
                    {/* Cover Image Background */}
                    <img
                      src={chart.cover}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                    />

                    {/* Dark overlay scrim to guarantee 100% legibility */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.5) 50%, rgba(11, 11, 13, 0.95) 100%)'
                      }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-6 z-10 pointer-events-none">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1 block"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        Global / Regional Chart
                      </span>
                      <h3
                        className="text-xl font-normal text-white leading-tight"
                        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                      >
                        {chart.title}
                      </h3>
                      <p
                        className="text-[11px] mt-1 line-clamp-1"
                        style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
                      >
                        {chart.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-white/10"
                          style={{ color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)' }}
                        >
                          {chart.trackCount} Tracks
                        </span>
                      </div>
                    </div>

                    {/* Floating Play Button */}
                    <div
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const params = new URLSearchParams();
                          params.append('type', chart.type);
                          if (chart.language) {
                            params.append('language', chart.language);
                          }
                          const res = await fetch(`/api/music/charts?${params.toString()}`);
                          if (res.ok) {
                            const data = await res.json();
                            const tracks = data.tracks || [];
                            if (tracks.length > 0) {
                              onPlayTrack(tracks[0], tracks);
                            }
                          }
                        } catch (err) {
                          console.error('Failed to play chart:', err);
                        }
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 cursor-pointer"
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-black shadow-lg hover:scale-105 transition-transform duration-200">
                        <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                          <path d="M0 14V0L11 7L0 14V14" fill="black" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Regional & Language Charts */}
          {!loadingCharts && charts.filter(c => c.ratio === '4:5').length > 0 && (
            <div className="mb-12">
              <div className="flex items-center justify-between mb-6">
                <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
                  Regional & Language Charts
                </span>
              </div>
              <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))' }}>
                {charts.filter(c => c.ratio === '4:5').map((chart) => (
                  <div
                    key={`${chart.type}-${chart.language || ''}`}
                    onClick={() => onNavigate(`chart:${chart.type}:${chart.language || ''}`)}
                    className="group relative w-full rounded-[20px] overflow-hidden border border-white/5 cursor-pointer hover:scale-[1.02] transition-all duration-300"
                    style={{ aspectRatio: '4/5' }}
                  >
                    {/* Cover Image Background */}
                    <img
                      src={chart.cover}
                      alt=""
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-750"
                    />

                    {/* Dark overlay scrim to guarantee 100% legibility */}
                    <div
                      className="absolute inset-0 z-0"
                      style={{
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.2) 0%, rgba(0, 0, 0, 0.6) 50%, rgba(11, 11, 13, 0.98) 100%)'
                      }}
                    />

                    {/* Content */}
                    <div className="absolute inset-0 flex flex-col justify-end p-5 z-10 pointer-events-none">
                      <span
                        className="text-[9px] font-bold uppercase tracking-widest text-primary mb-1 block"
                        style={{ fontFamily: 'var(--font-sans)' }}
                      >
                        Language Chart
                      </span>
                      <h3
                        className="text-lg font-normal text-white leading-tight"
                        style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
                      >
                        {chart.title}
                      </h3>
                      <p
                        className="text-[10px] mt-1 line-clamp-1"
                        style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
                      >
                        {chart.description}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className="text-[9px] font-mono font-semibold px-2 py-0.5 rounded border border-white/10"
                          style={{ color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.02)' }}
                        >
                          {chart.trackCount} Tracks
                        </span>
                      </div>
                    </div>

                    {/* Floating Play Button */}
                    <div
                      onClick={async (e) => {
                        e.stopPropagation();
                        try {
                          const params = new URLSearchParams();
                          params.append('type', chart.type);
                          if (chart.language) {
                            params.append('language', chart.language);
                          }
                          const res = await fetch(`/api/music/charts?${params.toString()}`);
                          if (res.ok) {
                            const data = await res.json();
                            const tracks = data.tracks || [];
                            if (tracks.length > 0) {
                              onPlayTrack(tracks[0], tracks);
                            }
                          }
                        } catch (err) {
                          console.error('Failed to play chart:', err);
                        }
                      }}
                      className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-full flex items-center justify-center bg-primary text-black shadow-lg hover:scale-105 transition-transform duration-200">
                        <svg width="9" height="10" viewBox="0 0 11 14" fill="none">
                          <path d="M0 14V0L11 7L0 14V14" fill="black" />
                        </svg>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
