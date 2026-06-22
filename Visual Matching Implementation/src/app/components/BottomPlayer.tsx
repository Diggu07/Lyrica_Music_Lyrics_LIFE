import { useEffect, useRef, useState } from 'react'
import { Track } from '../App'
import { PlaylistPopover } from './PlaylistPopover'

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
  showNowPlaying?: boolean
  onToggleNowPlaying?: () => void
  onNavigateArtist?: (artistName: string) => void
}


const formatTime = (secs: number) => {
  if (isNaN(secs) || secs === Infinity) return '0:00';
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

const WAVEFORM_HEIGHTS = [
  12, 18, 14, 22, 10, 16, 24, 20, 12, 8,
  14, 20, 26, 18, 12, 10, 16, 22, 14, 18,
  20, 24, 16, 10, 14, 22, 18, 12, 8, 16,
  20, 26, 14, 12, 18, 22, 10, 14, 20, 12
];

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
  showNowPlaying,
  onToggleNowPlaying,
  onNavigateArtist,
}: BottomPlayerProps) {
  const titleRef = useRef<HTMLSpanElement>(null);
  const [isOverflowing, setIsOverflowing] = useState(false);

  useEffect(() => {
    if (titleRef.current) {
      setIsOverflowing(titleRef.current.scrollWidth > titleRef.current.clientWidth);
    }
  }, [currentTrack.title]);

  // Waveform state & mouse drag seeking
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [tooltipX, setTooltipX] = useState(0);
  const [hoverTime, setHoverTime] = useState(0);
  const waveformRef = useRef<HTMLDivElement>(null);

  const progressFraction = duration > 0 ? currentTime / duration : 0;

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const fraction = Math.max(0, Math.min(1, clickX / rect.width));
    onSeek(fraction * duration);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    setTooltipX(x);
    const fraction = Math.max(0, Math.min(1, x / rect.width));
    setHoverTime(fraction * duration);
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging || !waveformRef.current) return;
      const rect = waveformRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const fraction = Math.max(0, Math.min(1, clickX / rect.width));
      onSeek(fraction * duration);
    };
    const handleWindowMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, duration, onSeek]);

  // Volume slider state & mouse drag volume control
  const [isDraggingVolume, setIsDraggingVolume] = useState(false);
  const volumeRef = useRef<HTMLDivElement>(null);

  const handleVolumeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDraggingVolume(true);
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const vol = Math.max(0, Math.min(1, clickX / rect.width));
    onVolumeChange(vol);
  };

  useEffect(() => {
    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDraggingVolume || !volumeRef.current) return;
      const rect = volumeRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const vol = Math.max(0, Math.min(1, clickX / rect.width));
      onVolumeChange(vol);
    };
    const handleWindowMouseUp = () => {
      setIsDraggingVolume(false);
    };

    if (isDraggingVolume) {
      window.addEventListener('mousemove', handleWindowMouseMove);
      window.addEventListener('mouseup', handleWindowMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDraggingVolume, onVolumeChange]);

  return (
    <div
      className="flex-shrink-0 flex items-center px-6 gap-6 relative"
      style={{
        height: 88,
        background: 'rgba(22, 22, 26, 0.75)',
        backdropFilter: 'blur(12px)',
        border: '1px solid var(--border)',
        borderRadius: '9999px',
        margin: '0 24px 24px 24px',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)',
      }}
    >
      {/* Track info */}
      <div className="flex items-center gap-3" style={{ width: 240 }}>
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
          <span
            onClick={() => onNavigateArtist && onNavigateArtist(currentTrack.artist)}
            className="truncate hover:text-white cursor-pointer transition-colors"
            style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, color: 'var(--text-muted)' }}
          >
            {currentTrack.artist}
          </span>
        </div>
      </div>

      {/* Center controls */}
      <div className="flex-1 flex flex-col items-center gap-2">
        {/* Buttons */}
        <div className="flex items-center gap-[14px]">
          <button 
            onClick={onToggleShuffle}
            aria-label="Shuffle"
            className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-transparent text-white hover:bg-[rgba(255,255,255,0.08)] focus-visible:bg-[rgba(255,255,255,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] outline-none transition-all duration-150 ease-out"
            style={{ opacity: isShuffle ? 1 : 0.4 }}
          >
            <ShuffleIcon />
          </button>
          <button 
            onClick={onPrev}
            aria-label="Previous"
            className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-transparent text-white hover:bg-[rgba(255,255,255,0.08)] focus-visible:bg-[rgba(255,255,255,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] outline-none transition-all duration-150 ease-out opacity-80 hover:opacity-100 focus-visible:opacity-100"
          >
            <PrevIcon />
          </button>
          {/* Play/Pause Button */}
          <button
            onClick={onTogglePlay}
            aria-label="Play/Pause"
            className="flex items-center justify-center w-[44px] h-[44px] rounded-[14px] flex-shrink-0 hover:scale-105 focus-visible:scale-105 focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] outline-none transition-all duration-150 play-btn"
            style={{ background: 'var(--primary)', width: 44, height: 44 }}
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
            aria-label="Next"
            className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-transparent text-white hover:bg-[rgba(255,255,255,0.08)] focus-visible:bg-[rgba(255,255,255,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] outline-none transition-all duration-150 ease-out opacity-80 hover:opacity-100 focus-visible:opacity-100"
          >
            <NextIcon />
          </button>
          <button 
            onClick={onToggleRepeat}
            aria-label="Repeat"
            className="flex items-center justify-center w-9 h-9 rounded-[12px] bg-transparent text-white hover:bg-[rgba(255,255,255,0.08)] focus-visible:bg-[rgba(255,255,255,0.08)] focus-visible:ring-2 focus-visible:ring-[var(--primary)] focus-visible:ring-offset-2 focus-visible:ring-offset-[#121214] outline-none transition-all duration-150 ease-out"
            style={{ opacity: isRepeat ? 1 : 0.4 }}
          >
            <RepeatIcon />
          </button>
        </div>
        {/* Progress bar */}
        <div className="flex items-center gap-3 w-full max-w-[480px]">
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
            {formatTime(currentTime)}
          </span>
          <div 
            ref={waveformRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            className="relative flex-1 h-[32px] flex items-end justify-between cursor-pointer"
            style={{ minWidth: 200 }}
          >
            <style>{`
              @keyframes waveform-pulse {
                0%, 100% {
                  transform: scaleY(0.6);
                }
                50% {
                  transform: scaleY(1);
                }
              }
              .waveform-bar {
                animation: waveform-pulse 0.9s ease-in-out infinite;
                transform-origin: bottom;
              }
            `}</style>
            {WAVEFORM_HEIGHTS.map((height, i) => {
              const fraction = i / 39;
              const isActive = fraction <= progressFraction;
              return (
                <div
                  key={i}
                  className="waveform-bar"
                  style={{
                    width: '2px',
                    height: `${height}px`,
                    borderRadius: '1px',
                    backgroundColor: isActive ? 'var(--primary)' : '#52525b',
                    animationDelay: `${i * 0.04}s`,
                    animationPlayState: isPlaying ? 'running' : 'paused',
                  }}
                />
              );
            })}
            
            {/* Tooltip */}
            {isHovering && !isDragging && (
              <div
                className="absolute pointer-events-none bg-stone-900 border border-white/10 text-white text-[10px] font-mono px-2 py-1 rounded shadow-xl flex flex-col items-center z-50 animate-fade-in"
                style={{
                  left: `${tooltipX}px`,
                  transform: 'translateX(-50%) translateY(-100%)',
                  top: '-8px',
                }}
              >
                {formatTime(hoverTime)}
                <div 
                  className="absolute w-1.5 h-1.5 rotate-45 bg-stone-900 border-r border-b border-white/10" 
                  style={{ bottom: '-4px', left: 'calc(50% - 3px)' }} 
                />
              </div>
            )}
          </div>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 11, color: 'var(--text-muted)', flexShrink: 0 }}>
            {formatTime(duration)}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div className="flex items-center gap-4" style={{ width: 240, justifyContent: 'flex-end' }}>
        <PlaylistPopover track={currentTrack} />
        <button
          onClick={onToggleLyrics}
          title="Lyrics"
          style={{
            opacity: showLyrics ? 1 : hasLyrics ? 0.7 : 0.3,
            transition: 'all 0.2s',
            transform: showLyrics ? 'scale(1.1)' : 'scale(1)',
            filter: showLyrics ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
          }}
          className="hover:opacity-100 flex items-center justify-center"
        >
          <MicIcon active={showLyrics} />
        </button>
        <button
          onClick={onToggleNowPlaying}
          title="Toggle Now Playing & Queue"
          style={{
            opacity: showNowPlaying ? 1 : 0.7,
            transition: 'all 0.2s',
            transform: showNowPlaying ? 'scale(1.1)' : 'scale(1)',
            filter: showNowPlaying ? 'drop-shadow(0 0 6px var(--primary))' : 'none',
          }}
          className="hover:opacity-100 flex items-center justify-center text-white"
        >
          <QueueIcon />
        </button>
        <button className="opacity-70 hover:opacity-100 transition-opacity text-white flex items-center justify-center"><VolumeIcon /></button>
        {/* Volume bar */}
        <div 
          ref={volumeRef}
          onMouseDown={handleVolumeMouseDown}
          className="group relative h-[3px] rounded-full cursor-pointer flex items-center" 
          style={{ width: 80, background: 'rgba(255,255,255,0.1)' }}
        >
          <div 
            className="absolute inset-y-0 left-0 rounded-full" 
            style={{ width: `${volume * 100}%`, background: 'var(--primary)' }} 
          />
          <div
            className="absolute rounded-full transition-transform scale-0 group-hover:scale-100"
            style={{ 
              left: `${volume * 100}%`, 
              transform: 'translateX(-50%)', 
              width: 8, 
              height: 8, 
              background: 'var(--primary)',
              boxShadow: '0 0 6px var(--primary)'
            }}
          />
        </div>
      </div>
    </div>
  )
}
