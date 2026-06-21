import { useEffect, useRef, useState } from 'react'
import { Track } from '../App'

const ShuffleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M16 3H21V8M4 20L21 3M21 20L15.5 14.5M10 9L4 3M16 21H21V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const PrevIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M19 20L9 12L19 4V20Z" fill="currentColor" />
    <path d="M5 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const NextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M5 4L15 12L5 20V4Z" fill="currentColor" />
    <path d="M19 5V19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const RepeatIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M17 17H7C5.89543 17 5 16.1046 5 15V9M7 7H17C18.1046 7 19 7.89543 19 9V15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M21 13L17 17L13 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11L7 7L11 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const HeartOutlineIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21L10.55 19.705C5.375 15.01 2 11.95 2 8.2C2 5.15 4.4 2.75 7.5 2.75C9.25 2.75 10.93 3.57 12 4.86C13.07 3.57 14.75 2.75 16.5 2.75C19.6 2.75 22 5.15 22 8.2C22 11.95 18.625 15.01 13.45 19.71L12 21Z" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M12 21L10.55 19.705C5.375 15.01 2 11.95 2 8.2C2 5.15 4.4 2.75 7.5 2.75C9.25 2.75 10.93 3.57 12 4.86C13.07 3.57 14.75 2.75 16.5 2.75C19.6 2.75 22 5.15 22 8.2C22 11.95 18.625 15.01 13.45 19.71L12 21Z" fill="var(--primary)" stroke="var(--primary)" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const QueueIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M8 6H21M8 12H21M8 18H16M3 6H4M3 12H4M3 18H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
)

const VolumeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M11 5L6 9H2V15H6L11 19V5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M15.54 8.46C16.4774 9.39766 17.004 10.6692 17.004 12C17.004 13.3308 16.4774 14.6023 15.54 15.54" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

const MicIcon = ({ active }: { active?: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path d="M4 7H20" stroke={active ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 12H15" stroke={active ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="1.8" strokeLinecap="round" />
    <path d="M4 17H18" stroke={active ? 'var(--primary)' : 'var(--text-muted)'} strokeWidth="1.8" strokeLinecap="round" />
  </svg>
)

interface BottomPlayerProps {
  currentTrack: Track
  isPlaying: boolean
  onTogglePlay: () => void
  isLiked: boolean
  onToggleLike: () => void
  currentTime: number
  duration: number
  onSeek: (time: number) => void
  volume: number
  onVolumeChange: (vol: number) => void
  isShuffle: boolean
  onToggleShuffle: () => void
  isRepeat: boolean
  onToggleRepeat: () => void
  onNext: () => void
  onPrev: () => void
  showLyrics: boolean
  onToggleLyrics: () => void
  hasLyrics: boolean
}

const formatTime = (secs: number) => {
  if (isNaN(secs) || secs === Infinity) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

// Waveform bar heights (32 bars total)
const WAVEFORM_HEIGHTS = [
  30, 45, 60, 25, 40, 75, 50, 60,
  35, 20, 45, 80, 55, 70, 40, 25,
  50, 90, 65, 30, 45, 60, 25, 40,
  75, 50, 60, 35, 20, 45, 60, 30
]

export function BottomPlayer({
  currentTrack,
  isPlaying,
  onTogglePlay,
  isLiked,
  onToggleLike,
  currentTime,
  duration,
  onSeek,
  volume,
  onVolumeChange,
  isShuffle,
  onToggleShuffle,
  isRepeat,
  onToggleRepeat,
  onNext,
  onPrev,
  showLyrics,
  onToggleLyrics,
  hasLyrics,
}: BottomPlayerProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const scrubberRef = useRef<HTMLDivElement>(null);
  const volumeRef = useRef<HTMLDivElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hoverTime, setHoverTime] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number>(0);
  const [isDraggingProgress, setIsDraggingProgress] = useState(false);
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [currentTrack.title]);

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const seekFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!scrubberRef.current || duration <= 0) return;
    const rect = scrubberRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction * duration);
  };

  const handleProgressPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingProgress(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    seekFromPointer(e);
  };

  const handleProgressPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingProgress) {
      seekFromPointer(e);
    }
    // Update hover preview coordinates
    if (scrubberRef.current && duration > 0) {
      const rect = scrubberRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, x / rect.width));
      setHoverTime(fraction * duration);
      setHoverX(x);
    }
  };

  const handleProgressPointerUp = () => {
    setIsDraggingProgress(false);
  };

  const volumeFromPointer = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!volumeRef.current) return;
    const rect = volumeRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const vol = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange(vol);
  };

  const handleVolumePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    volumeFromPointer(e);
  };

  const handleVolumePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isDraggingVolume) {
      volumeFromPointer(e);
    }
  };

  const handleVolumePointerUp = () => {
    setIsDraggingVolume(false);
  };

  return (
    <>
      {/* Mobile Collapsed Player (Bottom floating bar) - visible only below 768px (md) */}
      <div 
        onClick={() => setIsMobileExpanded(true)}
        className="md:hidden fixed bottom-4 left-4 right-4 z-40 flex items-center justify-between px-4 py-2 cursor-pointer transition-all hover:scale-[1.01]"
        style={{
          height: 64,
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: 'var(--glass-border)',
          borderRadius: 16,
          boxShadow: '0 12px 24px rgba(0, 0, 0, 0.5)',
        }}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-white/10">
            <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="font-sans font-bold text-xs text-white truncate">{currentTrack.title}</span>
            <span className="font-sans text-[10px] text-stone-400 truncate">{currentTrack.artist}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Heart Like Action */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onToggleLike()
            }}
            className="flex items-center justify-center text-stone-300 hover:text-white"
            style={{ width: 44, height: 44 }}
          >
            {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
          </button>
          
          {/* Play/Pause Action */}
          <button
            onClick={(e) => {
              e.stopPropagation()
              onTogglePlay()
            }}
            className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 bg-[var(--primary)] text-black focus:outline-none play-btn ${isPlaying ? 'playing' : ''}`}
          >
            {isPlaying ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <rect x="3" y="2" width="2.5" height="10" rx="1.25" fill="black" />
                <rect x="8.5" y="2" width="2.5" height="10" rx="1.25" fill="black" />
              </svg>
            ) : (
              <svg width="10" height="12" viewBox="0 0 11 14" fill="none" className="ml-[1px]">
                <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="black" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Expanded Drawer - Full Screen overlay on tap */}
      {isMobileExpanded && (
        <div
          className="md:hidden fixed inset-0 z-50 flex flex-col p-6 animate-fade-in"
          style={{
            background: '#0B0B0D',
          }}
        >
          {/* Blurred Background Art */}
          <div 
            className="absolute inset-0 opacity-10 blur-3xl pointer-events-none"
            style={{
              backgroundImage: `url(${currentTrack.cover})`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />

          {/* Top Bar inside Drawer */}
          <div className="relative z-10 flex items-center justify-between mb-8">
            <button 
              onClick={() => setIsMobileExpanded(false)}
              className="text-stone-400 hover:text-white flex items-center justify-center hover:bg-white/5 rounded-full"
              style={{ width: 44, height: 44 }}
            >
              ✕
            </button>
            <span className="font-sans font-bold text-[10px] text-stone-500 uppercase tracking-widest">Now Playing</span>
            <button 
              onClick={onToggleLike}
              className="text-stone-300 hover:text-white flex items-center justify-center hover:bg-white/5 rounded-full"
              style={{ width: 44, height: 44 }}
            >
              {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
            </button>
          </div>

          {/* Album Art Section */}
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center">
            <div 
              className="w-64 h-64 rounded-3xl overflow-hidden shadow-2xl border border-white/10"
              style={{
                boxShadow: '0 24px 48px rgba(0, 0, 0, 0.8)',
              }}
            >
              <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
            </div>
            
            {/* Equalizer animation */}
            <div className="flex items-end gap-1.5 h-6 mt-8">
              <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} style={{ width: 3, height: 6 }} />
              <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} style={{ width: 3, height: 6 }} />
              <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} style={{ width: 3, height: 6 }} />
              <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} style={{ width: 3, height: 6 }} />
              <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} style={{ width: 3, height: 6 }} />
            </div>
          </div>

          {/* Info Section */}
          <div className="relative z-10 text-center mb-6">
            <h2 className="font-sans font-bold text-xl text-white block truncate px-4">{currentTrack.title}</h2>
            <p className="font-sans text-stone-400 text-sm mt-1">{currentTrack.artist}</p>
          </div>

          {/* Waveform Scrubber in mobile */}
          <div className="relative z-10 w-full mb-8">
            <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono mb-2">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>

            <div 
              ref={scrubberRef}
              onPointerDown={handleProgressPointerDown}
              onPointerMove={handleProgressPointerMove}
              onPointerUp={handleProgressPointerUp}
              onMouseLeave={() => setHoverTime(null)}
              className="w-full py-4 cursor-pointer relative"
            >
              {/* Waveform bars */}
              <div className="flex items-center justify-between gap-[2px] h-12 w-full">
                {WAVEFORM_HEIGHTS.map((h, i) => {
                  const percent = (i / WAVEFORM_HEIGHTS.length) * 100
                  const isFilled = percent <= progressPercent
                  return (
                    <div 
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: isFilled ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  )
                })}
              </div>

              {/* Tooltip on Hover */}
              {hoverTime !== null && (
                <div
                  className="absolute -top-6 bg-zinc-900 border border-white/10 px-2 py-0.5 rounded text-[10px] text-white font-mono pointer-events-none -translate-x-1/2"
                  style={{ left: hoverX }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
          </div>

          {/* Mobile Buttons Controls */}
          <div className="relative z-10 flex items-center justify-between px-6 mb-8">
            <button 
              onClick={onToggleShuffle}
              className={`p-3 rounded-full hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
              style={{ width: 48, height: 48, opacity: isShuffle ? 1 : 0.4 }}
            >
              <ShuffleIcon />
            </button>
            <button 
              onClick={onPrev}
              className="p-3 rounded-full hover:bg-white/5 text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{ width: 48, height: 48 }}
            >
              <PrevIcon />
            </button>
            <button
              onClick={onTogglePlay}
              className={`w-16 h-16 rounded-full flex items-center justify-center bg-[var(--primary)] text-black focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none play-btn ${isPlaying ? 'playing' : ''}`}
            >
              {isPlaying ? (
                <svg width="18" height="18" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="2" width="2.5" height="10" rx="1.25" fill="black" />
                  <rect x="8.5" y="2" width="2.5" height="10" rx="1.25" fill="black" />
                </svg>
              ) : (
                <svg width="14" height="18" viewBox="0 0 11 14" fill="none" className="ml-[2px]">
                  <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="black" stroke="black" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button 
              onClick={onNext}
              className="p-3 rounded-full hover:bg-white/5 text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{ width: 48, height: 48 }}
            >
              <NextIcon />
            </button>
            <button 
              onClick={onToggleRepeat}
              className={`p-3 rounded-full hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
              style={{ width: 48, height: 48, opacity: isRepeat ? 1 : 0.4 }}
            >
              <RepeatIcon />
            </button>
          </div>

          {/* Bottom sheet control actions */}
          <div className="relative z-10 flex items-center justify-center gap-6 mt-auto mb-4">
            <button
              onClick={onToggleLyrics}
              style={{
                opacity: showLyrics ? 1 : hasLyrics ? 0.7 : 0.3,
                transform: showLyrics ? 'scale(1.1)' : 'scale(1)',
                filter: showLyrics ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
                minHeight: 44,
              }}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-full border border-white/10 bg-white/5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
            >
              <MicIcon active={showLyrics} />
              <span className="font-sans text-xs font-bold text-white">Lyrics</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Player - Visible from 768px (md) */}
      <div
        className="hidden md:flex flex-shrink-0 items-center px-6 gap-6 relative"
        style={{
          height: 88,
          background: 'var(--glass-bg)',
          backdropFilter: 'var(--glass-blur)',
          border: 'var(--glass-border)',
          borderRadius: '9999px',
          margin: '0 24px 24px 24px',
          boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
        }}
      >
        {/* Track info */}
        <div className="flex items-center gap-3 flex-shrink-0" style={{ width: 230 }}>
          <div className="rounded-full overflow-hidden flex-shrink-0" style={{ width: 44, height: 44, border: '1px solid var(--border)' }}>
            <img src={currentTrack.cover} alt="cover" className="w-full h-full object-cover" />
          </div>
          <div className="flex items-end gap-[3px] h-4 w-4 justify-center flex-shrink-0">
            <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} />
            <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} />
            <div className={`eq-bar ${isPlaying ? 'animating' : ''}`} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <div className="player-title-marquee">
              <span
                ref={titleRef}
                className={`player-title-text block truncate ${isOverflowing ? 'overflow-scroll-hover' : ''}`}
                style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 13, color: 'var(--text)', letterSpacing: '0.2px' }}
              >
                {currentTrack.title}
              </span>
            </div>
            <span className="truncate" style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, color: 'var(--text-muted)' }}>
              {currentTrack.artist}
            </span>
          </div>
        </div>

        {/* Center controls & scrubber */}
        <div className="flex-1 flex flex-col items-center gap-1 min-w-0">
          {/* Playback Buttons */}
          <div className="flex items-center gap-6">
            <button 
              onClick={onToggleShuffle}
              className="transition-opacity text-white hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
              style={{ opacity: isShuffle ? 1 : 0.4, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <ShuffleIcon />
            </button>
            <button 
              onClick={onPrev}
              className="opacity-80 hover:opacity-100 transition-opacity text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <PrevIcon />
            </button>
            {/* Pulsing Play Button */}
            <button
              onClick={onTogglePlay}
              className={`flex items-center justify-center rounded-full flex-shrink-0 hover:scale-105 transition-all duration-200 play-btn focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none ${isPlaying ? 'playing' : ''}`}
              style={{ width: 40, height: 40, background: 'var(--primary)' }}
            >
              {isPlaying ? (
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <rect x="3" y="2" width="2.5" height="10" rx="1.25" fill="var(--background)" />
                  <rect x="8.5" y="2" width="2.5" height="10" rx="1.25" fill="var(--background)" />
                </svg>
              ) : (
                <svg width="11" height="14" viewBox="0 0 11 14" fill="none" className="ml-[2px]">
                  <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                </svg>
              )}
            </button>
            <button 
              onClick={onNext}
              className="opacity-80 hover:opacity-100 transition-opacity text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
              style={{ width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <NextIcon />
            </button>
            <button 
              onClick={onToggleRepeat}
              className="transition-opacity text-white hover:text-white focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
              style={{ opacity: isRepeat ? 1 : 0.4, width: 44, height: 44, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <RepeatIcon />
            </button>
          </div>

          {/* Waveform Scrubber */}
          <div className="flex items-center gap-3 w-full max-w-[480px]">
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
              {formatTime(currentTime)}
            </span>
            <div 
              ref={scrubberRef}
              onPointerDown={handleProgressPointerDown}
              onPointerMove={handleProgressPointerMove}
              onPointerUp={handleProgressPointerUp}
              onMouseLeave={() => setHoverTime(null)}
              className="relative flex-1 py-3 cursor-pointer select-none group" 
            >
              <div className="flex items-end justify-between gap-[2px] h-8 w-full">
                {WAVEFORM_HEIGHTS.map((h, i) => {
                  const percent = (i / WAVEFORM_HEIGHTS.length) * 100
                  const isFilled = percent <= progressPercent
                  return (
                    <div 
                      key={i}
                      className="flex-1 rounded-sm transition-all"
                      style={{
                        height: `${h}%`,
                        background: isFilled ? 'var(--primary)' : 'rgba(255,255,255,0.15)',
                      }}
                    />
                  )
                })}
              </div>

              {/* Hover tooltip for timestamp */}
              {hoverTime !== null && (
                <div
                  className="absolute -top-6 bg-[#16161A] border border-white/10 px-2 py-0.5 rounded text-[10px] text-white font-mono pointer-events-none -translate-x-1/2 shadow-lg"
                  style={{ left: hoverX }}
                >
                  {formatTime(hoverTime)}
                </div>
              )}
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 10, color: 'var(--text-muted)', flexShrink: 0 }}>
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 flex-shrink-0" style={{ width: 230, justifyContent: 'flex-end' }}>
          <button
            onClick={onToggleLike}
            className="hover:scale-110 transition-all duration-150 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
            style={{ width: 44, height: 44 }}
            title={isLiked ? "Unlike" : "Like"}
          >
            {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
          </button>
          <button
            onClick={onToggleLyrics}
            title="Lyrics"
            style={{
              opacity: showLyrics ? 1 : hasLyrics ? 0.7 : 0.3,
              transition: 'all 0.2s',
              transform: showLyrics ? 'scale(1.1)' : 'scale(1)',
              filter: showLyrics ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
              width: 44,
              height: 44,
            }}
            className="hover:opacity-100 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
          >
            <MicIcon active={showLyrics} />
          </button>
          <button 
            className="opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-150 text-white flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
            style={{ width: 44, height: 44 }}
          >
            <QueueIcon />
          </button>
          <button 
            className="opacity-70 hover:opacity-100 hover:scale-105 transition-all duration-150 text-white flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-full"
            style={{ width: 44, height: 44 }}
          >
            <VolumeIcon />
          </button>
          
          {/* Draggable Volume bar */}
          <div 
            ref={volumeRef}
            onPointerDown={handleVolumePointerDown}
            onPointerMove={handleVolumePointerMove}
            onPointerUp={handleVolumePointerUp}
            className="relative h-6 flex items-center cursor-pointer select-none" 
            style={{ width: 80 }}
          >
            <div className="relative w-full h-[3px] rounded-full" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <div className="absolute inset-y-0 left-0 rounded-full" style={{ width: `${volume * 100}%`, background: 'rgba(255,255,255,0.7)' }} />
              <div 
                className="absolute top-1/2 -translate-y-1/2 rounded-full w-2.5 h-2.5 bg-white shadow-md cursor-grab active:cursor-grabbing transition-transform hover:scale-125"
                style={{ left: `${volume * 100}%`, transform: 'translateX(-50%) translateY(-50%)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
