import { Track } from '../App'

export interface ChartHeader {
  type: string
  language: string | null
  title: string
  description: string
  ratio: '16:9' | '4:5'
  cover: string
  trackCount: number
}

export type CuratedChart = ChartHeader & {
  badge: string
  movement: string
  accent: string
  flag?: string
  updated?: string
  followers?: string
}

export interface ArtistProfile {
  name: string
  id: string
  image: string
  monthlyListeners: string
  followers: string
  rank: string
  verified: boolean
  topSongs: string[]
}

export interface HeroCompanion {
  type: 'Artist' | 'Album' | 'Playlist'
  title: string
  subtitle: string
  image: string
  action: string
}

export const editorialPhotos = [
  'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=1200&q=80',
]

export const genrePills = [
  'Pop',
  'Rock',
  'Jazz',
  'Hip-Hop',
  'Metal',
  'Electronic',
  'Indie',
  'Classical',
  'Lo-fi',
  'Phonk',
  'K-Pop',
  'J-Pop',
  'Bollywood',
  'R&B',
  'Soul',
  'House',
  'Techno',
  'Country',
]

export const moodCollections = [
  'Late Night',
  'Gym Energy',
  'Rainy Evening',
  'Heartbreak',
  'Road Trip',
  'Focus',
  'Study',
  'Party',
  'Coffee House',
  'Sunday Morning',
  'Dream Pop',
  'Calm Piano',
]

export const playlistTitles = [
  'Daily Mix',
  'Chill Mix',
  'Workout',
  'Night Drive',
  'Discover Weekly',
  'Summer Hits',
  'Indie Finds',
  'Electronic Essentials',
]

export const freshReleaseLabels = ['New Albums', 'New Singles', 'New EPs', 'New Deluxe Editions', 'Upcoming Releases']

export const editorialLabels = ['Editors\' Picks', 'Global Pulse', 'Staff Story']

export const regionalTargets = [
  { title: 'India Top 50', flag: 'IN', language: null },
  { title: 'Hindi', flag: 'IN', language: 'hindi' },
  { title: 'Punjabi', flag: 'IN', language: 'punjabi' },
  { title: 'Tamil', flag: 'IN', language: 'tamil' },
  { title: 'Telugu', flag: 'IN', language: 'telugu' },
  { title: 'Malayalam', flag: 'IN', language: 'malayalam' },
  { title: 'Kannada', flag: 'IN', language: 'kannada' },
  { title: 'Marathi', flag: 'IN', language: 'marathi' },
  { title: 'Gujarati', flag: 'IN', language: 'gujarati' },
  { title: 'Bengali', flag: 'IN', language: 'bengali' },
  { title: 'USA', flag: 'US', language: null },
  { title: 'UK', flag: 'GB', language: null },
  { title: 'Japan', flag: 'JP', language: null },
  { title: 'Korea', flag: 'KR', language: null },
  { title: 'France', flag: 'FR', language: null },
  { title: 'Germany', flag: 'DE', language: null },
  { title: 'Brazil', flag: 'BR', language: null },
  { title: 'Canada', flag: 'CA', language: null },
  { title: 'Australia', flag: 'AU', language: null },
  { title: 'Mexico', flag: 'MX', language: null },
]

export const globalChartTitles = [
  'Worldwide Top 50',
  'Global Pulse',
  'Pop Now',
  'Hip-Hop Radar',
  'Rock Circuit',
  'Dance Signal',
  'Electronic Current',
  'Country Run',
  'Latin Motion',
  'Afrobeats Heat',
  'K-Pop Now',
  'J-Pop Select',
  'Trending Albums',
  'New Releases',
  'Most Saved',
  'Fastest Rising',
]

export const eventCities = ['Mumbai', 'Singapore', 'Delhi NCR', 'Seoul', 'London', 'Tokyo']
export const eventVenues = ['DY Patil Stadium', 'National Stadium', 'Jawaharlal Nehru Stadium', 'KSPO Dome', 'O2 Arena', 'Tokyo Dome']

export const pickFrom = <T,>(items: T[], index: number, fallback: T) => (items.length ? items[index % items.length] : fallback)

export const formatDate = (daysAgo: number) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const normalizeGenre = (genre: string) => genre.toLowerCase().replace(/[^a-z0-9]+/g, '')

export const inferGenre = (track: Track) => {
  const haystack = `${track.title} ${track.artist} ${track.album || ''} ${track.language || ''}`.toLowerCase()
  if (haystack.includes('k-pop') || haystack.includes('kpop') || haystack.includes('newjeans')) return 'K-Pop'
  if (haystack.includes('j-pop') || haystack.includes('jpop')) return 'J-Pop'
  if (haystack.includes('bollywood') || haystack.includes('hindi') || haystack.includes('punjabi')) return 'Bollywood'
  if (haystack.includes('phonk')) return 'Phonk'
  if (haystack.includes('lofi') || haystack.includes('lo-fi')) return 'Lo-fi'
  if (haystack.includes('rock')) return 'Rock'
  if (haystack.includes('metal')) return 'Metal'
  if (haystack.includes('jazz')) return 'Jazz'
  if (haystack.includes('classical')) return 'Classical'
  if (haystack.includes('house')) return 'House'
  if (haystack.includes('techno')) return 'Techno'
  if (haystack.includes('electronic') || haystack.includes('edm')) return 'Electronic'
  if (haystack.includes('indie')) return 'Indie'
  if (haystack.includes('country')) return 'Country'
  if (haystack.includes('r&b') || haystack.includes('soul')) return 'R&B'
  if (haystack.includes('hip') || haystack.includes('rap')) return 'Hip-Hop'
  return 'Pop'
}

const numberSeed = (input: string) =>
  input.split('').reduce((acc, char, index) => acc + char.charCodeAt(0) * (index + 1), 0)

export const formatCompactMillions = (seed: number, min: number, max: number) => {
  const raw = min + (seed % ((max - min) * 10)) / 10
  return `${raw.toFixed(1)}M`
}

export const buildArtistProfiles = (tracks: Track[]): ArtistProfile[] => {
  const uniqueArtists = Array.from(new Map(tracks.map((track) => [track.artist, track])).values()).slice(0, 5)
  return uniqueArtists.map((track, index) => {
    const seed = numberSeed(track.artist)
    const topSongs = tracks
      .filter((candidate) => candidate.artist === track.artist)
      .slice(0, 3)
      .map((candidate) => candidate.title)
    return {
      name: track.artist,
      id: track.artist.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''),
      image: track.cover || pickFrom(editorialPhotos, index, editorialPhotos[0]),
      monthlyListeners: formatCompactMillions(seed, 18, 110),
      followers: formatCompactMillions(seed * 2, 6, 48),
      rank: `#${index + 1}`,
      verified: true,
      topSongs: topSongs.length ? topSongs : [track.title],
    }
  })
}

export const buildHeroStats = (track: Track, tracks: Track[]) => {
  const seed = numberSeed(track.title + track.artist)
  const genre = inferGenre(track)
  const countries = Array.from(new Set(tracks.slice(0, 4).map((item) => item.language || 'global'))).map((value) =>
    value === 'english' ? 'USA' : value.charAt(0).toUpperCase() + value.slice(1),
  )
  return {
    rank: `#${(seed % 4) + 1} Worldwide`,
    plays: `${(18 + (seed % 8) + (seed % 10) / 10).toFixed(1)}M Plays`,
    growth: `+${8 + (seed % 11)}% this week`,
    monthlyListeners: `${formatCompactMillions(seed, 24, 95)} listeners`,
    countries: `${countries.slice(0, 3).join(', ')} listening`,
    friends: `${2 + (seed % 5)} friends listening`,
    genre,
  }
}

export const buildHeroCompanions = (featuredTrack: Track, tracks: Track[]): HeroCompanion[] => {
  const albumTrack = pickFrom(tracks, 1, featuredTrack)
  const playlistTrack = pickFrom(tracks, 2, featuredTrack)
  return [
    {
      type: 'Artist',
      title: featuredTrack.artist,
      subtitle: `${inferGenre(featuredTrack)} spotlight`,
      image: featuredTrack.cover || editorialPhotos[0],
      action: 'Open profile',
    },
    {
      type: 'Album',
      title: albumTrack.album || albumTrack.title,
      subtitle: albumTrack.artist,
      image: albumTrack.cover || editorialPhotos[1],
      action: 'Open album',
    },
    {
      type: 'Playlist',
      title: `${inferGenre(playlistTrack)} rotation`,
      subtitle: `Built from ${playlistTrack.artist}`,
      image: playlistTrack.cover || editorialPhotos[2],
      action: 'Play mix',
    },
  ]
}

export const buildGlobalCharts = (wideCharts: ChartHeader[], fallbackCover: string): CuratedChart[] => {
  const fallbackBase: ChartHeader = {
    type: 'worldwide',
    language: null,
    title: 'Global Pulse',
    description: 'A curated sweep across the loudest songs on the planet.',
    ratio: '16:9',
    cover: fallbackCover,
    trackCount: 50,
  }

  return globalChartTitles.map((title, index) => {
    const source = pickFrom(wideCharts, index, fallbackBase)
    return {
      ...source,
      title,
      badge: index < 2 ? 'Worldwide' : index < 10 ? 'Genre' : 'Signal',
      movement: ['+12', '+8', 'NEW', '+5', '+3', '+9', '+4', '+6', '+10', 'UP', '+7', '+11', '+2', '+14', '+1', '+13'][index],
      accent: ['#C6FF33', '#7CD4FF', '#FFB84D', '#FF7AD9'][index % 4],
      description: source.description || 'Updated with the most replayed cuts of the week.',
      trackCount: source.trackCount || 50,
      followers: formatCompactMillions(numberSeed(title), 4, 32),
    }
  })
}

export const buildRegionalCharts = (portraitCharts: ChartHeader[], fallbackCover: string): CuratedChart[] => {
  const fallbackBase: ChartHeader = {
    type: 'regional',
    language: null,
    title: 'Regional Charts',
    description: 'A local pulse with global reach.',
    ratio: '4:5',
    cover: fallbackCover,
    trackCount: 50,
  }

  return regionalTargets.map((target, index) => {
    const matched = portraitCharts.find((chart) => {
      if (target.language && chart.language) {
        return chart.language.toLowerCase() === target.language
      }
      return chart.title.toLowerCase().includes(target.title.toLowerCase())
    })
    const source = matched || pickFrom(portraitCharts, index, fallbackBase)
    return {
      ...source,
      title: target.title,
      flag: target.flag,
      badge: target.language ? 'Regional' : 'Global',
      movement: ['#1', '#3', '#2', '#6', '#4', '#5', '#8', '#10', '#7', '#9'][index % 10],
      accent: index % 2 === 0 ? '#C6FF33' : '#7CD4FF',
      updated: 'Updated today',
      trackCount: source.trackCount || 50,
      followers: formatCompactMillions(numberSeed(target.title), 1, 20),
    }
  })
}

export const buildEvents = (tracks: Track[]) =>
  tracks.slice(0, 4).map((track, index) => ({
    title: `${track.artist} live`,
    city: eventCities[index % eventCities.length],
    date: formatDate(-(index + 18)),
    venue: eventVenues[index % eventVenues.length],
  }))
