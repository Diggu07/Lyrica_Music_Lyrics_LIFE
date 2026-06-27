import { lazy, Suspense, useEffect, useMemo, useState } from 'react'
import { Track } from '../App'
import imgHeroBanner from 'figma:asset/2127cd02c303f92e451186421fc741ebbe9956cc.png'
import imgNowPlaying from 'figma:asset/4ee233c9fd9f345420928c5ccf8cba2ae01305c9.png'
import { GlobalChartsSection, RegionalChartsSection } from './home/ChartsSection'
import { ContinueListeningSection } from './home/ContinueListeningSection'
import { HeroSection } from './home/HeroSection'
import {
  buildArtistProfiles,
  buildGlobalCharts,
  buildHeroCompanions,
  buildHeroStats,
  buildRegionalCharts,
  ChartHeader,
  genrePills,
  inferGenre,
  normalizeGenre,
} from '../services/homeData'

const LowerHomeSections = lazy(() => import('./home/LowerHomeSections'))

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
  const [charts, setCharts] = useState<ChartHeader[]>([])
  const [loadingCharts, setLoadingCharts] = useState(true)
  const [selectedGenre, setSelectedGenre] = useState(genrePills[0])

  useEffect(() => {
    setLoadingCharts(true)
    fetch('/api/music/charts?overview=true')
      .then((res) => res.json())
      .then((data) => {
        setCharts(data.charts || [])
        setLoadingCharts(false)
      })
      .catch((error) => {
        console.error('Failed to fetch charts overview:', error)
        setLoadingCharts(false)
      })
  }, [])

  const fallbackTrack: Track = useMemo(
    () => ({
      id: 'lyrica-editorial',
      title: currentTrack?.title || 'Night Drive Cinema',
      artist: currentTrack?.artist || 'Lyrica Editorial',
      cover: currentTrack?.cover || imgHeroBanner,
      album: currentTrack?.album || 'After Midnight',
      duration: currentTrack?.duration || '3:42',
      language: 'english',
    }),
    [currentTrack],
  )

  const trackPool = allTracks.length ? allTracks : [fallbackTrack]
  const displayRecentlyPlayed = recentlyPlayed.length ? recentlyPlayed : trackPool.slice(0, 6)
  const libraryAdditions = likedTrackIds.length
    ? trackPool.filter((track) => likedTrackIds.includes(track.id)).slice(0, 6)
    : trackPool.slice(0, 6)
  const featuredTrack = trackPool[0] || fallbackTrack

  const genreAwareTracks = useMemo(() => {
    const normalized = normalizeGenre(selectedGenre)
    const matches = trackPool.filter((track) => normalizeGenre(inferGenre(track)) === normalized)
    return matches.length ? matches : trackPool
  }, [selectedGenre, trackPool])

  const recommendationTracks = useMemo(() => [...genreAwareTracks, ...trackPool].slice(0, 12), [genreAwareTracks, trackPool])
  const wideCharts = charts.filter((chart) => chart.ratio === '16:9')
  const portraitCharts = charts.filter((chart) => chart.ratio === '4:5')

  const heroStats = useMemo(() => buildHeroStats(featuredTrack, trackPool), [featuredTrack, trackPool])
  const heroCompanions = useMemo(() => buildHeroCompanions(featuredTrack, queue.slice(queueIndex + 1, queueIndex + 4).length ? queue.slice(queueIndex + 1, queueIndex + 4) : trackPool), [featuredTrack, queue, queueIndex, trackPool])
  const artistProfiles = useMemo(() => buildArtistProfiles(trackPool), [trackPool])
  const globalCharts = useMemo(() => buildGlobalCharts(wideCharts, imgHeroBanner), [wideCharts])
  const regionalCharts = useMemo(() => buildRegionalCharts(portraitCharts, imgNowPlaying), [portraitCharts])

  const playChart = async (chart: (typeof globalCharts)[number]) => {
    try {
      const params = new URLSearchParams()
      params.append('type', chart.type)
      if (chart.language) {
        params.append('language', chart.language)
      }
      const res = await fetch(`/api/music/charts?${params.toString()}`)
      if (!res.ok) return
      const data = await res.json()
      const tracks = data.tracks || []
      if (tracks.length > 0) {
        onPlayTrack(tracks[0], tracks)
      }
    } catch (error) {
      console.error('Failed to play chart:', error)
    }
  }

  return (
    <div className="flex h-full overflow-hidden" style={{ background: 'var(--background)' }}>
      <div className="relative flex-1 overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'radial-gradient(circle at top left, rgba(198,255,51,0.08), transparent 26%), radial-gradient(circle at 85% 20%, rgba(124,212,255,0.1), transparent 22%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 35%)',
          }}
        />

        <div className="relative h-full overflow-y-auto px-6 pb-10 md:px-8">
          <div className="space-y-7 pb-8 pt-2">
            <HeroSection
              featuredTrack={featuredTrack}
              trackPool={trackPool}
              stats={heroStats}
              companions={heroCompanions}
              likedTrackIds={likedTrackIds}
              onPlayTrack={onPlayTrack}
              onToggleLike={onToggleLike}
            />

            <ContinueListeningSection tracks={displayRecentlyPlayed} onPlayTrack={onPlayTrack} />

            <GlobalChartsSection charts={globalCharts} loading={loadingCharts} onNavigate={onNavigate} onPlayChart={playChart} />

            <RegionalChartsSection charts={regionalCharts} onNavigate={onNavigate} />

            <Suspense
              fallback={
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <div key={index} className="h-[220px] animate-pulse rounded-[26px] bg-white/5" />
                  ))}
                </div>
              }
            >
              <LowerHomeSections
                selectedGenre={selectedGenre}
                setSelectedGenre={setSelectedGenre}
                genreAwareTracks={genreAwareTracks}
                recommendationTracks={recommendationTracks}
                featuredTrack={featuredTrack}
                artistProfiles={artistProfiles}
                trackPool={trackPool}
                libraryAdditions={libraryAdditions}
                onPlayTrack={onPlayTrack}
                onNavigate={onNavigate}
              />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  )
}
