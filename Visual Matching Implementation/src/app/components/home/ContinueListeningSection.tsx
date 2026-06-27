import { Track } from '../../App'
import { SectionHeader, PlayGlyph } from './shared'

export function ContinueListeningSection({
  tracks,
  onPlayTrack,
}: {
  tracks: Track[]
  onPlayTrack: (track: Track, queue?: Track[]) => void
}) {
  return (
    <section className="editorial-reveal">
      <SectionHeader
        eyebrow="Continue where you left off"
        title="Continue Listening"
        caption="Moved closer to the hero and upgraded with better progress, remaining time, and richer resume context."
      />
      <div className="grid gap-4 xl:grid-cols-[1.3fr_0.7fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {tracks.slice(0, 4).map((track, index) => {
            const progress = 42 + (index % 5) * 11
            return (
              <button
                key={`${track.id}-${index}`}
                onClick={() => onPlayTrack(track, tracks)}
                className="group rounded-[24px] border p-3 text-left transition-all duration-300 hover:scale-[1.01] hover:border-[rgba(198,255,51,0.3)]"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
                  <div className="relative overflow-hidden rounded-[18px]">
                    <img src={track.cover} alt={track.title} className="h-[140px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--primary)] opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <PlayGlyph />
                    </div>
                  </div>
                  <div className="flex min-h-[140px] flex-col justify-between">
                    <div>
                      <div className="truncate text-[15px] font-semibold text-white">{track.title}</div>
                      <div className="mt-1 truncate text-[11px] text-white/55">{track.artist}</div>
                      <div className="mt-3 inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-white/58" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        Last played {index + 1}h ago
                      </div>
                    </div>
                    <div>
                      <div className="mb-2 flex items-center justify-between text-[11px] text-white/55">
                        <span>{progress}% listened</span>
                        <span>{track.duration || '3:30'} remaining</span>
                      </div>
                      <div className="h-[5px] overflow-hidden rounded-full bg-white/8">
                        <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${progress}%` }} />
                      </div>
                      <div className="mt-3 text-[12px] text-white/72">Resume listening</div>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="rounded-[26px] border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}>
          <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">Your mood today</div>
          <div className="mt-3 text-[28px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
            Late-night momentum
          </div>
          <p className="mt-3 text-[12px] leading-6 text-white/58">
            Based on yesterday’s replays, you’re leaning into polished pop, after-dark synths, and emotionally dense hooks.
          </p>
          <div className="mt-6 space-y-3">
            {[
              ['Top genre', 'Pop / Alt'],
              ['Based on yesterday', '6 repeat plays'],
              ['Trending near you', 'Mumbai + Delhi NCR'],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center justify-between rounded-[18px] border px-4 py-3 text-[12px]" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}>
                <span className="text-white/55">{label}</span>
                <span className="text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
