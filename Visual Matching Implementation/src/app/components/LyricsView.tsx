import { useEffect, useRef } from 'react'
import { Track, LyricLine } from '../App'

interface LyricsViewProps {
  lyrics: LyricLine[]
  activeLyricIdx: number
  hasSync: boolean
  track: Track
  onClose: () => void
}

export function LyricsView({ lyrics, activeLyricIdx, hasSync, track, onClose }: LyricsViewProps) {
  const activeRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Auto-scroll active lyric line to center
  useEffect(() => {
    if (activeRef.current && hasSync) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
    }
  }, [activeLyricIdx, hasSync])

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: 'linear-gradient(180deg, rgba(11,11,13,0.95) 0%, rgba(22,22,26,0.98) 100%)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        fontFamily: 'var(--font-sans)',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {/* Album art */}
          <div style={{
            width: 48, height: 48, borderRadius: 12,
            overflow: 'hidden', border: '1px solid var(--border)',
            flexShrink: 0,
          }}>
            <img src={track.cover} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)', letterSpacing: '0.2px' }}>
              {track.title}
            </div>
            <div style={{ fontWeight: 500, fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              {track.artist}
            </div>
          </div>
          {/* Sync badge */}
          <div style={{
            marginLeft: 12,
            padding: '3px 10px',
            borderRadius: 20,
            background: hasSync ? 'rgba(226,251,94,0.1)' : 'rgba(255,255,255,0.03)',
            border: `1px solid ${hasSync ? 'rgba(226,251,94,0.2)' : 'var(--border)'}`,
            fontSize: 9,
            fontWeight: 700,
            color: hasSync ? 'var(--primary)' : 'var(--text-muted)',
            letterSpacing: '1px',
            textTransform: 'uppercase' as const,
          }}>
            {hasSync ? 'LIVE SYNC' : 'PLAIN TEXT'}
          </div>
        </div>

        {/* Close */}
        <button
          onClick={onClose}
          style={{
            width: 36, height: 36, borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid var(--border)',
            color: 'var(--text-muted)',
            fontSize: 20, fontWeight: 300,
            cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
            lineHeight: 1,
          }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}
        >
          ×
        </button>
      </div>

      {/* Lyrics area */}
      <div
        ref={containerRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '60px 0',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          scrollbarWidth: 'none',
        }}
      >
        {lyrics.length === 0 ? (
          <div style={{
            marginTop: '15vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 16,
          }}>
            {/* Concentric radiating resonance ripple element */}
            <div className="relative flex items-center justify-center w-24 h-24 mb-4">
              <div className="absolute w-12 h-12 rounded-full border border-primary/20 animate-resonance-1" />
              <div className="absolute w-12 h-12 rounded-full border border-primary/20 animate-resonance-2" />
              <div className="absolute w-12 h-12 rounded-full border border-primary/20 animate-resonance-3" />
              <div className="relative w-4 h-4 rounded-full bg-primary/40" />
            </div>

            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 32, color: 'var(--text)', textAlign: 'center', opacity: 0.9 }}>
              A voice emerging from silence
            </div>
            <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)', textAlign: 'center' }}>
              No lyrics found for {track.title} by {track.artist}
            </div>
          </div>
        ) : (
          <div style={{ width: '100%', maxWidth: 720, padding: '0 32px' }}>
            {lyrics.map((line, i) => {
              const isActive = i === activeLyricIdx
              
              let className = isActive ? 'lyric-line-active' : 'lyric-line-inactive'
              let customStyle: React.CSSProperties = {}

              // If no sync, all lines same style
              if (!hasSync) {
                className = 'lyric-line-inactive'
                customStyle = {
                  fontFamily: 'var(--font-sans)',
                  fontSize: '18px',
                  opacity: 0.85,
                  color: 'var(--text)',
                }
              }

              return (
                <div
                  key={i}
                  ref={isActive ? activeRef : undefined}
                  className={className}
                  style={{
                    lineHeight: 1.6,
                    padding: '16px 0',
                    textAlign: 'center',
                    cursor: 'default',
                    userSelect: 'none',
                    ...customStyle,
                  }}
                >
                  {line.line}
                </div>
              )
            })}

            {/* Bottom spacer so last line can scroll to center */}
            <div style={{ height: '40vh' }} />
          </div>
        )}
      </div>

      {/* Footer progress hint */}
      {hasSync && lyrics.length > 0 && (
        <div style={{
          padding: '16px 32px',
          textAlign: 'center',
          borderTop: '1px solid var(--border)',
          fontSize: 10,
          fontWeight: 600,
          color: 'var(--text-muted)',
          letterSpacing: '0.8px',
          textTransform: 'uppercase',
          flexShrink: 0,
        }}>
          Synced lyrics via LRCLIB · Powered by Lyrica
        </div>
      )}
    </div>
  )
}
