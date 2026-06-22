import React, { useEffect, useState, useRef } from 'react'
import { Track } from '../App'

interface NowPlayingPanelProps {
  currentTrack: Track
  isPlaying: boolean
  onTogglePlay: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  isShuffle: boolean
  onToggleShuffle: () => void
  isRepeat: boolean
  onToggleRepeat: () => void
  onNext: () => void
  onPrev: () => void
  lyrics: { time: number | null; line: string }[]
  activeLyricIdx: number
  queue: Track[]
  queueIndex: number
  onPlayTrackFromQueue: (track: Track, customQueue?: Track[]) => void
  onClose: () => void
  onNavigateArtist?: (artistName: string) => void
}

// Fallback deterministic colors
const FALLBACK_COLORS = [
  'rgb(168, 85, 247)',  // Purple
  'rgb(236, 72, 153)',  // Pink
  'rgb(239, 68, 68)',   // Red
  'rgb(249, 115, 22)',  // Orange
  'rgb(59, 130, 246)',  // Blue
  'rgb(6, 182, 212)',   // Cyan
  'rgb(16, 185, 129)',  // Emerald
  'rgb(226, 251, 94)',  // Lyrica Lime
]

function getFallbackColor(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % FALLBACK_COLORS.length
  return FALLBACK_COLORS[index]
}

// Mood tag helper based on track names / metadata
function getMoodTags(track: Track): { genre: string; mood: string; year: string } {
  const title = (track.title || '').toLowerCase()
  const artist = (track.artist || '').toLowerCase()
  
  if (title.includes('gehra') || title.includes('calm') || title.includes('study')) {
    return { genre: 'Ambient', mood: 'Calm', year: '2024' }
  }
  if (title.includes('hip') || title.includes('rap') || artist.includes('seedhe') || artist.includes('raftaar')) {
    return { genre: 'Hindi Rap', mood: 'Aggressive', year: '2021' }
  }
  if (title.includes('lofi') || title.includes('sleep') || title.includes('night')) {
    return { genre: 'Lofi Beats', mood: 'Dreamy', year: '2023' }
  }
  if (title.includes('rock') || title.includes('metal')) {
    return { genre: 'Alternative Rock', mood: 'Energetic', year: '2020' }
  }
  if (title.includes('synth') || title.includes('wave') || title.includes('drive')) {
    return { genre: 'Synthwave', mood: 'Retro-Futuristic', year: '2022' }
  }
  
  // Deterministic fallback based on track ID
  let hash = 0
  for (let i = 0; i < (track.id || '').length; i++) {
    hash = (track.id || '').charCodeAt(i) + ((hash << 5) - hash)
  }
  const genres = ['Indian Indie', 'Indie Pop', 'Electronic', 'Sufi Fusion', 'Ghazal']
  const moods = ['Melancholic', 'Vibrant', 'Nostalgic', 'Immersive', 'Romantic']
  const years = ['2021', '2022', '2023', '2024']
  
  return {
    genre: genres[Math.abs(hash) % genres.length],
    mood: moods[Math.abs(hash + 1) % moods.length],
    year: years[Math.abs(hash + 2) % years.length]
  }
}

export function NowPlayingPanel({
  currentTrack,
  isPlaying,
  onTogglePlay,
  currentTime,
  duration,
  onSeek,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onNext,
  onPrev,
  lyrics,
  activeLyricIdx,
  queue,
  queueIndex,
  onPlayTrackFromQueue,
  onClose,
  onNavigateArtist,
}: NowPlayingPanelProps) {
  const [accentColor, setAccentColor] = useState('rgb(226, 251, 94)') // default Lyrica lime
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  // Color extractor
  useEffect(() => {
    if (!currentTrack.cover) {
      setAccentColor('rgb(226, 251, 94)')
      return
    }

    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = currentTrack.cover

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = 10
        canvas.height = 10
        const ctx = canvas.getContext('2d')
        if (!ctx) throw new Error('No context')
        ctx.drawImage(img, 0, 0, 10, 10)
        const data = ctx.getImageData(0, 0, 10, 10).data

        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4) {
          // Avoid black/dark backgrounds
          if (data[i] + data[i + 1] + data[i + 2] > 60) {
            r += data[i]
            g += data[i + 1]
            b += data[i + 2]
            count++
          }
        }

        if (count > 0) {
          r = Math.floor(r / count)
          g = Math.floor(g / count)
          b = Math.floor(b / count)
          // Boost vibrancy if too dark
          const max = Math.max(r, g, b)
          if (max < 120 && max > 0) {
            r = Math.floor(r * (180 / max))
            g = Math.floor(g * (180 / max))
            b = Math.floor(b * (180 / max))
          }
          setAccentColor(`rgb(${r}, ${g}, ${b})`)
        } else {
          setAccentColor(getFallbackColor(currentTrack.id))
        }
      } catch (e) {
        setAccentColor(getFallbackColor(currentTrack.id))
      }
    }

    img.onerror = () => {
      setAccentColor(getFallbackColor(currentTrack.id))
    }
  }, [currentTrack.cover, currentTrack.id])

  // Handle menu click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const tags = getMoodTags(currentTrack)
  const currentLyricLine = lyrics[activeLyricIdx]?.line || 'Instrumental · Feeling the rhythm...'

  const progressFraction = duration > 0 ? currentTime / duration : 0

  const formatTime = (secs: number) => {
    if (isNaN(secs) || secs === Infinity) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60).toString().padStart(2, '0')
    return `${m}:${s}`
  }

  // Next 3 tracks in queue
  const nextInQueue = queue.slice(queueIndex + 1, queueIndex + 4)

  return (
    <div
      className="flex flex-col h-full overflow-hidden select-none border-l border-white/5 relative"
      style={{
        width: 380,
        background: '#080808',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Dynamic Background ambient glow */}
      <div
        className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[350px] h-[350px] rounded-full blur-[100px] opacity-10 pointer-events-none transition-all duration-1000"
        style={{
          background: accentColor,
        }}
      />

      {/* Embedded styles for animations */}
      <style>{`
        @keyframes subtle-pulse {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.55; }
        }
        .ambient-pulsing-glow {
          animation: subtle-pulse 6s infinite ease-in-out;
        }
        @keyframes waveform-bounce {
          0%, 100% { transform: scaleY(0.3); }
          50% { transform: scaleY(1); }
        }
        .nowplay-wave-bar {
          animation: waveform-bounce 0.7s ease-in-out infinite;
          transform-origin: bottom;
        }
        .nowplay-wave-bar:nth-child(2) { animation-delay: 0.15s; animation-duration: 0.9s; }
        .nowplay-wave-bar:nth-child(3) { animation-delay: 0.3s; animation-duration: 0.6s; }
      `}</style>

      {/* TOP HEADER SECTION */}
      <div className="flex items-center justify-between px-6 pt-7 pb-4 flex-shrink-0 z-10">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/40">
            Listening Now
          </span>
          {/* Animated waveform beside the label */}
          <div className="flex items-end gap-[2px] h-2.5 w-3 mb-[1px]">
            <span
              className="nowplay-wave-bar w-[1px] h-full rounded-full"
              style={{
                backgroundColor: accentColor,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
            <span
              className="nowplay-wave-bar w-[1px] h-full rounded-full"
              style={{
                backgroundColor: accentColor,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
            <span
              className="nowplay-wave-bar w-[1px] h-full rounded-full"
              style={{
                backgroundColor: accentColor,
                animationPlayState: isPlaying ? 'running' : 'paused',
              }}
            />
          </div>
        </div>

        {/* 3-dot dropdown menu */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white/50 hover:text-white hover:bg-white/5 transition-all outline-none"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 13C12.5523 13 13 12.5523 13 12C13 11.4477 12.5523 11 12 11C11.4477 11 11 11.4477 11 12C11 12.5523 11.4477 13 12 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M19 13C19.5523 13 20 12.5523 20 12C20 11.4477 19.5523 11 19 11C18.4477 11 18 11.4477 18 12C18 12.5523 18.4477 13 19 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M5 13C5.55228 13 6 12.5523 6 12C6 11.4477 5.55228 11 5 11C4.44772 11 4 11.4477 4 12C4 12.5523 4.44772 13 5 13Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          
          {menuOpen && (
            <div className="absolute right-0 mt-1 w-44 rounded-xl bg-neutral-900/95 border border-white/10 shadow-2xl backdrop-blur-md p-1 z-50 animate-fade-in">
              <button
                onClick={() => {
                  setMenuOpen(false)
                  onClose()
                }}
                className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-medium"
              >
                Minimize Panel
              </button>
              <button
                onClick={() => {
                  setMenuOpen(false)
                  // Trigger document sharing simulation
                  alert(`Sharing "${currentTrack.title}" by ${currentTrack.artist}`)
                }}
                className="w-full text-left px-3 py-2 text-xs text-white/80 hover:bg-white/5 hover:text-white rounded-lg transition-colors font-medium"
              >
                Share Song
              </button>
            </div>
          )}
        </div>
      </div>

      {/* SCROLLABLE CENTRAL CARD SECTION */}
      <div className="flex-1 overflow-y-auto px-6 pb-6 scrollbar-none flex flex-col gap-6">
        
        {/* ALBUM ART WITH GLOW */}
        <div className="relative w-64 h-64 mx-auto mt-2 flex-shrink-0">
          {/* Ambient Glow layer behind art */}
          <div
            className="absolute inset-0 rounded-[20px] blur-[30px] opacity-35 ambient-pulsing-glow transition-all duration-1000"
            style={{
              background: accentColor,
            }}
          />
          {/* Artwork Card */}
          <div className="relative w-full h-full rounded-[20px] overflow-hidden shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8)] border border-white/10 bg-neutral-950">
            <img
              src={currentTrack.cover}
              alt={currentTrack.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
          </div>
        </div>

        {/* TRACK INFO */}
        <div className="text-center mt-2 px-2 flex-shrink-0">
          <h1
            className="text-2xl text-white tracking-wide line-clamp-2 leading-snug"
            style={{
              fontFamily: 'var(--font-serif)',
              fontStyle: 'italic',
            }}
            dangerouslySetInnerHTML={{ __html: currentTrack.title }}
          />
          <p
            onClick={() => onNavigateArtist && onNavigateArtist(currentTrack.artist)}
            className="text-stone-400 text-sm font-medium mt-1.5 tracking-[0.2px] hover:text-white cursor-pointer transition-colors"
          >
            {currentTrack.artist}
          </p>

          {/* MOOD TAG PILLS */}
          <div className="flex items-center justify-center gap-1.5 mt-4 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.4px] bg-white/5 border border-white/5 text-stone-300">
              {tags.genre}
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.4px] bg-white/5 border border-white/5 text-stone-300">
              {tags.mood}
            </span>
            <span className="px-3 py-1 rounded-full text-[9px] font-bold tracking-[0.4px] bg-white/5 border border-white/5 text-stone-300 font-mono">
              {tags.year}
            </span>
          </div>
        </div>

        {/* SYNCHRONIZED LYRICS PREVIEW */}
        <div className="py-2 px-4 rounded-2xl bg-white/[0.02] border border-white/[0.03] flex items-center justify-center min-h-[72px] flex-shrink-0">
          <p
            className="text-sm text-center italic tracking-wide transition-all duration-500 leading-relaxed"
            style={{
              fontFamily: 'var(--font-serif)',
              color: isPlaying ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.45)',
            }}
          >
            "{currentLyricLine}"
          </p>
        </div>

        {/* PROGRESS SECTION */}
        <div className="flex flex-col gap-2 mt-1 flex-shrink-0">
          {/* Seek Bar */}
          <div
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect()
              const fraction = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
              onSeek(fraction * duration)
            }}
            className="h-[3px] w-full bg-white/10 rounded-full cursor-pointer relative group"
          >
            <div
              className="absolute top-0 bottom-0 left-0 rounded-full transition-all duration-200"
              style={{
                width: `${progressFraction * 100}%`,
                backgroundColor: accentColor,
              }}
            />
            {/* Grabber thumb */}
            <div
              className="absolute w-2 h-2 rounded-full scale-0 group-hover:scale-100 transition-transform -translate-y-1/2 top-1/2"
              style={{
                left: `calc(${progressFraction * 100}% - 4px)`,
                backgroundColor: accentColor,
                boxShadow: `0 0 8px ${accentColor}`,
              }}
            />
          </div>
          {/* Timestamps */}
          <div className="flex justify-between text-[10px] text-stone-500 font-mono font-medium tracking-[0.4px]">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>

        {/* PLAYER CONTROLS */}
        <div className="flex items-center justify-center gap-5 mt-1 flex-shrink-0">
          <button
            onClick={onToggleShuffle}
            className="text-stone-400 hover:text-white transition-colors p-1"
            style={{ color: isShuffle ? accentColor : undefined }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M16 3H21V8M4 20L21 3M21 20L15.5 14.5M10 9L4 3M16 21H21V16" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          
          <button
            onClick={onPrev}
            className="text-stone-300 hover:text-white hover:scale-105 transition-all p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M19 20L9 12L19 4V20Z" fill="currentColor" />
              <path d="M5 19V5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          {/* Floating tactile Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            className="w-12 h-12 rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 outline-none"
            style={{
              backgroundColor: accentColor,
              color: '#080808',
              boxShadow: `0 0 25px -3px rgba(${accentColor.replace('rgb(', '').replace(')', '')}, 0.5)`,
            }}
          >
            {isPlaying ? (
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="2" width="2.5" height="10" rx="1.25" fill="currentColor" />
                <rect x="8.5" y="2" width="2.5" height="10" rx="1.25" fill="currentColor" />
              </svg>
            ) : (
              <svg width="13" height="16" viewBox="0 0 11 14" fill="none" className="ml-[2px]">
                <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="currentColor" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </button>

          <button
            onClick={onNext}
            className="text-stone-300 hover:text-white hover:scale-105 transition-all p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M5 4L15 12L5 20V4Z" fill="currentColor" />
              <path d="M19 5V19" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </button>

          <button
            onClick={onToggleRepeat}
            className="text-stone-400 hover:text-white transition-colors p-1"
            style={{ color: isRepeat ? accentColor : undefined }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M17 17H7C5.89543 17 5 16.1046 5 15V9M7 7H17C18.1046 7 19 7.89543 19 9V15" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M21 13L17 17L13 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M3 11L7 7L11 11" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* QUEUE SECTION */}
        <div className="mt-2 border-t border-white/5 pt-5 flex-shrink-0">
          <div className="flex items-center justify-between mb-3.5">
            <span className="text-[10px] font-bold tracking-[1.5px] uppercase text-white/50">
              Next In Queue ({queue.length})
            </span>
            <button
              onClick={() => alert('Full queue panel view coming soon')}
              className="text-[9px] font-bold tracking-[1px] uppercase hover:underline"
              style={{ color: accentColor }}
            >
              SHOW ALL
            </button>
          </div>

          <div className="flex flex-col gap-2">
            {nextInQueue.length > 0 ? (
              nextInQueue.map((track, idx) => {
                const globalIndex = queueIndex + 1 + idx
                const isActive = globalIndex === queueIndex
                return (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrackFromQueue(track, queue)}
                    className="flex items-center justify-between p-2 rounded-xl bg-white/[0.01] hover:bg-white/[0.04] transition-all duration-200 cursor-pointer group border border-transparent"
                    style={{
                      borderColor: isActive ? `rgba(${accentColor.replace('rgb(', '').replace(')', '')}, 0.2)` : 'transparent',
                      boxShadow: isActive ? `0 0 12px -3px rgba(${accentColor.replace('rgb(', '').replace(')', '')}, 0.15)` : 'none'
                    }}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 relative bg-neutral-900 border border-white/5">
                        <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        {isActive && (
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {/* Bouncing equalizer bar animation */}
                            <div className="flex items-end gap-[1.5px] h-3">
                              <span className="eq-bar animating" />
                              <span className="eq-bar animating" />
                              <span className="eq-bar animating" />
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span
                          className="text-xs font-semibold text-white truncate max-w-[170px]"
                          style={{ color: isActive ? accentColor : undefined }}
                          dangerouslySetInnerHTML={{ __html: track.title }}
                        />
                        <span className="text-[10px] text-stone-400 truncate max-w-[150px] mt-0.5">
                          {track.artist}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center ml-2 flex-shrink-0">
                      <span className="text-[10px] text-stone-500 font-mono font-medium mr-1.5">
                        {track.duration || '3:30'}
                      </span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          alert(`Options for "${track.title}"`)
                        }}
                        className="opacity-0 group-hover:opacity-60 hover:!opacity-100 p-1 text-white transition-opacity"
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <circle cx="12" cy="12" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="5" r="1.5" fill="currentColor" />
                          <circle cx="12" cy="19" r="1.5" fill="currentColor" />
                        </svg>
                      </button>
                    </div>
                  </div>
                )
              })
            ) : (
              <div className="text-center py-4 text-[10px] text-stone-500 uppercase tracking-wider font-semibold">
                Queue is empty
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
