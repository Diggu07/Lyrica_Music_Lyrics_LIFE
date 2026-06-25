import { useState, useEffect, useRef } from 'react'
import { Track, SearchNavState } from '../App'
import { motion } from 'framer-motion'

interface SearchPageProps {
  onPlayTrack: (track: Track, queue?: Track[]) => void
  currentTrack?: Track
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
  likedTrackIds?: string[]
  onToggleLike?: (trackId: string) => void
  navState?: SearchNavState
  activePlatform?: 'saavn' | 'youtube'
  onPlatformChange?: (platform: 'saavn' | 'youtube') => void
}

interface UnifiedSearchResult {
  id: string
  rawId: string
  type: 'track' | 'album' | 'playlist' | 'artist'
  title: string
  subtitle: string
  cover: string
  source: 'saavn' | 'youtube'
  duration?: string
  videoId?: string
  stream_url?: string
}

interface MoodItem {
  name: string
  accentColor: string
  icon: string
  subgenres: string[]
  gridClass?: string
}

function getRgbaColor(hex: string, alpha: number) {
  const cleanHex = hex.replace('#', '')
  const r = parseInt(cleanHex.substring(0, 2), 16)
  const g = parseInt(cleanHex.substring(2, 4), 16)
  const b = parseInt(cleanHex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

function renderMoodIcon(moodName: string) {
  switch (moodName.toLowerCase()) {
    case 'chill':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3a6 6 0 0 0 9 9a9 9 0 1 1 -9 -9z" />
        </svg>
      )
    case 'melancholy':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 18a4.6 4.4 0 0 1 0 -9h.1a5 4.5 0 0 1 9.8 0h.1a4.6 4.4 0 0 1 0 9h-10z" />
          <path d="M9 22l.5 -1.5" />
          <path d="M12 22l.5 -1.5" />
          <path d="M15 22l.5 -1.5" />
        </svg>
      )
    case 'focus':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
          <path d="M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0" />
          <path d="M3 6l0 13" />
          <path d="M12 6l0 13" />
          <path d="M21 6l0 13" />
        </svg>
      )
    case 'party':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M8 21h8" />
          <path d="M12 15v6" />
          <path d="M17 3l-1 12H8L7 3z" />
        </svg>
      )
    case 'hype':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M13 3l-10 12h9l-1 6l10 -12h-9z" />
        </svg>
      )
    case 'romantic':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19.5 12.572l-7.5 7.428l-7.5 -7.428a5 5 0 1 1 7.5 -6.566a5 5 0 1 1 7.5 6.572" />
        </svg>
      )
    case 'nostalgic':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12m-3 0a3 3 0 1 0 6 0a3 3 0 1 0 -6 0" />
          <path d="M12 12l.01 0" />
        </svg>
      )
    case 'defiant':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
          <path d="M12 12m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
          <path d="M12 12m-5 0a5 5 0 1 0 10 0a5 5 0 1 0 -10 0" />
        </svg>
      )
    case 'hopeful':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
        </svg>
      )
    case 'angry':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3c4.912 4.428 6 9.47 6 12C18 19.5 15.5 21 12 21S6 19.5 6 15c0-2.53 1.088-7.572 6-12z" />
        </svg>
      )
    default:
      return null
  }
}

const MOODS_LIST: MoodItem[] = [
  {
    name: 'Chill',
    accentColor: '#38bdf8', // Light blue
    icon: '🧘',
    subgenres: ['Lo-Fi', 'Ambient', 'Downtempo'],
    gridClass: 'col-span-2'
  },
  {
    name: 'Melancholy',
    accentColor: '#818cf8', // Indigo
    icon: '🌧️',
    subgenres: ['Sad Indie', 'Piano Solo', 'Acoustic'],
  },
  {
    name: 'Focus',
    accentColor: '#34d399', // Emerald
    icon: '📚',
    subgenres: ['Instrumental', 'Synthwave', 'Classical'],
  },
  {
    name: 'Party',
    accentColor: '#fbbf24', // Amber
    icon: '🎉',
    subgenres: ['Dance-Pop', 'EDM', 'House'],
  },
  {
    name: 'Hype',
    accentColor: '#f43f5e', // Rose/Red
    icon: '⚡',
    subgenres: ['Trap', 'Gym Beats', 'Dubstep'],
    gridClass: 'row-span-2 col-span-1'
  },
  {
    name: 'Romantic',
    accentColor: '#ec4899', // Pink
    icon: '💖',
    subgenres: ['Love Ballads', 'R&B Soul', 'Slow Jams'],
    gridClass: 'col-span-2'
  },
  {
    name: 'Nostalgic',
    accentColor: '#fb923c', // Orange
    icon: '📻',
    subgenres: ['90s Classics', 'Retro Pop', 'Oldies but Goldies'],
    gridClass: 'col-span-1'
  },
  {
    name: 'Defiant',
    accentColor: '#a855f7', // Purple
    icon: '✊',
    subgenres: ['Rebel Rock', 'Hip-Hop Lyricism', 'Grime'],
    gridClass: 'col-span-1'
  },
  {
    name: 'Hopeful',
    accentColor: '#C6FF33', // Lime-Yellow
    icon: '🌅',
    subgenres: ['Inspiring Folk', 'Uplifting Pop', 'Gospel'],
    gridClass: 'col-span-1'
  },
  {
    name: 'Angry',
    accentColor: '#ef4444', // Red
    icon: '🔥',
    subgenres: ['Hardcore', 'Heavy Metal', 'Alternative Punk'],
    gridClass: 'col-span-1'
  }
]

const GENRES_LIST = [
  'Bollywood', 'Hip-Hop', 'Indie', 'Classical', 'Pop', 'Lo-fi', 'Electronic', 'Rock', 'R&B', 'Jazz', 'Ghazal', 'Folk'
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.04
    }
  }
}

const moodContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.45,
      staggerChildren: 0.04
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: 'easeOut' as const }
  }
}

export function SearchPage({
  onPlayTrack,
  currentTrack,
  onNavigate,
  likedTrackIds = [],
  onToggleLike,
  navState,
  activePlatform,
  onPlatformChange
}: SearchPageProps) {
  const [query, setQuery] = useState(navState?.query || '')
  const [activeFilter, setActiveFilter] = useState<'all' | 'tracks' | 'albums' | 'playlists' | 'artists'>(navState?.filter || 'all')
  const [platform, setPlatform] = useState<'saavn' | 'youtube'>(navState?.source || activePlatform || 'saavn')

  const [results, setResults] = useState<UnifiedSearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitted, setIsSubmitted] = useState((navState?.query || '').trim().length > 0)
  const [hoveredMood, setHoveredMood] = useState<string | null>(null)

  // Autocomplete Suggestions
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const debounceTimer = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Sync initial query/filter changes (like navigating from Artists page)
  useEffect(() => {
    if (navState?.query) {
      setQuery(navState.query)
      setIsSubmitted(true)
      executeSearch(navState.query, navState.filter || activeFilter, navState.source || platform)
    } else if (navState?.query === '') {
      setQuery('')
      setIsSubmitted(false)
      setResults([])
    }
    if (navState?.filter) {
      setActiveFilter(navState.filter)
    }
    if (navState?.source) {
      setPlatform(navState.source)
    }
  }, [navState])

  // Sync activePlatform changes from global state
  useEffect(() => {
    if (activePlatform) {
      setPlatform(activePlatform)
    }
  }, [activePlatform])

  // Close suggestions on outside click
  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  // Global Escape keydown listener
  useEffect(() => {
    function handleGlobalKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        if (query.trim().length > 0) {
          setQuery('')
          setSuggestions([])
          setShowSuggestions(false)
        } else {
          setIsSubmitted(false)
          setResults([])
          setError(null)
        }
      }
    }
    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [query])

  // Debounced autocomplete suggestions
  const handleInputChange = (val: string) => {
    setQuery(val)
    if (!val.trim()) {
      setIsSubmitted(false)
      setResults([])
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current)

    if (val.trim().length >= 2) {
      debounceTimer.current = setTimeout(() => {
        fetch(`/api/artists/search/suggest?q=${encodeURIComponent(val)}`)
          .then(res => res.json())
          .then(data => {
            if (Array.isArray(data)) {
              setSuggestions(data.slice(0, 8))
              setShowSuggestions(true)
            }
          })
          .catch(err => console.error('Suggestion fetch error:', err))
      }, 300)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  // Trigger main search query
  const executeSearch = (searchQuery = query, filterType = activeFilter, sourcePlatform = platform) => {
    const cleanQuery = searchQuery.trim()
    if (!cleanQuery) return

    setLoading(true)
    setError(null)
    setIsSubmitted(true)
    setShowSuggestions(false)

    // Map frontend filter chips to API "type" param
    // Chips: All, Tracks, Playlists, Albums, Artists
    const apiTypeMap: Record<string, string> = {
      all: 'all',
      tracks: 'tracks',
      playlists: 'playlists',
      albums: 'albums',
      artists: 'artists'
    }
    const apiType = apiTypeMap[filterType] || 'all'

    fetch(`/api/music/search?q=${encodeURIComponent(cleanQuery)}&source=${sourcePlatform}&type=${apiType}`)
      .then(res => {
        if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
        return res.json()
      })
      .then(data => {
        setResults(data.results || [])
        setLoading(false)
      })
      .catch(err => {
        console.error('Search error:', err)
        setError(err.message || 'An error occurred during search. Please try again.')
        setLoading(false)
      })
  }

  // Submit on Enter key
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimer.current) clearTimeout(debounceTimer.current)
      executeSearch()
    } else if (e.key === 'Escape') {
      if (query.trim().length > 0) {
        setQuery('')
        setSuggestions([])
        setShowSuggestions(false)
      } else {
        // Clear all states
        setIsSubmitted(false)
        setResults([])
        setError(null)
      }
    }
  }

  // Execute search when platform toggle or filter chips change post-submit
  const handleFilterChange = (filter: 'all' | 'tracks' | 'albums' | 'playlists' | 'artists') => {
    setActiveFilter(filter)
    if (isSubmitted) {
      executeSearch(query, filter, platform)
    }
  }

  const handlePlatformChange = (plat: 'saavn' | 'youtube') => {
    setPlatform(plat)
    onPlatformChange?.(plat)
    if (isSubmitted) {
      executeSearch(query, activeFilter, plat)
    }
  }

  // Play a track and map it to App.tsx expectations
  const playTrackItem = (trackItem: UnifiedSearchResult) => {
    // Map UnifiedSearchResult to Track schema
    const playList: Track[] = results
      .filter(r => r.type === 'track')
      .map(r => ({
        id: r.id,
        title: r.title,
        artist: r.subtitle,
        cover: r.cover,
        album: '',
        duration: r.duration || '3:30',
        stream_url: r.stream_url,
        saavn_id: r.source === 'saavn' ? r.rawId : undefined,
        videoId: r.source === 'youtube' ? r.rawId : undefined,
        source: r.source
      }))

    const activeTrack: Track = {
      id: trackItem.id,
      title: trackItem.title,
      artist: trackItem.subtitle,
      cover: trackItem.cover,
      album: '',
      duration: trackItem.duration || '3:30',
      stream_url: trackItem.stream_url,
      saavn_id: trackItem.source === 'saavn' ? trackItem.rawId : undefined,
      videoId: trackItem.source === 'youtube' ? trackItem.rawId : undefined,
      source: trackItem.source
    }

    onPlayTrack(activeTrack, playList)
  }

  // RENDER HELPERS
  const renderSkeletons = () => {
    // Determine skeleton card count and size based on filter type
    const isTracks = activeFilter === 'tracks'
    const skeletonCount = isTracks ? 10 : 8

    return (
      <div
        className={isTracks ? "flex flex-col gap-3" : "grid gap-6 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"}
      >
        {Array.from({ length: skeletonCount }).map((_, i) => (
          <div
            key={i}
            className={`bg-stone-900/50 border border-white/5 animate-pulse ${isTracks ? "h-14 rounded-xl flex items-center px-4 gap-4" : "p-4 rounded-2xl flex flex-col gap-4"
              }`}
          >
            {isTracks ? (
              <>
                <div className="w-10 h-10 rounded-lg bg-stone-800 flex-shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-1/3 bg-stone-800 rounded" />
                  <div className="h-2.5 w-1/5 bg-stone-800 rounded" />
                </div>
              </>
            ) : (
              <>
                <div className="w-full aspect-square rounded-xl bg-stone-800" />
                <div className="h-3 w-3/4 bg-stone-800 rounded" />
                <div className="h-2.5 w-1/2 bg-stone-800 rounded" />
              </>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <motion.div
      layout
      className="flex-1 overflow-y-auto px-8 pb-8 flex flex-col"
      ref={containerRef}
    >
      {/* Search Input Container - Flexible Position transition */}
      <div
        className={`w-full flex flex-col items-center transition-all duration-500 ease-in-out ${isSubmitted
          ? "h-auto mt-6 mb-6"
          : "mt-12 sm:mt-16 mb-8"
          }`}
      >
        {!isSubmitted && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.35 }}
            className="text-center mb-8"
          >
            <h1 className="text-[26px] font-normal italic text-white mb-2" style={{ fontFamily: 'Georgia, serif' }}>
              What's on your mind?
            </h1>
            <p className="text-stone-500 text-[10px] tracking-[0.15em] uppercase font-bold">Search across JioSaavn & YouTube</p>
          </motion.div>
        )}

        <div className="relative w-full max-w-[520px] mx-auto">
          {/* Main search capsule input wrapper */}
          <motion.div
            layoutId={navState?.triggerMerge ? "search-bar" : undefined}
            transition={{
              layout: { duration: 0.45, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.2 }
            }}
            className="flex items-center gap-4.5 px-6 py-4 rounded-full border shadow-2xl transition-all duration-300 w-full focus-within:border-white/20 bg-[#161616]"
            style={{ borderColor: 'rgba(255, 255, 255, 0.08)' }}
          >
            {/* Search Icon */}
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                stroke="white"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.4}
              />
            </svg>

            <input
              type="text"
              placeholder="Search by track, artist, album..."
              value={query}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={handleKeyDown}
              className="bg-transparent text-white border-none outline-none text-sm sm:text-base w-full"
              style={{ fontFamily: 'Inter, sans-serif' }}
              autoFocus
            />

            {/* Clear Button */}
            {query && (
              <button
                onClick={() => {
                  setQuery('')
                  setSuggestions([])
                  setShowSuggestions(false)
                }}
                className="text-stone-400 hover:text-white text-xs px-2 transition-colors cursor-pointer"
              >
                ✕
              </button>
            )}

            {/* Loader Spinner */}
            {loading && (
              <div className="w-4.5 h-4.5 border-2 border-[#C6FF33] border-t-transparent rounded-full animate-spin flex-shrink-0" />
            )}
          </motion.div>

          {/* Autocomplete Suggestions Dropdown */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute top-[105%] left-0 right-0 z-50 rounded-2xl border border-white/10 bg-stone-950/95 backdrop-blur-xl shadow-2xl p-3 flex flex-col gap-1 max-h-72 overflow-y-auto">
              {suggestions.map((sug, i) => (
                <div
                  key={i}
                  onClick={() => {
                    setQuery(sug)
                    executeSearch(sug)
                  }}
                  className="text-stone-300 hover:text-white text-xs sm:text-sm py-2 px-3.5 rounded-xl hover:bg-white/5 cursor-pointer transition-all flex items-center gap-3 font-medium"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity={0.5} />
                  </svg>
                  {sug}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Hint pills */}
        {!isSubmitted && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 0.25, duration: 0.3 }}
            className="flex items-center justify-center gap-4 mt-4 text-stone-500 text-[10px] font-bold uppercase tracking-wider select-none"
          >
            <div className="flex items-center gap-1.5">
              <span className="text-[#C6FF33]">●</span> JioSaavn
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-[#C6FF33]">●</span> YT Music
            </div>
          </motion.div>
        )}
      </div>

      {/* Moods Section */}
      {!isSubmitted && (
        <motion.div
          variants={moodContainerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[520px] mx-auto mt-2 flex flex-col pb-6"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C6FF33] mb-4">Moods</h3>
          <div className="grid grid-cols-3 gap-3">
            {MOODS_LIST.map((mood) => (
              <motion.div
                key={mood.name}
                variants={itemVariants}
                onClick={() => {
                  setQuery(mood.name)
                  executeSearch(mood.name)
                }}
                onMouseEnter={() => setHoveredMood(mood.name)}
                onMouseLeave={() => setHoveredMood(null)}
                className={`relative overflow-hidden p-5 rounded-2xl cursor-pointer flex flex-col justify-between group transition-colors duration-300 ${mood.gridClass || ''}`}
                style={{
                  backgroundColor: getRgbaColor(mood.accentColor, hoveredMood === mood.name ? 0.13 : 0.07),
                  borderLeft: `3px solid ${mood.accentColor}`,
                  minHeight: mood.gridClass?.includes('row-span-2') ? '220px' : '100px'
                }}
              >
                <div className="flex items-start justify-between">
                  <div style={{ color: mood.accentColor }} className="flex-shrink-0">
                    {renderMoodIcon(mood.name)}
                  </div>
                </div>
                <div className="flex flex-col mt-4">
                  <h4 className="text-white text-sm font-bold font-sans transition-colors group-hover:text-[#C6FF33]">
                    {mood.name}
                  </h4>
                  <span className="text-stone-400 text-[9px] mt-0.5 truncate">
                    {mood.subgenres.join(' · ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Genres Section */}
      {!isSubmitted && (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-[520px] mx-auto mt-6 flex flex-col pb-16"
        >
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#C6FF33] mb-4 text-center">Genres</h3>

          <div className="flex flex-col gap-3.5 w-full">
            {/* Row 1 */}
            <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-1 scrollbar-hide w-full px-4">
              {['Bollywood', 'Hip-Hop', 'Indie', 'Classical', 'Pop', 'Lo-fi'].map((genre) => (
                <motion.button
                  key={genre}
                  variants={itemVariants}
                  onClick={() => {
                    setQuery(genre)
                    executeSearch(genre)
                  }}
                  className="flex items-center justify-center px-4 py-2 text-white border border-[#2a2a2a] hover:border-[#444] rounded-full text-xs font-semibold tracking-wider cursor-pointer transition-colors duration-200 bg-transparent flex-shrink-0"
                >
                  <span>{genre}</span>
                </motion.button>
              ))}
            </div>
            {/* Row 2 */}
            <div className="flex items-center justify-start sm:justify-center gap-3 overflow-x-auto pb-1 scrollbar-hide w-full px-4">
              {['Electronic', 'Rock', 'R&B', 'Jazz', 'Ghazal', 'Folk'].map((genre) => (
                <motion.button
                  key={genre}
                  variants={itemVariants}
                  onClick={() => {
                    setQuery(genre)
                    executeSearch(genre)
                  }}
                  className="flex items-center justify-center px-4 py-2 text-white border border-[#2a2a2a] hover:border-[#444] rounded-full text-xs font-semibold tracking-wider cursor-pointer transition-colors duration-200 bg-transparent flex-shrink-0"
                >
                  <span>{genre}</span>
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Post-Search Options & Results (Only renders when search query submitted) */}
      {isSubmitted && (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-in">
          {/* Platform Toggle */}
          <div className="flex items-center gap-1.5 p-1 rounded-full bg-stone-950/60 border border-white/5 w-fit mx-auto mb-6 flex-shrink-0">
            <button
              onClick={() => handlePlatformChange('saavn')}
              className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${platform === 'saavn'
                ? 'bg-[#c8f53a] text-black shadow-lg scale-105'
                : 'text-stone-400 hover:text-white'
                }`}
            >
              JioSaavn
            </button>
            <button
              onClick={() => handlePlatformChange('youtube')}
              className={`px-5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${platform === 'youtube'
                ? 'bg-[#c8f53a] text-black shadow-lg scale-105'
                : 'text-stone-400 hover:text-white'
                }`}
            >
              YT Music
            </button>
          </div>

          {/* Horizontal Filter Chips */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide flex-shrink-0">
            {(['all', 'tracks', 'playlists', 'albums', 'artists'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => handleFilterChange(filter)}
                className={`px-4.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider border transition-all flex-shrink-0 cursor-pointer ${activeFilter === filter
                  ? 'bg-white text-black border-white'
                  : 'bg-transparent text-stone-400 border-white/10 hover:border-white/20 hover:text-white'
                  }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Results Area */}
          <div className="flex-1 min-h-0">
            {loading ? (
              renderSkeletons()
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-16 text-center max-w-md mx-auto">
                <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400 text-lg mb-4">⚠️</div>
                <h3 className="text-white font-bold text-base mb-1">Search failed</h3>
                <p className="text-stone-400 text-xs mb-4 leading-relaxed">{error}</p>
                <button
                  onClick={() => executeSearch()}
                  className="px-5 py-2 rounded-full bg-white/5 border border-white/10 text-white text-xs font-bold uppercase tracking-wider hover:bg-white/10 transition-all cursor-pointer"
                >
                  Retry Search
                </button>
              </div>
            ) : results.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center max-w-sm mx-auto">
                <span className="text-3xl mb-4">🔍</span>
                <h3 className="text-white font-semibold text-base mb-1">No matches found</h3>
                <p className="text-stone-400 text-xs leading-relaxed">
                  We couldn't find any results for "{query}" on {platform === 'saavn' ? 'JioSaavn' : 'YouTube Music'}. Check spelling or switch platforms.
                </p>
              </div>
            ) : (
              <div className="pb-12">
                {/* 1. Track list format */}
                {activeFilter === 'tracks' && (
                  <div className="flex flex-col gap-1.5">
                    {results.map((item, idx) => {
                      const isCurrent = currentTrack?.id === item.id
                      const isLiked = likedTrackIds.includes(item.id)
                      return (
                        <div
                          key={item.id}
                          onClick={() => playTrackItem(item)}
                          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.04] border border-transparent hover:border-white/5 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <span className="text-stone-500 text-xs font-mono w-6 text-center">{idx + 1}</span>
                            <img src={item.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=100'} className="w-10 h-10 rounded-lg object-cover flex-shrink-0" alt="" />
                            <div className="flex flex-col min-w-0">
                              <span className={`text-xs sm:text-sm font-semibold truncate ${isCurrent ? 'text-[#C6FF33]' : 'text-white'}`}>{item.title}</span>
                              <span className="text-stone-400 text-[10px] sm:text-xs truncate">{item.subtitle}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            {onToggleLike && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation()
                                  onToggleLike(item.id)
                                }}
                                className="opacity-0 group-hover:opacity-100 transition-opacity hover:scale-105 active:scale-95 cursor-pointer text-stone-400 hover:text-white"
                              >
                                {isLiked ? (
                                  <span className="text-[#C6FF33]">❤️</span>
                                ) : (
                                  <span>♡</span>
                                )}
                              </button>
                            )}
                            <span className="text-stone-500 text-[10px] sm:text-xs font-mono">{item.duration || '3:30'}</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* 2. Grid formats (Albums, Playlists, Artists, All) */}
                {activeFilter !== 'tracks' && (
                  <div className="grid gap-6 grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
                    {results.map((item) => {
                      const isArtist = item.type === 'artist'
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (item.type === 'track') {
                              playTrackItem(item)
                            } else if (item.type === 'artist') {
                              onNavigate('artists', item.rawId, null)
                            } else if (item.type === 'album') {
                              onNavigate('albums', null, item.rawId)
                            } else if (item.type === 'playlist') {
                              onNavigate(`playlist:${item.rawId}`, null, null)
                            }
                          }}
                          className="group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex flex-col hover:bg-white/[0.04] border border-transparent hover:border-white/5 bg-white/[0.01]"
                        >
                          <div className={`relative aspect-square w-full overflow-hidden mb-4 border border-white/5 shadow-md ${isArtist ? "rounded-full" : "rounded-xl"
                            }`}>
                            <img
                              src={item.cover || 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300'}
                              alt=""
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* Hover Play Button Overlay */}
                            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-10 h-10 rounded-full bg-[#C6FF33] flex items-center justify-center text-black font-bold transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:scale-110 shadow-lg">
                                <svg width="12" height="12" viewBox="0 0 11 14" fill="none">
                                  <path d="M0 14V0L11 7L0 14V14" fill="black" />
                                </svg>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col min-w-0">
                            <span className="text-white text-xs sm:text-sm font-bold truncate group-hover:text-[#C6FF33] transition-colors mb-1" title={item.title}>
                              {item.title}
                            </span>
                            <span className="text-stone-400 text-[10px] sm:text-xs truncate">
                              {item.subtitle}
                            </span>
                            <span className="text-[9px] font-mono text-stone-500 uppercase tracking-widest mt-1 block">
                              {item.type}
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  )
}
