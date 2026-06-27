import { Track } from '../../App'
import { HeroCompanion } from '../../services/homeData'
import { PlayGlyph, SaveGlyph } from './shared'

interface HeroStats {
  rank: string
  plays: string
  growth: string
  monthlyListeners: string
  countries: string
  friends: string
  genre: string
}

export function HeroSection({
  featuredTrack,
  trackPool,
  stats,
  companions,
  likedTrackIds,
  onPlayTrack,
  onToggleLike,
}: {
  featuredTrack: Track
  trackPool: Track[]
  stats: HeroStats
  companions: HeroCompanion[]
  likedTrackIds: string[]
  onPlayTrack: (track: Track, queue?: Track[]) => void
  onToggleLike: (trackId: string) => void
}) {
  return (
    <section
      className="overflow-hidden rounded-[32px] border"
      style={{
        minHeight: 350,
        borderColor: 'rgba(255,255,255,0.08)',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))',
        boxShadow: '0 24px 80px rgba(0,0,0,0.45)',
      }}
    >
      <div className="grid h-full gap-0 lg:grid-cols-[1.25fr_0.85fr]">
        <div className="relative min-h-[350px] overflow-hidden">
          <img
            src={featuredTrack.cover}
            alt={featuredTrack.title}
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="hero-ambient-orb absolute -left-10 top-8 h-56 w-56 rounded-full bg-[rgba(198,255,51,0.12)] blur-3xl" />
          <div className="hero-ambient-orb absolute bottom-2 right-10 h-44 w-44 rounded-full bg-[rgba(124,212,255,0.14)] blur-3xl" />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(90deg, rgba(11,11,13,0.84) 0%, rgba(11,11,13,0.55) 48%, rgba(11,11,13,0.2) 100%), linear-gradient(180deg, rgba(198,255,51,0.12) 0%, rgba(11,11,13,0) 35%, rgba(11,11,13,0.82) 100%)',
            }}
          />
          <div className="absolute inset-0 opacity-65" style={{ background: 'conic-gradient(from 90deg at 70% 40%, rgba(198,255,51,0.18), transparent 25%, rgba(124,212,255,0.12), transparent 70%)' }} />
          <div className="relative flex h-full flex-col justify-between p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div
                  className="mb-3 inline-flex rounded-full border px-3 py-1 text-[10px] uppercase tracking-[0.32em]"
                  style={{
                    borderColor: 'rgba(198,255,51,0.35)',
                    background: 'rgba(198,255,51,0.08)',
                    color: 'var(--primary)',
                  }}
                >
                  Featured Release
                </div>
                <div className="mb-3 flex flex-wrap items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-white/58">
                  <span>{stats.rank}</span>
                  <span>{stats.plays}</span>
                  <span style={{ color: 'var(--primary)' }}>{stats.growth}</span>
                </div>
                <h1
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontWeight: 400,
                    fontSize: 'clamp(2.3rem, 4.8vw, 4.8rem)',
                    lineHeight: 0.92,
                    color: 'white',
                    maxWidth: 560,
                  }}
                >
                  {featuredTrack.album || featuredTrack.title}
                </h1>
                <p className="mt-3 max-w-[560px] text-[13px] leading-6 text-white/72">
                  A cinematic front-row listen built around {featuredTrack.title} by {featuredTrack.artist}. Velvet-night pop,
                  polished hooks, and detail-rich production for repeat plays after dark.
                </p>
              </div>
              <div className="rounded-[24px] border border-white/10 bg-black/20 px-4 py-3 backdrop-blur-xl">
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/45">Live Signal</div>
                <div className="mt-2 text-[13px] text-white">{stats.monthlyListeners}</div>
                <div className="mt-1 text-[11px] text-white/52">{stats.countries}</div>
              </div>
            </div>

            <div>
              <div className="mb-4 flex flex-wrap gap-2">
                {['Electro Pop', 'Late Night', 'Global', stats.genre].map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full border px-3 py-1 text-[11px]"
                    style={{ borderColor: 'rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.08)', color: 'white' }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <button
                  onClick={() => onPlayTrack(featuredTrack, trackPool)}
                  className="flex items-center gap-3 rounded-full px-5 py-3 text-[13px] font-semibold transition-transform duration-300 hover:scale-[1.03]"
                  style={{
                    background: 'var(--primary)',
                    color: 'var(--background)',
                    boxShadow: '0 0 24px rgba(198,255,51,0.22)',
                  }}
                >
                  <PlayGlyph />
                  Play Now
                </button>
                <button
                  onClick={() => onToggleLike(featuredTrack.id)}
                  className="flex items-center gap-2 rounded-full border px-4 py-3 text-[13px] text-white/82 transition-all duration-300 hover:border-white/20 hover:bg-white/6"
                  style={{ borderColor: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(18px)' }}
                >
                  <SaveGlyph active={likedTrackIds.includes(featuredTrack.id)} />
                  Save
                </button>
                <div className="hidden items-end gap-2 md:flex">
                  <div className="hero-waveform">
                    {Array.from({ length: 18 }).map((_, index) => (
                      <span
                        key={index}
                        className="hero-waveform-bar"
                        style={{
                          animationDelay: `${index * 0.08}s`,
                          height: `${8 + ((index * 7) % 24)}px`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-white/55">Live waveform</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          className="grid gap-3 p-5"
          style={{
            background:
              'linear-gradient(180deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025)), linear-gradient(180deg, rgba(17,17,18,0.92), rgba(11,11,13,0.96))',
          }}
        >
          <div className="grid grid-cols-2 gap-3">
            {[
              ['Popularity', stats.rank],
              ['Streams', stats.plays],
              ['Momentum', stats.growth],
              ['Friends', stats.friends],
            ].map(([label, value]) => (
              <div
                key={label}
                className="rounded-[22px] border p-4"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">{label}</div>
                <div className="mt-2 text-[16px] text-white">{value}</div>
              </div>
            ))}
          </div>

          <div
            className="rounded-[26px] border p-4"
            style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}
          >
            <div className="mb-3 flex items-center justify-between">
              <div className="text-[10px] uppercase tracking-[0.28em] text-white/40">Next Discovery</div>
              <div className="text-[11px] text-white/58">Wrapped-style signals</div>
            </div>
            <div className="space-y-3">
              {companions.map((item) => (
                <button
                  key={`${item.type}-${item.title}`}
                  className="flex w-full items-center gap-3 rounded-[18px] border p-2 text-left transition-all duration-300 hover:scale-[1.01] hover:border-[rgba(198,255,51,0.28)] hover:bg-white/6"
                  style={{ borderColor: 'rgba(255,255,255,0.06)', background: 'rgba(255,255,255,0.025)' }}
                >
                  <img src={item.image} alt="" className="h-14 w-14 rounded-[14px] object-cover" />
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 text-[10px] uppercase tracking-[0.22em] text-[var(--primary)]">{item.type}</div>
                    <div className="truncate text-[13px] font-semibold text-white">{item.title}</div>
                    <div className="truncate text-[11px] text-white/55">{item.subtitle}</div>
                  </div>
                  <div className="text-[10px] text-white/42">{item.action}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
