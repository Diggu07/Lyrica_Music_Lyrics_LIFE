import { useState, useEffect } from 'react'
import { Track } from '../App'
import { PlaylistPopover } from './PlaylistPopover'

interface ChartDetailPageProps {
  chartType: string
  language: string
  onPlayTrack: (track: Track, queue?: Track[]) => void
  currentTrack: Track
  likedTrackIds: string[]
  onToggleLike: (trackId: string) => void
  onNavigate: (targetPage: string, artistId?: string | null, albumId?: string | null) => void
}

const PlayIcon = () => (
  <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
    <path d="M0 14V0L11 7L0 14V14" fill="currentColor" />
  </svg>
)

const PauseIcon = () => (
  <svg width="10" height="12" viewBox="0 0 10 14" fill="none">
    <path d="M0 14H3V0H0V14ZM7 0V14H10V0H7Z" fill="currentColor" />
  </svg>
)

const HeartOutlineIcon = () => (
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#8E8A82" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="15" viewBox="0 0 16 15" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="var(--primary)" />
  </svg>
)

export function ChartDetailPage({
  chartType,
  language,
  onPlayTrack,
  currentTrack,
  likedTrackIds,
  onToggleLike,
  onNavigate
}: ChartDetailPageProps) {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadChartData() {
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.append('type', chartType)
        if (language) {
          params.append('language', language)
        }
        const res = await fetch(`/api/music/charts?${params.toString()}`)
        if (res.ok) {
          const data = await res.json()
          setTracks(data.tracks || [])
        } else {
          setError('Failed to load chart data')
        }
      } catch (err) {
        console.error(err)
        setError('Error loading chart data')
      } finally {
        setLoading(false)
      }
    }
    loadChartData()
  }, [chartType, language])

  const getChartTitle = () => {
    const count = tracks.length || 50
    if (chartType === 'worldwide') return `Worldwide Hot ${count}`
    if (chartType === 'asia') return 'Asia Top Hits'
    if (chartType === 'india') return `India Superhits Top ${count}`
    if (chartType === 'language') {
      return `${language.charAt(0).toUpperCase() + language.slice(1)} Top ${count}`
    }
    return 'Top Chart'
  }

  const getChartDescription = () => {
    if (chartType === 'worldwide') {
      return 'The most played songs globally, aggregated daily via Apple Music RSS feeds.'
    }
    if (chartType === 'asia') {
      return 'Popular trends aggregated from multiple Asian storefronts including India, Japan, and Korea.'
    }
    return 'Editorial playlist curated and updated live from JioSaavn.'
  }

  const playableTracks = tracks

  const handlePlayAll = () => {
    if (playableTracks.length > 0) {
      onPlayTrack(playableTracks[0], playableTracks)
    }
  }

  const handleShufflePlay = () => {
    if (playableTracks.length > 0) {
      const shuffled = [...playableTracks].sort(() => Math.random() - 0.5)
      onPlayTrack(shuffled[0], shuffled)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('home')}
        className="flex items-center gap-2 mb-6 group transition-colors text-xs font-bold uppercase tracking-wider text-stone-500 hover:text-white"
        style={{ fontFamily: 'var(--font-sans)' }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-translate-x-1 transition-transform">
          <line x1="19" y1="12" x2="5" y2="12"></line>
          <polyline points="12 19 5 12 12 5"></polyline>
        </svg>
        Back to Dashboard
      </button>

      {loading ? (
        <div className="py-24 flex justify-center text-primary font-bold text-sm tracking-wider uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          Loading Chart Tracks...
        </div>
      ) : error ? (
        <div className="py-24 text-center text-red-400 font-bold text-sm uppercase" style={{ fontFamily: 'var(--font-sans)' }}>
          {error}
        </div>
      ) : (
        <>
          {/* Header Banner */}
          <div
            className="rounded-[24px] p-8 mb-8 flex gap-8 items-end relative overflow-hidden"
            style={{
              background: 'var(--surface)',
              border: '1px solid var(--border)',
            }}
          >
            {/* Background Blur Scrim */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none filter blur-xl scale-110"
              style={{
                backgroundImage: `url(${tracks[0]?.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />

            {/* Cover image */}
            <div
              className="w-40 h-40 rounded-[20px] overflow-hidden flex-shrink-0 shadow-2xl relative border"
              style={{ borderColor: 'var(--border)' }}
            >
              <img
                src={tracks[0]?.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300'}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 z-10">
              <div
                className="text-[10px] font-bold uppercase tracking-wider text-primary mb-2"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Lyrica Charts
              </div>
              <h1
                className="text-4xl md:text-5xl font-normal leading-none mb-3 text-white"
                style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
              >
                {getChartTitle()}
              </h1>
              <p
                className="text-sm font-medium mb-6 leading-relaxed max-w-xl"
                style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
              >
                {getChartDescription()}
              </p>

              {/* Action Buttons */}
              <div className="flex items-center gap-4">
                <button
                  onClick={handlePlayAll}
                  disabled={playableTracks.length === 0}
                  className="px-6 py-2.5 rounded-full flex items-center gap-2 bg-primary hover:bg-primary-hover text-background font-bold text-xs uppercase tracking-wider transition-all duration-300 disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-sans)', color: 'var(--background)' }}
                >
                  <PlayIcon />
                  Play All
                </button>

                <button
                  onClick={handleShufflePlay}
                  disabled={playableTracks.length === 0}
                  className="px-6 py-2.5 rounded-full flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white font-bold text-xs uppercase tracking-wider border transition-all duration-300 disabled:opacity-40"
                  style={{ fontFamily: 'var(--font-sans)', borderColor: 'var(--border)' }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <polyline points="21 16 21 21 16 21"></polyline>
                    <line x1="15" y1="15" x2="21" y2="21"></line>
                    <line x1="4" y1="4" x2="9" y2="9"></line>
                  </svg>
                  Shuffle
                </button>

                <span
                  className="text-xs font-semibold px-3 py-1 rounded-md border"
                  style={{
                    fontFamily: 'var(--font-mono)',
                    borderColor: 'var(--border)',
                    background: 'rgba(255, 255, 255, 0.03)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {tracks.length} Songs
                </span>
              </div>
            </div>
          </div>

          {/* Song Table */}
          <div
            className="rounded-[20px] p-6 overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--border)' }}>
                  <th className="pb-4 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', width: '60px' }}>Rank</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Title</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Album</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', width: '100px' }}>Duration</th>
                  <th className="pb-4 text-xs font-bold uppercase tracking-wider text-right" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)', width: '80px' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {tracks.map((track, index) => {
                  const isPlayable = true
                  const isCurrent = currentTrack && currentTrack.id === track.id
                  const isLiked = likedTrackIds.includes(track.id)

                  return (
                    <tr
                      key={track.id}
                      className={`border-b transition-colors group relative hover:bg-white/[0.02]`}
                      style={{ borderColor: 'var(--border)' }}
                    >
                      {/* Rank */}
                      <td className="py-4 font-mono text-sm font-medium" style={{ color: isCurrent ? 'var(--primary)' : 'var(--text-muted)' }}>
                        {String(index + 1).padStart(2, '0')}
                      </td>

                      {/* Title & Artist */}
                      <td className="py-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-[8px] overflow-hidden flex-shrink-0 bg-neutral-900 border border-white/5">
                            <img src={track.cover} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0">
                            <div
                              className={`text-sm font-semibold truncate ${isCurrent ? 'text-primary' : 'text-white'}`}
                              style={{ fontFamily: 'var(--font-sans)' }}
                              dangerouslySetInnerHTML={{ __html: track.title }}
                            />
                            <div
                              className="text-xs truncate mt-0.5"
                              style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
                            >
                              {track.artist}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Album */}
                      <td className="py-4 text-sm font-medium" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                        {track.album || 'Single'}
                      </td>

                      {/* Duration */}
                      <td className="py-4 font-mono text-sm" style={{ color: 'var(--text-muted)' }}>
                        {track.duration && track.duration !== '0:00' ? track.duration : '—'}
                      </td>

                      {/* Action */}
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {isPlayable ? (
                            <>
                              <div className="opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                <PlaylistPopover track={track} />
                              </div>
                              <button
                                onClick={() => onPlayTrack(track, playableTracks)}
                                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                                  isCurrent ? 'bg-primary text-black scale-105' : 'bg-white/5 text-white hover:bg-white/10 group-hover:scale-105'
                                }`}
                              >
                                {isCurrent ? <PauseIcon /> : <PlayIcon />}
                              </button>
                            </>
                          ) : (
                            <div 
                              className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border border-white/10 text-stone-500 cursor-not-allowed select-none"
                              style={{ fontFamily: 'var(--font-sans)' }}
                              title="Not available for streaming"
                            >
                              Unavailable
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
