import { CuratedChart } from '../../services/homeData'
import { SectionHeader, PlayGlyph } from './shared'

export function GlobalChartsSection({
  charts,
  loading,
  onNavigate,
  onPlayChart,
}: {
  charts: CuratedChart[]
  loading: boolean
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
  onPlayChart: (chart: CuratedChart) => void
}) {
  return (
    <section className="editorial-reveal">
      <SectionHeader
        eyebrow="Section 1"
        title="Global Charts"
        caption="Expanded chart types, denser metadata, and a mixed magazine shelf so the discovery rhythm changes immediately after the hero."
      />
      <div className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="grid gap-4 md:grid-cols-2">
          {(loading ? Array.from({ length: 4 }) : charts.slice(0, 4)).map((chart, index) => (
            <div
              key={loading ? `chart-skeleton-${index}` : `${chart.type}-${chart.language || index}-${chart.title}`}
              className={`${index === 0 ? 'md:col-span-2' : ''} group relative overflow-hidden rounded-[26px] border`}
              style={{
                borderColor: 'rgba(255,255,255,0.08)',
                background: loading ? 'rgba(255,255,255,0.04)' : 'transparent',
              }}
            >
              {loading ? (
                <div className="h-[190px] animate-pulse bg-white/6" />
              ) : (
                <>
                  <img src={chart.cover} alt={chart.title} className="h-[190px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/45 to-black/92" />
                  <div className="absolute inset-x-0 bottom-0 p-4">
                    <div className="mb-3 flex items-center justify-between">
                      <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.28em]" style={{ background: 'rgba(198,255,51,0.12)', color: chart.accent }}>
                        {chart.badge}
                      </span>
                      <span className="text-[12px] font-semibold" style={{ color: chart.accent }}>
                        {chart.movement}
                      </span>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.5rem', color: 'white' }}>
                      {chart.title}
                    </h3>
                    <p className="mt-2 text-[12px] leading-5 text-white/60">{chart.description}</p>
                    <div className="mt-4 flex items-center justify-between text-[11px] text-white/50">
                      <span>{chart.trackCount} tracks</span>
                      <span>{chart.followers} followers</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <button
                        onClick={() => onNavigate(`chart:${chart.type}:${chart.language || ''}`)}
                        className="rounded-full border px-3 py-1.5 text-[11px] text-white/70 transition-colors hover:border-white/20 hover:bg-white/6"
                        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
                      >
                        Open
                      </button>
                      <button
                        onClick={() => onPlayChart(chart)}
                        className="flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 hover:scale-105"
                        style={{ background: 'var(--primary)', boxShadow: '0 0 22px rgba(198,255,51,0.2)' }}
                      >
                        <PlayGlyph />
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        <div className="rounded-[26px] border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}>
          <div className="mb-4 text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">Fast moving this week</div>
          <div className="space-y-3">
            {charts.slice(4, 10).map((chart) => (
              <button
                key={`${chart.title}-mini`}
                onClick={() => onNavigate(`chart:${chart.type}:${chart.language || ''}`)}
                className="flex w-full items-center gap-3 rounded-[18px] border p-3 text-left transition-all duration-300 hover:border-[rgba(198,255,51,0.28)] hover:bg-white/6"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}
              >
                <img src={chart.cover} alt="" className="h-14 w-14 rounded-[14px] object-cover" />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-semibold text-white">{chart.title}</div>
                  <div className="truncate text-[11px] text-white/55">{chart.trackCount} tracks / {chart.followers} followers</div>
                </div>
                <div className="text-[11px] font-semibold" style={{ color: chart.accent }}>{chart.movement}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export function RegionalChartsSection({
  charts,
  onNavigate,
}: {
  charts: CuratedChart[]
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
}) {
  return (
    <section className="editorial-reveal">
      <SectionHeader
        eyebrow="Section 2"
        title="Regional Charts"
        caption="Mixed portrait tiles with movement, followers, and updated-today cues so local discovery feels as rich as global discovery."
      />
      <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-5">
        {charts.slice(0, 10).map((chart, index) => (
          <button
            key={`${chart.title}-${index}`}
            onClick={() => onNavigate(`chart:${chart.type}:${chart.language || ''}`)}
            className={`${index === 0 ? 'md:col-span-2 xl:row-span-2' : ''} group relative overflow-hidden rounded-[24px] border text-left transition-transform duration-300 hover:scale-[1.02]`}
            style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: index === 0 ? 330 : 220 }}
          >
            <img src={chart.cover} alt={chart.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/8 via-black/52 to-black/95" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="rounded-full border px-2 py-1 text-[10px] uppercase tracking-[0.2em] text-white/78" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  {chart.flag}
                </span>
                <span className="text-[10px] uppercase tracking-[0.2em] text-[var(--primary)]">{chart.updated}</span>
              </div>
              <div className="text-[22px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                {chart.title}
              </div>
              <div className="mt-2 flex items-center justify-between text-[11px] text-white/58">
                <span>{chart.trackCount} tracks</span>
                <span>{chart.movement}</span>
              </div>
              <div className="mt-1 text-[11px] text-white/44">{chart.followers} followers</div>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}
