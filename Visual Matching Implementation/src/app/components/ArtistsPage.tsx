import { Track } from '../App'
import { useState, useEffect } from 'react'
import { PlaylistPopover } from './PlaylistPopover'
import { useArtistSearch, useArtistPulse, useDiscovery } from '../hooks/useArtistData'

const HeartOutlineIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#78716c" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#C6FF33" />
  </svg>
)

const SearchIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.6 }}>
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
)

const RadioIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.8 }}>
    <circle cx="12" cy="12" r="2"></circle>
    <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49m11.31-2.82a10 10 0 0 1 0 14.14m-14.14 0a10 10 0 0 1 0-14.14"></path>
  </svg>
)

export interface ArtistData {
  id: string;
  name: string;
  genre: string;
  cover: string;
  banner: string;
  followers: string;
  monthlyListeners: string;
  songsCount: number;
  trendingPercentage: string;
  bio: string;
  popularTracks: Track[];
  albums: { id: string; title: string; year: string; cover: string }[];
  singles: { id: string; title: string; year: string; cover: string }[];
  mostQuotedLyrics: { text: string; song: string; saves: string; saveCount: number }[];
  lyricalDNA: { label: string; value: number; color: string }[];
  timeline: { year: string; title: string; desc: string }[];
  relatedArtists: string[];
  activeYears?: string;
  country?: string;
}

export const artistsList: ArtistData[] = [
  {
    id: 'sabrina-carpenter',
    name: 'Sabrina Carpenter',
    genre: 'Pop / Dance',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    followers: '34.2M Followers',
    monthlyListeners: '64.2M',
    songsCount: 85,
    trendingPercentage: '+18% this week',
    bio: 'Sabrina Annlynn Carpenter is an American singer and actress. She first gained recognition for her starring role in the Disney Channel series Girl Meets World.',
    popularTracks: [
      { "id": "yt_oqpyR015p8o", "title": "Espresso", "artist": "Sabrina Carpenter", "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300", "album": "Short n' Sweet", "duration": "2:55", "videoId": "oqpyR015p8o", "source": "youtube" },
      { "id": "yt_cPbqDmaIbOM", "title": "Please Please Please", "artist": "Sabrina Carpenter", "cover": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300", "album": "Short n' Sweet", "duration": "3:06", "videoId": "cPbqDmaIbOM", "source": "youtube" }
    ],
    albums: [
      { id: '1', title: "Short n' Sweet", year: '2024', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300' }
    ],
    singles: [
      { id: 'skin', title: "Skin", year: '2021', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300' }
    ],
    mostQuotedLyrics: [
      { text: "Now he's thinkin' 'bout me every night, oh...", song: "Espresso", saves: "14.2K", saveCount: 14200 }
    ],
    lyricalDNA: [
      { label: "Love", value: 80, color: "#C6FF33" },
      { label: "Nostalgia", value: 65, color: "#38bdf8" }
    ],
    timeline: [
      { year: "2024", title: "Global Domination", desc: "Hit #1 globally with Espresso and Please Please Please." }
    ],
    relatedArtists: ['billie-eilish', 'the-weeknd', 'newjeans']
  },
  {
    id: 'arijit-singh',
    name: 'Arijit Singh',
    genre: 'Bollywood / Classical',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    followers: '85.4M Followers',
    monthlyListeners: '85.4M',
    songsCount: 427,
    trendingPercentage: '+12% this week',
    bio: 'Arijit Singh is an Indian playback singer and music composer.',
    popularTracks: [
      { "id": "yt_VAdGW7QDJiU", "title": "Chaleya", "artist": "Arijit Singh", "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300", "album": "Jawan", "duration": "3:20", "videoId": "VAdGW7QDJiU", "source": "youtube" },
      { "id": "yt_K3Qzzggn--s", "title": "Sajni", "artist": "Arijit Singh", "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300", "album": "Laapataa Ladies", "duration": "2:50", "videoId": "K3Qzzggn--s", "source": "youtube" }
    ],
    albums: [
      { id: 'jawan-ost', title: "Jawan (OST)", year: '2023', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300' }
    ],
    singles: [
      { id: 'sajni-s', title: "Sajni (Single Edition)", year: '2024', cover: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300' }
    ],
    mostQuotedLyrics: [
      { text: "Tu hi hai aashiqui, tu hi hai awaargi...", song: "Tum Hi Ho", saves: "12.4K", saveCount: 12492 }
    ],
    lyricalDNA: [
      { label: "Love", value: 90, color: "#C6FF33" },
      { label: "Heartbreak", value: 85, color: "#f43f5e" }
    ],
    timeline: [
      { year: "2013", title: "Tum Hi Ho Breakthrough", desc: "Gained national fame with Aashiqui 2." }
    ],
    relatedArtists: ['karan-aujla', 'the-weeknd']
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    genre: 'R&B / Synthwave',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1200',
    followers: '68.9M Followers',
    monthlyListeners: '114.5M',
    songsCount: 198,
    trendingPercentage: '+5% this week',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter and record producer.',
    popularTracks: [
      { "id": "yt_hYnBv4zHqSM", "title": "Lose Control", "artist": "Teddy Swims", "cover": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300", "album": "I've Tried Everything", "duration": "3:30", "videoId": "hYnBv4zHqSM", "source": "youtube" }
    ],
    albums: [
      { id: '2', title: 'Starboy', year: '2016', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300' }
    ],
    singles: [
      { id: 'bl', title: 'Blinding Lights', year: '2019', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300' }
    ],
    mostQuotedLyrics: [
      { text: "I said, ooh, I'm blinded by the lights...", song: "Blinding Lights", saves: "22.5K", saveCount: 22500 }
    ],
    lyricalDNA: [
      { label: "Heartbreak", value: 80, color: "#f43f5e" }
    ],
    timeline: [
      { year: "2020", title: "Blinding Lights Record", desc: "Longest-charting song of all time." }
    ],
    relatedArtists: ['billie-eilish', 'sabrina-carpenter']
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    genre: 'K-Pop / R&B',
    cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=1200',
    followers: '14.5M Followers',
    monthlyListeners: '22.8M',
    songsCount: 35,
    trendingPercentage: '+22% this week',
    bio: 'NewJeans is a South Korean girl group formed by ADOR.',
    popularTracks: [
      { "id": "yt_Q3K0TOv7D-o", "title": "How Sweet", "artist": "NewJeans", "cover": "https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300", "album": "How Sweet", "duration": "3:39", "videoId": "Q3K0TOv7D-o", "source": "youtube" }
    ],
    albums: [
      { id: '5', title: 'How Sweet', year: '2024', cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300' }
    ],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  },
  {
    id: 'karan-aujla',
    name: 'Karan Aujla',
    genre: 'Punjabi / Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200',
    followers: '14.2M Followers',
    monthlyListeners: '14.2M',
    songsCount: 120,
    trendingPercentage: '+15% this week',
    bio: 'Karan Aujla is a Punjabi singer and rapper.',
    popularTracks: [],
    albums: [],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    genre: 'Alternative / Pop',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200',
    followers: '65.2M Followers',
    monthlyListeners: '98.5M',
    songsCount: 92,
    trendingPercentage: '+10% this week',
    bio: 'Billie Eilish Pirate Baird O\'Connell is an American singer-songwriter.',
    popularTracks: [],
    albums: [],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    genre: 'Hip-Hop / Rap',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    followers: '28.9M Followers',
    monthlyListeners: '62.4M',
    songsCount: 145,
    trendingPercentage: '+35% this week',
    bio: 'Kendrick Lamar Duckworth is an American rapper and songwriter.',
    popularTracks: [],
    albums: [],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  },
  {
    id: 'aespa',
    name: 'aespa',
    genre: 'K-Pop / EDM',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200',
    followers: '10.2M Followers',
    monthlyListeners: '14.5M',
    songsCount: 28,
    trendingPercentage: '+20% this week',
    bio: 'aespa is a South Korean girl group.',
    popularTracks: [],
    albums: [],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  },
  {
    id: 'krsna',
    name: 'Kr$na',
    genre: 'Hip-Hop / Rap',
    cover: 'https://images.unsplash.com/photo-1549830729-af67a421693a?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1549830729-af67a421693a?q=80&w=1200',
    followers: '4.5M Followers',
    monthlyListeners: '4.5M',
    songsCount: 65,
    trendingPercentage: '+25% this week',
    bio: 'Krishna Kaul, known professionally as Kr$na, is an Indian rapper from New Delhi.',
    popularTracks: [],
    albums: [],
    singles: [],
    mostQuotedLyrics: [],
    lyricalDNA: [],
    timeline: [],
    relatedArtists: []
  }
]

interface AnalyticsData {
  artistEssence: {
    primaryEmotion: string;
    secondaryEmotion: string;
    energy: number;
  };
  lyricalDNA: Record<string, number>;
  mostQuotedLyrics: {
    quote: string;
    song: string;
    saveCount: number;
    shareCount: number;
  }[];
  lyricsWall: {
    quote: string;
    song: string;
    album: string;
    emotion: string;
    saveCount: number;
    shareCount: number;
  }[];
  timeline: {
    year: string;
    title: string;
    desc: string;
  }[];
}

interface ArtistsPageProps {
  activeArtistId: string | null;
  onSelectArtist: (id: string | null) => void;
  onPlayTrack: (track: Track, queue: Track[]) => void;
  likedTrackIds: string[];
  onToggleLike: (id: string) => void;
  currentTrack: Track;
  onNavigate: (page: string, artistId: string | null, albumId: string | null) => void;
  followedArtistIds: string[];
  onToggleFollow: (id: string) => void;
}

const emotionColors: Record<string, string> = {
  love: "#C6FF33",
  heartbreak: "#f43f5e",
  nostalgia: "#38bdf8",
  ambition: "#a855f7",
  motivation: "#22c55e",
  spirituality: "#eab308",
  loneliness: "#64748b",
  freedom: "#06b6d4",
  rebellion: "#ef4444",
  selfReflection: "#ec4899"
};

export function ArtistsPage({
  activeArtistId,
  onSelectArtist,
  onPlayTrack,
  likedTrackIds,
  onToggleLike,
  currentTrack,
  onNavigate,
  followedArtistIds = [],
  onToggleFollow
}: ArtistsPageProps) {
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [savedQuotes, setSavedQuotes] = useState<Record<string, boolean>>({})

  // Emotional filter selection
  const [selectedDnaCategory, setSelectedDnaCategory] = useState<string | null>(null)

  // Discovery Hub lists mapped from hook
  const [discoveryData, setDiscoveryData] = useState<{
    trending: ArtistData[];
    popular_in_india: ArtistData[];
    similar_to_taste: ArtistData[];
    mood_categories: Record<string, ArtistData[]>;
  } | null>(null)

  // 1. Consume Custom Data Hooks
  const { pulseData } = useArtistPulse()
  const { discoveryData: hookDiscoveryData, loading: loadingDiscovery } = useDiscovery()

  // 2. Pulse Bar Hover Tooltip State
  const [hoveredEmotion, setHoveredEmotion] = useState<string | null>(null)
  const [hoverData, setHoverData] = useState<any>(null)
  const [loadingHover, setLoadingHover] = useState(false)

  // 3. Global Quote Wall state
  const [selectedQuoteEmotion, setSelectedQuoteEmotion] = useState<string | null>(null)
  const [localSavedQuotes, setLocalSavedQuotes] = useState<Record<string, { saved: boolean, count: number }>>({})


  // 5. Fetch Hover quotes
  useEffect(() => {
    if (!hoveredEmotion) {
      setHoverData(null)
      return
    }
    let isMounted = true
    setLoadingHover(true)
    fetch(`/api/artists/emotion/${hoveredEmotion}/quotes`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setHoverData(data)
          setLoadingHover(false)
        }
      })
      .catch(() => {
        if (isMounted) setLoadingHover(false)
      })
    return () => {
      isMounted = false
    }
  }, [hoveredEmotion])



  // Helper: Optimistic Save Quote
  const handleToggleSaveQuote = async (lyricId: string, initialCount: number) => {
    const currentState = localSavedQuotes[lyricId] || { saved: false, count: initialCount }
    const nextSaved = !currentState.saved
    const nextCount = currentState.count + (nextSaved ? 1 : -1)

    setLocalSavedQuotes(prev => ({
      ...prev,
      [lyricId]: { saved: nextSaved, count: nextCount }
    }))

    try {
      await fetch(`/api/artists/lyrics/${lyricId}/save`, { method: 'POST' })
    } catch (err) {
      console.error("Failed to save lyric quote:", err)
      // Revert state on error
      setLocalSavedQuotes(prev => ({
        ...prev,
        [lyricId]: { saved: !nextSaved, count: currentState.count }
      }))
    }
  }

  // 6. Map Discovery Data Hook to Frontend State
  useEffect(() => {
    if (hookDiscoveryData) {
      const mappedTrending = (hookDiscoveryData.trending || []).map((a: any) => ({
        id: a.artistId,
        name: a.name,
        genre: a.genres.join(" / "),
        cover: a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
        banner: a.banner || a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
        followers: "Verified",
        monthlyListeners: "Trending",
        songsCount: 10,
        trendingPercentage: "+15% this week",
        bio: a.bio,
        popularTracks: [],
        albums: a.albums || [],
        singles: a.singles || [],
        mostQuotedLyrics: [],
        lyricalDNA: [],
        timeline: [],
        relatedArtists: [],
        activeYears: a.activeYears || "2010 - Present",
        country: a.country || "Global"
      }))

      const mappedPopular = (hookDiscoveryData.popular_in_india || []).map((a: any) => ({
        id: a.artistId,
        name: a.name,
        genre: a.genres.join(" / "),
        cover: a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
        banner: a.banner || a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
        followers: "Verified",
        monthlyListeners: "Popular",
        songsCount: 10,
        trendingPercentage: "+10% this week",
        bio: a.bio,
        popularTracks: [],
        albums: a.albums || [],
        singles: a.singles || [],
        mostQuotedLyrics: [],
        lyricalDNA: [],
        timeline: [],
        relatedArtists: [],
        activeYears: a.activeYears || "2015 - Present",
        country: a.country || "India"
      }))

      const mappedTaste: any[] = []

      const mappedMoods: Record<string, ArtistData[]> = {}
      Object.entries(hookDiscoveryData.mood_categories || {}).forEach(([moodName, items]: [string, any]) => {
        mappedMoods[moodName] = items.map((a: any) => ({
          id: a.artistId,
          name: a.name,
          genre: a.genres.join(" / "),
          cover: a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
          banner: a.banner || a.imageUrl || a.cover || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
          followers: "Verified",
          monthlyListeners: "Popular",
          songsCount: 10,
          trendingPercentage: "+5% this week",
          bio: a.bio,
          popularTracks: [],
          albums: a.albums || [],
          singles: a.singles || [],
          mostQuotedLyrics: [],
          lyricalDNA: [],
          timeline: [],
          relatedArtists: []
        }))
      })

      setDiscoveryData({
        trending: mappedTrending,
        popular_in_india: mappedPopular,
        similar_to_taste: mappedTaste,
        mood_categories: mappedMoods
      })
    }
  }, [hookDiscoveryData])

  // Load selected artist profile and handle background aggregation progress updates
  useEffect(() => {
    if (!activeArtistId) {
      setArtist(null)
      setAnalytics(null)
      return
    }

    let isMounted = true
    let pollInterval: any = null

    const mapAnalyticsData = (analData: any): AnalyticsData => {
      return {
        artistEssence: {
          primaryEmotion: analData.dna?.topThemes?.[0] || "romantic",
          secondaryEmotion: analData.dna?.topThemes?.[1] || "melancholy",
          energy: analData.dna?.intensity || 75
        },
        lyricalDNA: analData.dna?.emotionProfile || {
          euphoric: 10, hopeful: 10, nostalgic: 10, melancholy: 10, dark: 10, angry: 10, defiant: 10, romantic: 30
        },
        mostQuotedLyrics: (analData.topQuotedLyrics || []).map((quoteStr: string, index: number) => {
          const songs = ["Yellow", "Fix You", "The Scientist", "Viva La Vida"];
          return {
            quote: quoteStr,
            song: songs[index % songs.length],
            saveCount: 15000 - index * 2000,
            shareCount: 450 - index * 50
          };
        }),
        lyricsWall: (analData.topQuotedLyrics || []).map((quoteStr: string, index: number) => {
          const songs = ["Yellow", "Fix You", "The Scientist", "Viva La Vida"];
          const albums = ["Parachutes", "X&Y", "A Rush of Blood to the Head", "Viva la Vida"];
          const emotions = ["romantic", "melancholy", "nostalgic", "euphoric"];
          return {
            quote: quoteStr,
            song: songs[index % songs.length],
            album: albums[index % albums.length],
            emotion: emotions[index % emotions.length],
            saveCount: 8200 - index * 1500
          };
        }),
        timeline: (analData.listenerJourney || []).map((j: string, index: number) => {
          const years = ["2000", "2002", "2005", "2008"];
          const titles = ["Yellow Release", "In My Place", "Fix You Anthem", "Viva La Vida"];
          const descs = [
            "Yellow is released, putting the band on the global map.",
            "In My Place wins Grammy, cementing their alternative rock status.",
            "Fix You is released, becoming one of the most iconic anthems of the decade.",
            "Viva La Vida reaches number one worldwide, winning multiple awards."
          ];
          return {
            year: years[index % years.length],
            title: titles[index % titles.length],
            desc: descs[index % descs.length]
          };
        })
      };
    };

    async function loadProfile() {
      setLoading(true)
      try {
        const res = await fetch(`/api/artists/${activeArtistId}`)
        if (!res.ok) throw new Error("Failed fetching profile")
        const data = await res.json()
        if (!isMounted) return

        const mappedActiveYears = typeof data.activeYears === 'object' && data.activeYears
          ? `${data.activeYears.start || '1996'} - ${data.activeYears.end || 'Present'}`
          : (data.activeYears || "2010 - Present");

        // Load songs
        let artistSongs: Track[] = []
        try {
          const resSongs = await fetch(`/api/artists/${activeArtistId}/songs`)
          if (resSongs.ok) {
            const songsData = await resSongs.json()
            const rawSongs = songsData.songs || []
            artistSongs = rawSongs.map((t: any) => ({
              id: t.songId || `song_${t.title}`,
              title: t.title,
              artist: data.name,
              album: t.album || 'Single',
              duration: t.duration || '3:30',
              cover: t.cover || t.imageUrl || data.cover || data.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
              audioUrl: t.previewUrl || t.audioUrl || ''
            }))
          }
        } catch (e) {
          console.error("Failed fetching artist songs:", e)
        }

        const mapped: ArtistData = {
          id: data.artistId,
          name: data.name,
          genre: (data.genres || []).join(" / "),
          cover: data.cover || data.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
          banner: data.banner || data.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
          followers: "Verified",
          monthlyListeners: "Explore",
          songsCount: (data.albums || []).length * 10 || artistSongs.length || 15,
          trendingPercentage: "+10%",
          bio: data.bio,
          popularTracks: artistSongs,
          albums: data.albums || [],
          singles: data.singles || [],
          mostQuotedLyrics: [],
          lyricalDNA: [],
          timeline: [],
          relatedArtists: [],
          activeYears: mappedActiveYears,
          country: data.country || "Global"
        }
        setArtist(mapped)

        // Load analytics
        const resAnalytics = await fetch(`/api/artists/${activeArtistId}/analytics`)
        if (resAnalytics.ok) {
          const analData = await resAnalytics.json()
          setAnalytics(mapAnalyticsData(analData))
        }

        // If status is aggregating, poll until completed
        if (data.aggregationStatus === 'seeded' || data.aggregationStatus === 'aggregating') {
          pollInterval = setInterval(async () => {
            const pollRes = await fetch(`/api/artists/${activeArtistId}`)
            if (pollRes.ok) {
              const pollData = await pollRes.json()
              if (isMounted) {
                const polledActiveYears = typeof pollData.activeYears === 'object' && pollData.activeYears
                  ? `${pollData.activeYears.start || '1996'} - ${pollData.activeYears.end || 'Present'}`
                  : (pollData.activeYears || "2010 - Present");

                // Try fetching songs again if empty
                let polledSongs: Track[] = artistSongs
                if (polledSongs.length === 0) {
                  try {
                    const resSongs = await fetch(`/api/artists/${activeArtistId}/songs`)
                    if (resSongs.ok) {
                      const songsData = await resSongs.json()
                      const rawSongs = songsData.songs || []
                      polledSongs = rawSongs.map((t: any) => ({
                        id: t.songId || `song_${t.title}`,
                        title: t.title,
                        artist: pollData.name,
                        album: t.album || 'Single',
                        duration: t.duration || '3:30',
                        cover: t.cover || t.imageUrl || pollData.cover || pollData.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
                        audioUrl: t.previewUrl || t.audioUrl || ''
                      }))
                    }
                  } catch (e) { }
                }

                const polledMapped: ArtistData = {
                  id: pollData.artistId,
                  name: pollData.name,
                  genre: (pollData.genres || []).join(" / "),
                  cover: pollData.cover || pollData.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
                  banner: pollData.banner || pollData.imageUrl || "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
                  followers: "Verified",
                  monthlyListeners: "Explore",
                  songsCount: (pollData.albums || []).length * 10 || polledSongs.length || 15,
                  trendingPercentage: "+10%",
                  bio: pollData.bio,
                  popularTracks: polledSongs,
                  albums: pollData.albums || [],
                  singles: pollData.singles || [],
                  mostQuotedLyrics: [],
                  lyricalDNA: [],
                  timeline: [],
                  relatedArtists: [],
                  activeYears: polledActiveYears,
                  country: pollData.country || "Global"
                }
                setArtist(polledMapped)
                if (pollData.aggregationStatus === 'completed' || pollData.aggregationStatus === 'failed') {
                  if (pollInterval) clearInterval(pollInterval)
                  // Reload analytics to get enriched text
                  const finalRes = await fetch(`/api/artists/${activeArtistId}/analytics`)
                  if (finalRes.ok) {
                    const finalAnalData = await finalRes.json()
                    setAnalytics(mapAnalyticsData(finalAnalData))
                  }
                }
              }
            }
          }, 2000)
        }
      } catch (err) {
        console.error("Error loading artist data:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadProfile()

    return () => {
      isMounted = false
      if (pollInterval) clearInterval(pollInterval)
    }
  }, [activeArtistId])

  // Triggers Playback of Artist popular songs
  const handlePlayArtistSongs = (artistItem: any) => {
    const quotes = artist?.id === artistItem.id ? (analytics?.mostQuotedLyrics || []) : []
    if (quotes.length > 0) {
      const tracksList: Track[] = quotes.map((q, idx) => ({
        id: `yt_track_${artistItem.id}_${idx}`,
        title: q.song,
        artist: artistItem.name,
        cover: artistItem.cover,
        album: "Popular Track",
        duration: "3:30",
        source: "youtube",
        videoId: "oqpyR015p8o"
      }))
      onPlayTrack(tracksList[0], tracksList)
    } else {
      fetch(`/api/artists/${artistItem.id}/songs`)
        .then(res => res.json())
        .then(tracks => {
          if (tracks && tracks.length > 0) {
            const mappedTracks = tracks.map((t: any) => ({
              id: t.songId || `song_${t.title}`,
              title: t.title,
              artist: artistItem.name,
              album: t.album || 'Single',
              duration: t.duration || '3:30',
              cover: artistItem.cover,
              audioUrl: t.previewUrl || ''
            }))
            onPlayTrack(mappedTracks[0], mappedTracks)
          }
        })
        .catch(err => console.error("Error playing artist songs:", err))
    }
  }

  // Fetches radio queue from backend and plays immediately
  const handlePlayArtistRadio = async (artistId: string) => {
    try {
      const res = await fetch(`/api/artists/${artistId}/radio`)
      if (res.ok) {
        const data = await res.json()
        const queue = data.radio_queue || []
        if (queue.length > 0) {
          onPlayTrack(queue[0], queue)
        }
      }
    } catch (err) {
      console.error("Failed generating artist radio:", err)
    }
  }

  const handleCopyText = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 2000)
  }

  // RENDER LOADING PROFILE
  if (loading && !artist) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4 bg-[#0f0f10]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#C6FF33] animate-spin" />
        </div>
        <span className="text-white/60 text-xs font-bold uppercase tracking-[2px] animate-pulse">
          Opening Universe...
        </span>
      </div>
    )
  }

  // RENDER SELECTED PROFILE
  if (artist) {
    // Generate dynamic songs list representing popular tracks from quotes & wall data
    let trackCatalog: Track[] = []
    if (analytics) {
      const songsSet = new Set<string>()
      const items = [...analytics.mostQuotedLyrics.map(q => q.song), ...analytics.lyricsWall.map(w => w.song)]
      items.forEach(title => {
        if (!songsSet.has(title)) {
          songsSet.add(title)
          trackCatalog.push({
            id: `yt_track_${artist.id}_${title.toLowerCase().replace(/\s+/g, '_')}`,
            title: title,
            artist: artist.name,
            cover: artist.cover,
            album: analytics.lyricsWall.find(w => w.song === title)?.album || "Single",
            duration: "3:15",
            source: "youtube",
            videoId: "VAdGW7QDJiU"
          })
        }
      })
    }

    // Filter tracks dynamically by the selected emotion DNA bar
    const filteredTracks = selectedDnaCategory
      ? trackCatalog.filter(t => {
        // Mock theme matching: match if song maps to current emotion
        const matchesWall = analytics?.lyricsWall.some(w => w.song === t.title && w.emotion.toLowerCase() === selectedDnaCategory.toLowerCase())
        return matchesWall || (t.title.length % 2 === 0 && selectedDnaCategory === 'nostalgia') || (t.title.length % 2 !== 0 && selectedDnaCategory === 'rebellion')
      })
      : trackCatalog

    return (
      <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
        {/* Back navigation */}
        <button
          onClick={() => onSelectArtist(null)}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6 text-xs uppercase font-bold tracking-wider cursor-pointer"
        >
          ← Back to Artist Universe
        </button>

        {/* 1. Artist Header Banner */}
        <div className="relative rounded-[24px] overflow-hidden mb-8" style={{ height: 380, border: '1px solid rgba(255,255,255,0.05)', boxShadow: 'inset 0 0 100px rgba(0,0,0,0.8)' }}>
          <div className="absolute inset-0">
            <img src={artist.banner} alt={artist.name} className="w-full h-full object-cover opacity-30 blur-sm scale-105" />
          </div>
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #0f0f10 0%, rgba(15,15,16,0.4) 60%, rgba(0,0,0,0) 100%)' }} />

          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
            <div className="flex items-end gap-6">
              <div className="rounded-[20px] overflow-hidden border-2 border-[#C6FF33] shadow-2xl flex-shrink-0" style={{ width: 140, height: 140 }}>
                <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <span className="bg-[#C6FF33]/10 text-[#C6FF33] border border-[#C6FF33]/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider">VERIFIED LYRICA ARTIST</span>
                </div>
                <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 56, color: 'white', lineHeight: 1.1 }}>{artist.name}</h1>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">
                  {artist.activeYears} • {artist.country}
                </span>

                {/* Artist Essence Indicator inside Header */}
                {analytics?.artistEssence && (
                  <div className="mt-2 flex items-center gap-4 bg-white/5 border border-white/5 rounded-xl px-4 py-2 w-fit">
                    <div className="flex flex-col">
                      <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Primary Vibe</span>
                      <span className="text-white text-xs font-bold">{analytics.artistEssence.primaryEmotion}</span>
                    </div>
                    <div className="h-6 w-[1px] bg-white/10" />
                    <div className="flex flex-col">
                      <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider">Intensity</span>
                      <span className="text-[#C6FF33] text-xs font-bold">{analytics.artistEssence.energy}%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handlePlayArtistSongs(artist)}
                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 flex items-center gap-2 cursor-pointer shadow-lg bg-[#C6FF33] text-black"
              >
                Play Songs
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFollow(artist.id);
                }}
                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider border transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: followedArtistIds.includes(artist.id) ? '#C6FF33' : 'transparent',
                  color: followedArtistIds.includes(artist.id) ? 'black' : 'white',
                  borderColor: followedArtistIds.includes(artist.id) ? '#C6FF33' : 'rgba(255,255,255,0.3)',
                }}
              >
                {followedArtistIds.includes(artist.id) ? 'Following' : 'Follow'}
              </button>

              <button
                onClick={() => handlePlayArtistRadio(artist.id)}
                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 transition-all border border-white/10 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 text-white"
              >
                <RadioIcon /> Artist Radio
              </button>
            </div>
          </div>
        </div>

        {/* PRIORITIZED HIERARCHY LAYOUT */}
        <div className="flex flex-col gap-12 mt-10">

          {/* 2. Most Quoted Lyrics */}
          {analytics?.mostQuotedLyrics && analytics.mostQuotedLyrics.length > 0 && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Fans Signature Quotes</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Most Quoted Lyrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.mostQuotedLyrics.map((quoteItem, idx) => {
                  const isSaved = savedQuotes[quoteItem.quote];
                  return (
                    <div
                      key={idx}
                      className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col justify-between gap-6"
                    >
                      <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 18, color: 'white', lineHeight: 1.5 }}>
                        "{quoteItem.quote}"
                      </p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                        <span className="text-stone-400 text-xs font-semibold">— {quoteItem.song}</span>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setSavedQuotes(prev => ({ ...prev, [quoteItem.quote]: !prev[quoteItem.quote] }))}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold border transition-all cursor-pointer"
                            style={{
                              background: isSaved ? '#C6FF33' : 'rgba(255,255,255,0.05)',
                              color: isSaved ? 'black' : 'white',
                              borderColor: isSaved ? '#C6FF33' : 'rgba(255,255,255,0.1)'
                            }}
                          >
                            {isSaved ? '✓ Saved' : 'Save'} ({((quoteItem.saveCount + (isSaved ? 1 : 0)) / 1000).toFixed(1)}k)
                          </button>
                          <button
                            onClick={() => handleCopyText(quoteItem.quote, idx)}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-white cursor-pointer"
                          >
                            {copiedIdx === idx ? 'Copied' : 'Share'}
                          </button>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 3. Lyrics Wall (Pinterest-style Masonry layout) */}
          {analytics?.lyricsWall && analytics.lyricsWall.length > 0 && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Pinterest-style Snippet Gallery</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Lyrics Wall</h2>
              </div>
              <div
                style={{
                  columnCount: window.innerWidth > 768 ? 3 : 1,
                  columnGap: '20px',
                }}
              >
                {analytics.lyricsWall.map((wallItem, idx) => {
                  const color = emotionColors[wallItem.emotion.toLowerCase()] || "#C6FF33"
                  return (
                    <div
                      key={idx}
                      className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all mb-5 break-inside-avoid flex flex-col gap-4"
                      style={{ display: 'inline-block', width: '100%' }}
                    >
                      <div className="flex justify-between items-center">
                        <span
                          className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                          style={{ color: color, background: `${color}15`, border: `1px solid ${color}30` }}
                        >
                          {wallItem.emotion}
                        </span>
                        <span className="text-[10px] font-mono text-stone-500">{(wallItem.saveCount / 1000).toFixed(1)}k saves</span>
                      </div>
                      <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 16, color: 'white', lineHeight: 1.5 }}>
                        "{wallItem.quote}"
                      </p>
                      <div className="flex flex-col border-t border-white/5 pt-3 mt-1">
                        <span className="text-white text-xs font-semibold">{wallItem.song}</span>
                        <span className="text-stone-500 text-[10px]">{wallItem.album}</span>
                      </div>
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                        <button className="text-[10px] font-bold text-[#C6FF33] hover:underline cursor-pointer">Save Snippet</button>
                        <button className="text-[10px] font-bold text-stone-400 hover:text-white cursor-pointer">Add to Collection</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 4. Artist Essence */}
          {analytics?.artistEssence && (
            <div className="p-8 rounded-[24px] border border-white/5 bg-gradient-to-br from-white/[0.02] to-transparent">
              <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Emotional Identity Index</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4, marginBottom: 24 }}>Artist Essence</h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Primary Tone</span>
                  <div className="text-2xl font-bold text-white mt-1">{analytics.artistEssence.primaryEmotion}</div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    This represents the dominant emotional chord that resonates across the artist's lyrical index.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Secondary Tone</span>
                  <div className="text-2xl font-bold text-white mt-1">{analytics.artistEssence.secondaryEmotion}</div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    A secondary layer adding complexity, narrative friction, and depth to their songs.
                  </p>
                </div>
                <div className="p-5 rounded-xl border border-white/5 bg-white/[0.01]">
                  <span className="text-[10px] uppercase font-bold text-stone-500">Narrative Energy</span>
                  <div className="text-2xl font-bold text-[#C6FF33] mt-1">{analytics.artistEssence.energy}%</div>
                  <p className="text-xs text-stone-500 mt-2 leading-relaxed">
                    Quantifies the kinetic power, dynamic changes, and emotional urgency of their lyrics.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 5. Lyrical DNA */}
          {analytics?.lyricalDNA && (
            <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.01]">
              <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Interactive Theme Navigation</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4, marginBottom: 20 }}>Lyrical DNA</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analytics.lyricalDNA).map(([key, val]) => {
                  const color = emotionColors[key.toLowerCase()] || "#C6FF33"
                  const isSelected = selectedDnaCategory === key
                  return (
                    <div
                      key={key}
                      onClick={() => setSelectedDnaCategory(isSelected ? null : key)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${isSelected ? 'border-white bg-white/5 scale-[1.01]' : 'border-white/5 bg-white/[0.01] hover:bg-white/5'}`}
                    >
                      <div className="flex justify-between items-center text-xs font-bold mb-2">
                        <span className="text-white capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <span style={{ color: color }}>{val}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${val}%`, backgroundColor: color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* 6. Top Songs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white' }}>Top Songs</h2>
              {selectedDnaCategory && (
                <button
                  onClick={() => setSelectedDnaCategory(null)}
                  className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#C6FF33] text-black border border-[#C6FF33] cursor-pointer"
                >
                  Filtered by: {selectedDnaCategory} (Reset)
                </button>
              )}
            </div>

            {filteredTracks.length > 0 ? (
              <div className="flex flex-col gap-2 bg-white/[0.01] p-2 rounded-2xl border border-white/5">
                {filteredTracks.map((track, idx) => {
                  const isCurrentPlaying = currentTrack.id === track.id
                  const isLiked = likedTrackIds.includes(track.id)
                  const numStr = String(idx + 1).padStart(2, '0')

                  return (
                    <div
                      key={track.id}
                      onClick={() => onPlayTrack(track, filteredTracks)}
                      className="flex items-center justify-between px-4 rounded-[12px] hover:bg-white/5 transition-all cursor-pointer group"
                      style={{ height: 60, background: isCurrentPlaying ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 12, color: isCurrentPlaying ? '#C6FF33' : 'var(--text-muted)', width: 20, flexShrink: 0 }}>
                          {numStr}
                        </span>
                        <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: isCurrentPlaying ? '#C6FF33' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {track.title}
                          </span>
                          <span className="text-stone-500 text-[11px]">{track.artist}</span>
                        </div>
                      </div>
                      <div className="flex-1 mx-4 hidden md:block">
                        <span className="text-stone-400 text-xs truncate block">{track.album || 'Single'}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-stone-400 text-xs font-mono">{track.duration}</span>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleLike(track.id);
                          }}
                          className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer"
                        >
                          {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                        </button>

                        <div onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center">
                          <PlaylistPopover track={track} />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-stone-500 text-sm italic py-8 bg-white/[0.01] rounded-2xl border border-white/5 text-center">
                No songs matching the filtered category theme.
              </div>
            )}
          </div>

          {/* 7. Albums & 8. Singles */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'white', marginBottom: 16 }}>Albums</h3>
              {artist.albums && artist.albums.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {artist.albums.map((alb) => (
                    <div
                      key={alb.id}
                      onClick={() => onNavigate('albums', null, alb.id)}
                      className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all text-left cursor-pointer"
                    >
                      <img src={alb.cover} alt={alb.title} className="w-full aspect-square rounded-lg object-cover mb-2" />
                      <span className="text-white text-xs font-bold truncate block">{alb.title}</span>
                      <span className="text-stone-500 text-[10px]">{alb.year}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-stone-500 text-xs italic py-4">No albums listed.</div>
              )}
            </div>

            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'white', marginBottom: 16 }}>Singles & EPs</h3>
              {artist.singles && artist.singles.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {artist.singles.map((sin) => (
                    <div
                      key={sin.id}
                      className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all text-left cursor-pointer"
                    >
                      <img src={sin.cover} alt={sin.title} className="w-full aspect-square rounded-lg object-cover mb-2" />
                      <span className="text-white text-xs font-bold truncate block">{sin.title}</span>
                      <span className="text-stone-500 text-[10px]">{sin.year}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-stone-500 text-xs italic py-4">No singles listed.</div>
              )}
            </div>
          </div>

          {/* 9. Timeline */}
          {analytics?.timeline && analytics.timeline.length > 0 && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Milestones & History</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Career Timeline</h2>
              </div>
              <div className="relative pl-6 border-l border-white/10 flex flex-col gap-6 ml-2 py-2">
                {analytics.timeline.map((m, idx) => (
                  <div key={idx} className="relative">
                    <div className="absolute -left-[30px] top-1.5 w-2.5 h-2.5 rounded-full bg-[#C6FF33]" style={{ boxShadow: '0 0 8px #C6FF33' }} />
                    <span className="text-[10px] font-mono font-bold text-[#C6FF33] block mb-0.5">{m.year}</span>
                    <h4 className="text-white text-xs font-bold mb-1">{m.title}</h4>
                    <p className="text-stone-500 text-[11px] leading-relaxed">{m.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bio Box */}
          <div className="rounded-[20px] p-6 border border-white/5 bg-white/[0.01] flex flex-col gap-3">
            <h4 className="text-[10px] uppercase font-bold text-stone-500">Artist Bio</h4>
            <p className="text-stone-400 text-xs leading-relaxed">{artist.bio}</p>
          </div>

        </div>
      </div>
    )
  }

  // RENDER DIRECTORY HUB (Default View)
  const handleViewProfile = (artistId: string) => {
    onSelectArtist(artistId)
  }

  if (loadingDiscovery) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[400px] gap-4 bg-[#0f0f10]">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-t-2 border-[#C6FF33] animate-spin" />
        </div>
        <span className="text-white/60 text-xs font-bold uppercase tracking-[2px] animate-pulse">
          Mapping Artist Universe...
        </span>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      {/* 1. HeroSection with spotlight artist + search */}
      {(() => {
        const spotlightArtist = discoveryData?.trending.find(a => a.id === 'taylor-swift') || discoveryData?.trending[0] || null;
        if (!spotlightArtist) return null;
        return (
          <div className="relative rounded-[24px] overflow-hidden mb-8 border border-white/5 shadow-2xl" style={{ height: 320 }}>
            {/* Spotlight background */}
            <div className="absolute inset-0">
              <img src={spotlightArtist.banner || spotlightArtist.cover} alt="" className="w-full h-full object-cover opacity-20 blur-[2px] scale-105" />
              <div className="absolute inset-0 bg-gradient-to-r from-stone-950 via-stone-950/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent" />
            </div>

            <div className="absolute inset-0 p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-10">
              {/* Editorial content */}
              <div className="flex flex-col justify-center max-w-lg">
                <span className="text-[#C6FF33] text-[10px] font-bold uppercase tracking-widest bg-[#C6FF33]/10 border border-[#C6FF33]/20 px-3 py-1 rounded-full w-fit mb-3">
                  EDITORIAL SPOTLIGHT
                </span>
                <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 44, color: 'white', lineHeight: 1.1 }}>
                  {spotlightArtist.name}
                </h1>
                <p className="text-stone-400 text-xs mt-2 leading-relaxed line-clamp-3">
                  {spotlightArtist.bio || "Explore this artist's unique emotional profiles, timelines, and lyrical universe insights."}
                </p>
                <div className="flex items-center gap-3 mt-4">
                  <button
                    onClick={() => handleViewProfile(spotlightArtist.id)}
                    className="px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 bg-[#C6FF33] text-black cursor-pointer"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handlePlayArtistSongs(spotlightArtist)}
                    className="px-5 py-2 rounded-full font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-white cursor-pointer hover:scale-105 active:scale-95"
                  >
                    Play Songs
                  </button>
                </div>
              </div>

              {/* Lyrica Search Universe Navigation Card */}
              <div
                className="relative p-6 rounded-2xl flex flex-col justify-center items-start gap-3 w-full max-w-sm flex-shrink-0"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  backdropFilter: 'blur(12px)'
                }}
              >
                <div className="flex items-center gap-2 text-[#C6FF33]">
                  <SearchIcon />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Lyrica Search Universe</span>
                </div>
                <h3 className="text-white text-base font-bold">Centralized Music Search</h3>
                <p className="text-stone-400 text-[11px] leading-relaxed">
                  Search across 10,000+ artists, tracks, and playlists on JioSaavn & YouTube Music.
                </p>
                <button
                  onClick={() => onNavigate('search', '', 'artists')}
                  className="mt-2 w-full py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-[#C6FF33] text-black hover:scale-[1.02] active:scale-95 transition-all duration-300 shadow-md cursor-pointer flex items-center justify-center gap-2"
                >
                  <span>Launch Search</span>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* 2. LyricalPulseBar Heatmap Strip */}
      <div className="relative mb-8 z-30">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Lyrical Pulse Heatmap</span>
          <span className="text-stone-500 text-[10px]">Real-time emotion distribution across all aggregated lyrics</span>
        </div>
        <div className="relative flex h-8 rounded-xl overflow-visible bg-stone-900 border border-white/5 p-1 gap-1">
          {Object.entries(pulseData).map(([emotion, count]) => {
            const total = Object.values(pulseData).reduce((a, b) => a + b, 0);
            const pct = total > 0 ? (count / total) * 100 : 12.5;
            const color = emotionColors[emotion.toLowerCase()] || "#C6FF33";
            return (
              <div
                key={emotion}
                onMouseEnter={() => setHoveredEmotion(emotion)}
                onMouseLeave={() => setHoveredEmotion(null)}
                onClick={() => {
                  setSelectedQuoteEmotion(emotion);
                  const el = document.getElementById("lyrics-wall-section");
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
                className="relative h-full rounded-lg cursor-pointer transition-all duration-300 hover:scale-[1.02] flex items-center justify-center group flex-1"
                style={{ width: `${pct}%`, backgroundColor: `${color}20`, border: `1px solid ${color}40` }}
              >
                <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-10 transition-opacity" style={{ backgroundColor: color }} />
                <span className="text-[9px] font-bold capitalize truncate px-1" style={{ color: color }}>
                  {emotion} ({pct.toFixed(0)}%)
                </span>

                {/* Hover Tooltip Card */}
                {hoveredEmotion === emotion && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 z-50 w-72 p-4 rounded-2xl border border-white/10 bg-stone-950/95 backdrop-blur-xl shadow-2xl text-left flex flex-col gap-3 animate-fade-in pointer-events-none">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-bold uppercase tracking-wider capitalize" style={{ color: color }}>
                        {emotion} Vibe
                      </span>
                      <span className="text-[10px] text-stone-500">{count} lyrics</span>
                    </div>

                    {loadingHover ? (
                      <div className="flex items-center gap-2 text-stone-500 text-[10px]">
                        <div className="w-3.5 h-3.5 border-2 border-stone-500 border-t-transparent rounded-full animate-spin" />
                        Loading insights...
                      </div>
                    ) : hoverData ? (
                      <>
                        {hoverData.topArtist && hoverData.topArtist.name !== "Unknown Artist" && (
                          <div className="flex items-center gap-2 bg-white/5 p-2 rounded-xl border border-white/5">
                            {hoverData.topArtist.cover && (
                              <img src={hoverData.topArtist.cover} className="w-6 h-6 rounded-lg object-cover" alt="" />
                            )}
                            <div className="flex flex-col min-w-0">
                              <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider leading-none">Top Artist</span>
                              <span className="text-white text-xs font-bold truncate leading-snug">{hoverData.topArtist.name}</span>
                            </div>
                          </div>
                        )}
                        {hoverData.quotes && hoverData.quotes.length > 0 ? (
                          <div className="flex flex-col gap-2">
                            <span className="text-[9px] text-stone-500 uppercase font-bold tracking-wider leading-none">Featured Quotes</span>
                            {hoverData.quotes.map((q: any, i: number) => (
                              <div key={i} className="flex flex-col border-l border-white/10 pl-2">
                                <span className="text-white text-xs italic font-serif leading-tight">"{q.quote}"</span>
                                <span className="text-[10px] text-stone-500 mt-0.5">— {q.song} ({q.artistName})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] text-stone-500 italic">No quotes available.</span>
                        )}
                      </>
                    ) : (
                      <span className="text-[10px] text-stone-500 italic">No data loaded.</span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {discoveryData && (
        <div className="flex flex-col gap-10">
          {/* 3. Trending Artists */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white' }}>Trending Artists</h2>
              <span className="text-[#C6FF33] text-[10px] font-bold uppercase tracking-wider">Top velocity this week</span>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {discoveryData.trending
                .map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleViewProfile(art.id)}
                    className="p-2.5 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col gap-2 group relative animate-fade-in"
                  >
                    <div className="w-full aspect-square rounded-lg overflow-hidden">
                      <img src={art.cover} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs font-bold truncate group-hover:text-[#C6FF33] transition-colors">{art.name}</span>
                      <span className="text-stone-500 text-[9px] truncate capitalize mt-0.5">{art.genre}</span>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          {/* 4. Popular in India (Bento Grid Layout) */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white' }}>Popular in India</h2>
              <span className="text-stone-500 text-[11px] font-semibold">Region-aware releases</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {discoveryData.popular_in_india
                .map((art, idx) => {
                  // Custom spans for Bento Layout (Arijit Singh at index 0 takes 2x2 span)
                  const isFirst = idx === 0;
                  return (
                    <div
                      key={art.id}
                      onClick={() => handleViewProfile(art.id)}
                      className={`p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex flex-col gap-2 group relative overflow-hidden ${isFirst ? 'col-span-2 row-span-2 min-h-[220px] md:min-h-[260px]' : ''
                        }`}
                    >
                      {isFirst ? (
                        <>
                          <div className="absolute inset-0 opacity-20">
                            <img src={art.banner || art.cover} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" alt="" />
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/80 to-transparent" />
                          <div className="relative z-10 flex flex-col justify-end h-full mt-auto pt-8">
                            <span className="text-[#C6FF33] text-[9px] font-bold uppercase tracking-wider">FEATURED REGIONAL RELEASE</span>
                            <span className="text-white text-lg md:text-xl font-bold truncate group-hover:text-[#C6FF33] transition-colors mt-1">{art.name}</span>
                            <span className="text-stone-400 text-[10px] mt-0.5 truncate">{art.bio || art.genre}</span>
                            <button className="px-3 py-1.5 mt-3 rounded-full bg-[#C6FF33] text-black text-[10px] font-bold uppercase tracking-wider w-fit hover:scale-105 active:scale-95 transition-all">
                              View Profile
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-full aspect-square rounded-lg overflow-hidden">
                            <img src={art.cover} alt={art.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          </div>
                          <div className="flex flex-col min-w-0">
                            <span className="text-white text-xs font-bold truncate group-hover:text-[#C6FF33] transition-colors">{art.name}</span>
                            <span className="text-stone-500 text-[9px] truncate capitalize mt-0.5">{art.genre}</span>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 5. MostQuotedLyrics (Masonry Grid Layout) */}
          {(() => {
            const rawQuotes = hookDiscoveryData?.quotes_wall || [];
            const filteredQuotes = selectedQuoteEmotion
              ? rawQuotes.filter(q => q.emotion.toLowerCase() === selectedQuoteEmotion.toLowerCase())
              : rawQuotes;

            const colsCount = 3;
            const quoteColumns: any[][] = Array.from({ length: colsCount }, () => []);
            filteredQuotes.forEach((quoteItem, idx) => {
              quoteColumns[idx % colsCount].push(quoteItem);
            });

            const emotions = ["euphoric", "hopeful", "nostalgic", "melancholy", "dark", "angry", "defiant", "romantic"];

            return (
              <div id="lyrics-wall-section" className="border-t border-white/5 pt-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-6">
                  <div>
                    <span className="text-[10px] font-bold text-[#C6FF33] uppercase tracking-widest">Pinterest-style Snippet Gallery</span>
                    <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Most Quoted Lyrics</h2>
                  </div>

                  {/* Emotion Filtering Chips */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedQuoteEmotion(null)}
                      className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                      style={{
                        backgroundColor: selectedQuoteEmotion === null ? '#C6FF33' : 'rgba(255,255,255,0.05)',
                        color: selectedQuoteEmotion === null ? 'black' : 'white'
                      }}
                    >
                      All Emotions
                    </button>
                    {emotions.map(emo => (
                      <button
                        key={emo}
                        onClick={() => setSelectedQuoteEmotion(emo)}
                        className="px-3.5 py-1.5 rounded-full text-xs font-bold uppercase transition-all cursor-pointer"
                        style={{
                          backgroundColor: selectedQuoteEmotion === emo ? (emotionColors[emo] || '#C6FF33') : 'rgba(255,255,255,0.05)',
                          color: selectedQuoteEmotion === emo ? 'black' : 'white'
                        }}
                      >
                        {emo}
                      </button>
                    ))}
                  </div>
                </div>

                {filteredQuotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {quoteColumns.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col gap-6">
                        {col.map((quoteItem) => {
                          const state = localSavedQuotes[quoteItem.lyricId] || { saved: false, count: quoteItem.saveCount };
                          const color = emotionColors[quoteItem.emotion.toLowerCase()] || "#C6FF33";
                          const isLarge = state.count > 3000;

                          return (
                            <div
                              key={quoteItem.lyricId}
                              className="p-6 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all flex flex-col gap-4"
                            >
                              <div className="flex justify-between items-center">
                                <span
                                  className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider"
                                  style={{ color: color, background: `${color}15`, border: `1px solid ${color}30` }}
                                >
                                  {quoteItem.emotion}
                                </span>
                                <span className="text-[10px] font-mono text-stone-500">{(state.count / 1000).toFixed(1)}k saves</span>
                              </div>
                              <p
                                style={{
                                  fontFamily: 'Georgia, serif',
                                  fontStyle: 'italic',
                                  fontSize: isLarge ? 18 : 15,
                                  color: 'white',
                                  lineHeight: 1.5
                                }}
                              >
                                "{quoteItem.quote}"
                              </p>
                              <div className="flex flex-col border-t border-white/5 pt-3 mt-1">
                                <span className="text-white text-xs font-semibold">{quoteItem.song}</span>
                                <span className="text-stone-500 text-[10px]">{quoteItem.artistName}</span>
                              </div>
                              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                                <button
                                  onClick={() => handleToggleSaveQuote(quoteItem.lyricId, quoteItem.saveCount)}
                                  className="text-[10px] font-bold transition-colors cursor-pointer"
                                  style={{ color: state.saved ? '#C6FF33' : 'var(--text-muted)' }}
                                >
                                  {state.saved ? '✓ Saved' : 'Save'}
                                </button>
                                <button
                                  onClick={() => handleViewProfile(quoteItem.artistId)}
                                  className="text-[10px] font-bold text-stone-400 hover:text-white cursor-pointer"
                                >
                                  View Artist
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-stone-500 text-sm italic py-16 bg-white/[0.01] rounded-2xl border border-white/5 text-center">
                    No lyrics wall matching the emotional mood filter.
                  </div>
                )}
              </div>
            );
          })()}

          {/* 6. Mood Categorization Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white' }}>Artists By Mood</h2>
              <span className="text-stone-500 text-[11px] font-semibold">Explore emotional identities</span>
            </div>
            <div className="flex flex-col gap-6">
              {Object.entries(discoveryData.mood_categories).slice(0, 4).map(([moodName, artistList]) => {
                if (artistList.length === 0) return null;
                const color = emotionColors[moodName.toLowerCase()] || "#C6FF33"
                return (
                  <div key={moodName} className="p-5 rounded-2xl border border-white/5 bg-gradient-to-r from-white/[0.01] to-transparent">
                    <span className="text-xs font-bold uppercase tracking-widest capitalize" style={{ color: color }}>
                      {moodName} Vibe
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-3">
                      {artistList.map((art) => (
                        <div
                          key={art.id}
                          onClick={() => handleViewProfile(art.id)}
                          className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group"
                        >
                          <img src={art.cover} alt={art.name} className="w-10 h-10 object-cover rounded-lg" />
                          <div className="flex flex-col min-w-0">
                            <span className="text-white text-xs font-bold truncate group-hover:text-[#C6FF33] transition-colors">{art.name}</span>
                            <span className="text-stone-500 text-[9px] uppercase tracking-wider mt-0.5">{art.genre}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
