import { useState, useEffect, useRef, useCallback, createContext, useContext, useMemo } from 'react'
import { Sidebar } from './components/Sidebar'
import { BottomPlayer } from './components/BottomPlayer'
import { HomePage } from './components/HomePage'
import { ArtistsPage, artistsList } from './components/ArtistsPage'
import { LibraryPage } from './components/LibraryPage'
import { AlbumsPage } from './components/AlbumsPage'
import { RadioPage } from './components/RadioPage'
import { PlaylistPage } from './components/PlaylistPage'
import { ChartDetailPage } from './components/ChartDetailPage'
import { AuthModal } from './components/AuthModal'
import { LyricsView } from './components/LyricsView'
import { NowPlayingPanel } from './components/NowPlayingPanel'

import defaultCover from 'figma:asset/d3b57b756182091c9c0eebb36cff4c1f36c5fc0f.png'

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: any;
  }
}

export type Page = string; // Support dynamic playlist pages (e.g. 'playlist:<id>')

export interface Track {
  id: string
  title: string
  artist: string
  cover: string
  album?: string
  duration?: string
  duration_secs?: number
  file?: string          // kept for legacy / local fallback
  stream_url?: string    // JioSaavn CDN URL (pre-fetched)
  saavn_id?: string      // JioSaavn song ID
  videoId?: string       // YouTube video ID (YT fallback)
  source?: 'saavn' | 'youtube' | 'local'
  language?: string
  playable?: boolean
}

export interface LyricLine {
  time: number | null
  line: string
}

export interface Playlist {
  id: string
  name: string
  songs: string[]
  cover_url?: string
}

export interface AppContextType {
  likedTrackIds: string[];
  likedTracks: Track[];
  playlists: Playlist[];
  followedArtistIds: string[];
  handleToggleLike: (trackId: string, trackObj?: Track) => Promise<void>;
  handleCreatePlaylistAndAdd: (name: string, songId: string) => Promise<void>;
  handleAddSongToPlaylist: (playlistId: string, songId: string) => Promise<void>;
  handleRemoveSongFromPlaylist: (playlistId: string, songId: string) => Promise<void>;
  handleGeneratePlaylistCover: (playlistId: string) => Promise<void>;
  handlePlayTrack: (track: Track, customQueue?: Track[]) => Promise<void>;
  currentTrack: Track;
  isPlaying: boolean;
  onNavigate: (targetPage: string, artistId?: string | null, albumId?: string | null) => void;
}

export const AppContext = createContext<AppContextType | null>(null);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppContext.Provider');
  }
  return context;
};

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13.8333 15L8.58333 9.75C8.16667 10.0833 7.6875 10.3472 7.14583 10.5417C6.60417 10.7361 6.02778 10.8333 5.41667 10.8333C3.90278 10.8333 2.62153 10.309 1.57292 9.26042C0.524305 8.21181 0 6.93056 0 5.41667C0 3.90278 0.524305 2.62153 1.57292 1.57292C2.62153 0.524305 3.90278 0 5.41667 0C6.93056 0 8.21181 0.524305 9.26042 1.57292C10.309 2.62153 10.8333 3.90278 10.8333 5.41667C10.8333 6.02778 10.7361 6.60417 10.5417 7.14583C10.3472 7.6875 10.0833 8.16667 9.75 8.58333L15 13.8333L13.8333 15V15M5.41667 9.16667C6.45833 9.16667 7.34375 8.80208 8.07292 8.07292C8.80208 7.34375 9.16667 6.45833 9.16667 5.41667C9.16667 4.375 8.80208 3.48958 8.07292 2.76042C7.34375 2.03125 6.45833 1.66667 5.41667 1.66667C4.375 1.66667 3.48958 2.03125 2.76042 2.76042C2.03125 3.48958 1.66667 4.375 1.66667 5.41667C1.66667 6.45833 2.03125 7.34375 2.76042 8.07292C3.48958 8.80208 4.375 9.16667 5.41667 9.16667V9.16667" fill="#78716c" />
  </svg>
)

const HeartOutlineIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#78716c" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="#E2FB5E" />
  </svg>
)

const TicketIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
    <path d="M15 5v2m0 4v2m0 4v2M5 5h14a2 2 0 012 2v3a2 2 0 100 4v3a2 2 0 01-2 2H5a2 2 0 01-2-2v-3a2 2 0 100-4V7a2 2 0 012-2z" fill="none" stroke="white" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="17" viewBox="0 0 14 17" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0V17M8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20V20" fill="white" fillOpacity={0.5} />
  </svg>
)

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16.75 16.6667" fill="none">
    <path d="M6.08333 16.6667L5.75 14C5.56944 13.9306 5.39931 13.8472 5.23958 13.75C5.07986 13.6528 4.92361 13.5486 4.77083 13.4375L2.29167 14.4792L0 10.5208L2.14583 8.89583C2.13194 8.79861 2.125 8.70486 2.125 8.61458C2.125 8.52431 2.125 8.43056 2.125 8.33333C2.125 8.23611 2.125 8.14236 2.125 8.05208C2.125 7.96181 2.13194 7.86806 2.14583 7.77083L0 6.14583L2.29167 2.1875L4.77083 3.22917C4.92361 3.11806 5.08333 3.01389 5.25 2.91667C5.41667 2.81944 5.58333 2.73611 5.75 2.66667L6.08333 0H10.6667L11 2.66667C11.1806 2.73611 11.3507 2.81944 11.5104 2.91667C11.6701 3.01389 11.8264 3.11806 11.9792 3.22917L14.4583 2.1875L16.75 6.14583L14.6042 7.77083C14.6181 7.86806 14.625 7.96181 14.625 8.05208V8.33333V8.61458V8.89583L16.7292 10.5208L14.4375 14.4792L11.9792 13.4375C11.8264 13.5486 11.6667 13.6528 11.5 13.75C11.3333 13.8472 11.1667 13.9306 11 14L10.6667 16.6667H6.08333V16.6667" fill="white" fillOpacity={0.5} />
  </svg>
)

const PlayIconGreen = () => (
  <svg width="16" height="20" viewBox="0 0 11 14" fill="none">
    <path d="M0 14V0L11 7L0 14V14" fill="#000" />
  </svg>
)

export default function App() {
  const [user, setUser] = useState<any>(null)
  const [loadingUser, setLoadingUser] = useState(true)
  const [page, setPage] = useState<Page>('home')
  const [activeArtistId, setActiveArtistId] = useState<string | null>(null)
  const [activeAlbumId, setActiveAlbumId] = useState<string | null>(null)
  
  // Track database
  const [tracks, setTracks] = useState<Track[]>([])
  
  // Player state
  const [currentTrack, setCurrentTrack] = useState<Track>({
    id: '',
    title: 'Select a song',
    artist: 'No artist',
    cover: defaultCover,
    album: '',
    duration: '0:00'
  })
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(200) // Default in seconds
  const [volume, setVolume] = useState(0.8)
  const [isShuffle, setIsShuffle] = useState(false)
  const [isRepeat, setIsRepeat] = useState(false)

  // Lyrics state
  const [lyrics, setLyrics] = useState<LyricLine[]>([])
  const [activeLyricIdx, setActiveLyricIdx] = useState(-1)
  const [showLyrics, setShowLyrics] = useState(false)
  const [showNowPlaying, setShowNowPlaying] = useState(false)
  const [lyricsHasSync, setLyricsHasSync] = useState(false)
  const rafRef = useRef<number | null>(null)
  
  // Queue state
  const [queue, setQueue] = useState<Track[]>([])
  const [queueIndex, setQueueIndex] = useState(0)

  // Auth lists
  const [likedTrackIds, setLikedTrackIds] = useState<string[]>([])
  const [likedTracks, setLikedTracks] = useState<Track[]>([])
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  
  // Recently Played state
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>(() => {
    try {
      const saved = localStorage.getItem('lyrica_recently_played_tracks')
      if (saved) {
        return JSON.parse(saved)
      }
    } catch (e) {
      console.error(e)
    }
    return []
  })

  // Global search states
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMode, setSearchMode] = useState<'saavn' | 'youtube'>('saavn')
  const [searchResults, setSearchResults] = useState<Track[]>([])
  const [searching, setSearching] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const [isSearchSubmitted, setIsSearchSubmitted] = useState(false)

  const searchContainerRef = useRef<HTMLDivElement>(null)

  const matchingArtists = useMemo(() => {
    if (!searchQuery.trim()) return []
    return artistsList.filter(artist => {
      const cleanQuery = searchQuery.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
      const cleanName = artist.name.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
      const cleanGenre = artist.genre.toLowerCase().replace(/[^a-z0-9]/g, '');
      
      return artist.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.genre.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (cleanQuery.length > 0 && (cleanName.includes(cleanQuery) || cleanGenre.includes(cleanQuery)));
    })
  }, [searchQuery])

  // Debounced search query for typeahead dropdown
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([])
      setShowDropdown(false)
      return
    }

    // Instantly show dropdown for local artist matches
    setShowDropdown(true)

    const delayDebounce = setTimeout(async () => {
      setSearching(true)
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(searchQuery)}&source=${searchMode}`)
        if (res.ok) {
          const data = await res.json()
          setSearchResults(data.results || [])
        }
      } catch (err) {
        console.error('Search error:', err)
      } finally {
        setSearching(false)
      }
    }, 400)

    return () => clearTimeout(delayDebounce)
  }, [searchQuery, searchMode])

  // Handle click outside dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      setIsSearchSubmitted(true)
      setShowDropdown(false)
    }
  }

  const handleClearSearch = () => {
    setSearchQuery('')
    setSearchResults([])
    setIsSearchSubmitted(false)
    setShowDropdown(false)
    setPage('home')
  }

  const handleNavigate = useCallback((targetPage: string, artistId: string | null = null, albumId: string | null = null) => {
    setActiveArtistId(artistId)
    setActiveAlbumId(albumId)
    setPage(targetPage)
  }, [])

  const handleNavigateArtistByName = useCallback((artistName: string) => {
    // 1. Look for a local artist whose normalized name matches the normalized artistName
    const cleanTarget = artistName.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
    const matchedLocal = artistsList.find(artist => {
      const cleanLocalName = artist.name.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]/g, '');
      return cleanLocalName === cleanTarget;
    });

    if (matchedLocal) {
      handleNavigate('artists', matchedLocal.id)
    } else {
      // 2. Otherwise generate a dynamic slug, replacing non-alphanumeric with hyphens
      const artistId = artistName.toLowerCase().replace(/\$/g, 's').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
      handleNavigate('artists', artistId)
    }
  }, [handleNavigate])

  // Audio refs
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const ytPlayerRef = useRef<any>(null)
  const [ytReady, setYtReady] = useState(false)
  const [followedArtistIds, setFollowedArtistIds] = useState<string[]>([])

  // 1. Initial User Session Check
  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => {
        if (res.ok) return res.json();
        throw new Error('Not logged in');
      })
      .then(data => {
        const u = data.user || data;
        setUser(u);
        setFollowedArtistIds(u.followed_artists || []);
        loadInitialData();
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoadingUser(false);
      });
  }, []);

  const loadInitialData = async () => {
    try {
      const resTracks = await fetch('/api/music/tracks');
      let loadedTracks: Track[] = [];
      if (resTracks.ok) {
        const dataTracks = await resTracks.json();
        loadedTracks = dataTracks.tracks || [];
        setTracks(loadedTracks);
      }

      const resLikes = await fetch('/api/user/liked-songs');
      if (resLikes.ok) {
        const dataLikes = await resLikes.json();
        setLikedTrackIds(dataLikes.liked_songs || []);
        setLikedTracks(dataLikes.liked_songs_metadata || []);
      }

      const resFollowed = await fetch('/api/user/followed-artists');
      if (resFollowed.ok) {
        const dataFollowed = await resFollowed.json();
        setFollowedArtistIds(dataFollowed.followed_artists || []);
      }

      const resPlaylists = await fetch('/api/playlists/');
      if (resPlaylists.ok) {
        const dataPlaylists = await resPlaylists.json();
        setPlaylists(dataPlaylists.playlists || []);
      }

      // Set last played track as default if stored in localStorage, otherwise use first track
      const saved = localStorage.getItem('lyrica_last_played_track');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed && parsed.id) {
            setCurrentTrack(parsed);
          } else if (loadedTracks.length > 0) {
            setCurrentTrack(loadedTracks[0]);
          }
        } catch {
          if (loadedTracks.length > 0) setCurrentTrack(loadedTracks[0]);
        }
      } else if (loadedTracks.length > 0) {
        setCurrentTrack(loadedTracks[0]);
      }
    } catch (err) {
      console.error('Failed to load initial data:', err);
    }
  }

  // 2. Load YouTube API
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const checkYT = setInterval(() => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkYT);
        
        let container = document.getElementById('yt-player-container');
        if (!container) {
          container = document.createElement('div');
          container.id = 'yt-player-container';
          container.style.position = 'absolute';
          container.style.width = '0';
          container.style.height = '0';
          container.style.left = '-9999px';
          container.style.top = '-9999px';
          const child = document.createElement('div');
          child.id = 'yt-player';
          container.appendChild(child);
          document.body.appendChild(container);
        }
        
        ytPlayerRef.current = new window.YT.Player('yt-player', {
          height: '0',
          width: '0',
          videoId: '',
          events: {
            onReady: () => {
              setYtReady(true);
            },
            onStateChange: (event: any) => {
              if (event.data === 0) { // ENDED
                handleNextTrack();
              }
            }
          }
        });
      }
    }, 500);
    return () => clearInterval(checkYT);
  }, []);

  const isYouTubeTrack = (track: Track) => {
    if (!track) return false;
    return track.source === 'youtube' || (!!track.videoId && !track.saavn_id) || track.id.toString().startsWith('yt_');
  }

  // 3. Audio & YouTube Playback controls
  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }

    const handleTimeUpdate = () => {
      if (audioRef.current && !isYouTubeTrack(currentTrack)) {
        if (audioRef.current.readyState < 2) return;
        const audioTime = audioRef.current.currentTime;
        if (audioTime > 0 || !audioRef.current.paused) {
          setCurrentTime(Math.floor(audioTime));
        }
      }
    };

    const handleDurationChange = () => {
      if (audioRef.current && !isYouTubeTrack(currentTrack)) {
        setDuration(Math.floor(audioRef.current.duration || 0));
      }
    };

    const handleEnded = () => {
      handleNextTrack();
    };

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('durationchange', handleDurationChange);
    audioRef.current.addEventListener('ended', handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate);
        audioRef.current.removeEventListener('durationchange', handleDurationChange);
        audioRef.current.removeEventListener('ended', handleEnded);
      }
    };
  }, [currentTrack]);

  // Sync volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
    if (ytPlayerRef.current && ytPlayerRef.current.setVolume) {
      ytPlayerRef.current.setVolume(volume * 100);
    }
  }, [volume]);

  // Fetch lyrics for a track (non-blocking)
  const fetchLyrics = async (track: Track) => {
    setLyrics([]);
    setActiveLyricIdx(-1);
    try {
      const params = new URLSearchParams({
        artist: track.artist,
        title: track.title,
        ...(track.duration_secs ? { duration: String(track.duration_secs) } : {}),
      });
      const res = await fetch(`/api/lyrics?${params}`);
      if (res.ok) {
        const data = await res.json();
        setLyrics(data.lyrics || []);
        setLyricsHasSync(data.has_sync || false);
      }
    } catch (e) {
      console.warn('Lyrics fetch failed:', e);
    }
  };

  // Playback sync with state changes
  const handlePlayTrack = async (track: Track, customQueue?: Track[]) => {
    const ytExplicit = track.source === 'youtube' || (track.videoId && !track.saavn_id);

    // Set queue
    if (customQueue && customQueue.length > 0) {
      setQueue(customQueue);
      const idx = customQueue.findIndex(t => t.id === track.id);
      setQueueIndex(idx >= 0 ? idx : 0);
    } else if (!queue.some(t => t.id === track.id)) {
      setQueue([track]);
      setQueueIndex(0);
    } else {
      const idx = queue.findIndex(t => t.id === track.id);
      if (idx >= 0) setQueueIndex(idx);
    }

    setCurrentTrack(track);
    setIsPlaying(true);
    fetchLyrics(track);

    // Save to last played track localStorage
    localStorage.setItem('lyrica_last_played_track', JSON.stringify(track));

    // Add to recentlyPlayed list and update localStorage
    setRecentlyPlayed(prev => {
      const filtered = (prev || []).filter(t => t.id !== track.id);
      const updated = [track, ...filtered].slice(0, 10);
      localStorage.setItem('lyrica_recently_played_tracks', JSON.stringify(updated));
      return updated;
    });

    const playYoutubeFallback = async () => {
      console.log(`[playback] Falling back to YouTube search for "${track.title}"…`);
      if (audioRef.current) audioRef.current.pause();
      try {
        const q = encodeURIComponent(`${track.title} ${track.artist}`);
        const r = await fetch(`/api/music/search?q=${q}&source=youtube&limit=1`);
        if (r.ok) {
          const d = await r.json();
          const ytTrack = d.results?.[0];
          if (ytTrack?.videoId && ytPlayerRef.current?.loadVideoById) {
            // Update current track display with resolved videoId so player knows it's YT
            const resolved: Track = { ...track, videoId: ytTrack.videoId, source: 'youtube' };
            setCurrentTrack(resolved);
            ytPlayerRef.current.loadVideoById(ytTrack.videoId);
            ytPlayerRef.current.playVideo();
          } else {
            console.warn('[playback] YouTube fallback returned no results for:', track.title);
          }
        }
      } catch (e) {
        console.warn('[playback] YouTube fallback search failed:', e);
      }
    };

    if (ytExplicit) {
      // Explicit YouTube track — play directly
      if (audioRef.current) audioRef.current.pause();
      if (ytPlayerRef.current?.loadVideoById) {
        const vid = track.videoId || track.id.replace('yt_', '');
        ytPlayerRef.current.loadVideoById(vid);
        ytPlayerRef.current.playVideo();
      }
    } else if (track.saavn_id) {
      // JioSaavn track — resolve fresh stream URL
      ytPlayerRef.current?.pauseVideo?.();
      let streamUrl = track.stream_url || track.file || '';
      if (!streamUrl) {
        try {
          const r = await fetch(`/api/music/stream?id=${track.saavn_id}`);
          if (r.ok) {
            const d = await r.json();
            streamUrl = d.stream_url || '';
          }
        } catch (e) {
          console.warn('Stream URL fetch failed:', e);
        }
      }
      if (audioRef.current && streamUrl) {
        audioRef.current.src = streamUrl;
        audioRef.current.play().catch(err => {
          console.log('Audio playback error, falling back to YouTube:', err);
          playYoutubeFallback();
        });
      } else {
        console.log('No stream URL resolved, falling back to YouTube...');
        playYoutubeFallback();
      }
    } else {
      // No saavn_id, no explicit YouTube — track is from Apple RSS chart with no JioSaavn match.
      // Auto-fallback: search YouTube by title + artist and play first result.
      playYoutubeFallback();
    }
  };

  const handleTogglePlay = () => {
    const yt = isYouTubeTrack(currentTrack);
    if (isPlaying) {
      setIsPlaying(false);
      if (yt) {
        ytPlayerRef.current?.pauseVideo();
      } else {
        audioRef.current?.pause();
      }
    } else {
      setIsPlaying(true);
      if (yt) {
        ytPlayerRef.current?.playVideo();
      } else {
        audioRef.current?.play().catch(err => console.log('Audio playback error:', err));
      }
    }
  };

  const handleSeek = (time: number) => {
    const yt = isYouTubeTrack(currentTrack);
    setCurrentTime(Math.floor(time));
    if (yt) {
      ytPlayerRef.current?.seekTo(time, true);
    } else {
      if (audioRef.current) {
        audioRef.current.currentTime = time;
      }
    }
  };

  const handleNextTrack = () => {
    if (queue.length === 0) return;
    let nextIdx = queueIndex + 1;
    if (isShuffle) {
      nextIdx = Math.floor(Math.random() * queue.length);
    } else if (nextIdx >= queue.length) {
      nextIdx = isRepeat ? 0 : queue.length - 1;
    }
    if (nextIdx >= 0 && nextIdx < queue.length) {
      setQueueIndex(nextIdx);
      handlePlayTrack(queue[nextIdx], queue);
    }
  };

  const handlePrevTrack = () => {
    if (queue.length === 0) return;
    let prevIdx = queueIndex - 1;
    if (prevIdx < 0) {
      prevIdx = isRepeat ? queue.length - 1 : 0;
    }
    if (prevIdx >= 0 && prevIdx < queue.length) {
      setQueueIndex(prevIdx);
      handlePlayTrack(queue[prevIdx], queue);
    }
  };

  // Sync YouTube player time
  useEffect(() => {
    let timer: any;
    if (isPlaying && currentTrack && isYouTubeTrack(currentTrack)) {
      timer = setInterval(() => {
        try {
          if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
            const time = ytPlayerRef.current.getCurrentTime();
            if (typeof time === 'number' && !isNaN(time)) {
              setCurrentTime(Math.floor(time));
            }
            const dur = ytPlayerRef.current.getDuration();
            if (typeof dur === 'number' && !isNaN(dur) && dur > 0) {
              setDuration(Math.floor(dur));
            }
          }
        } catch (e) {
          console.warn('[playback] YT progress sync error:', e);
        }
      }, 500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, currentTrack, ytReady]);

  // RAF lyrics sync — runs every animation frame when playing with synced lyrics
  const syncLyrics = useCallback(() => {
    let t = 0;
    if (currentTrack && isYouTubeTrack(currentTrack)) {
      if (ytPlayerRef.current && typeof ytPlayerRef.current.getCurrentTime === 'function') {
        t = ytPlayerRef.current.getCurrentTime();
      }
    } else {
      t = audioRef.current?.currentTime ?? 0;
    }

    if (lyrics.length > 0 && lyricsHasSync) {
      let idx = -1;
      for (let i = 0; i < lyrics.length; i++) {
        const lt = lyrics[i].time;
        if (lt !== null && lt <= t) idx = i;
        else break;
      }
      setActiveLyricIdx(idx);
    }
    rafRef.current = requestAnimationFrame(syncLyrics);
  }, [lyrics, lyricsHasSync, currentTrack]);

  useEffect(() => {
    if (isPlaying && lyrics.length > 0 && lyricsHasSync) {
      rafRef.current = requestAnimationFrame(syncLyrics);
    } else {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    }
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isPlaying, lyrics, lyricsHasSync, syncLyrics]);

  // Liked tracks and playlist CRUD sync
  const handleToggleLike = async (trackId: string, trackObj?: Track) => {
    const isLiked = likedTrackIds.includes(trackId);
    const action = isLiked ? 'remove' : 'add';

    // Optimistic Update
    setLikedTrackIds(prev =>
      isLiked ? prev.filter(id => id !== trackId) : [...prev, trackId]
    );
    if (isLiked) {
      setLikedTracks(prev => prev.filter(t => t.id !== trackId));
    } else {
      const foundTrack = trackObj || tracks.find(t => t.id === trackId) || (currentTrack?.id === trackId ? currentTrack : undefined);
      if (foundTrack && foundTrack.id === trackId) {
        setLikedTracks(prev => [...prev, foundTrack]);
      }
    }

    try {
      const payloadTrack = trackObj || tracks.find(t => t.id === trackId) || (currentTrack?.id === trackId ? currentTrack : undefined);
      const response = await fetch('/api/user/liked-songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          song_id: trackId, 
          action,
          track: payloadTrack
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setLikedTrackIds(data.liked_songs || []);
        setLikedTracks(data.liked_songs_metadata || []);
      } else {
        throw new Error('Server error');
      }
    } catch (err) {
      console.error('Failed to toggle like:', err);
      // Rollback
      if (isLiked) {
        setLikedTrackIds(prev => [...prev, trackId]);
        const foundTrack = trackObj || tracks.find(t => t.id === trackId) || (currentTrack?.id === trackId ? currentTrack : undefined);
        if (foundTrack && foundTrack.id === trackId) {
          setLikedTracks(prev => [...prev, foundTrack]);
        }
      } else {
        setLikedTrackIds(prev => prev.filter(id => id !== trackId));
        setLikedTracks(prev => prev.filter(t => t.id !== trackId));
      }
      throw err;
    }
  };

  const handleToggleFollow = async (artistId: string) => {
    const isFollowing = followedArtistIds.includes(artistId);
    const action = isFollowing ? 'remove' : 'add';

    setFollowedArtistIds(prev =>
      isFollowing ? prev.filter(id => id !== artistId) : [...prev, artistId]
    );

    try {
      const response = await fetch('/api/user/followed-artists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ artist_id: artistId, action }),
      });
      if (response.ok) {
        const data = await response.json();
        setFollowedArtistIds(data.followed_artists || []);
      }
    } catch (err) {
      console.error('Failed to toggle follow:', err);
    }
  };

  const handleCreatePlaylist = async () => {
    const name = prompt('Enter playlist name:');
    if (!name) return;
    try {
      const res = await fetch('/api/playlists/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.playlist) {
          setPlaylists(prev => [...prev, data.playlist]);
          if (data.playlist.id) {
            handleGeneratePlaylistCover(data.playlist.id);
          }
        }
      }
    } catch (err) {
      console.error('Failed to create playlist:', err);
    }
  };

  const handleDeletePlaylist = async (playlistId: string) => {
    if (!confirm('Are you sure you want to delete this playlist?')) return;
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, { method: 'DELETE' });
      if (res.ok) {
        setPlaylists(prev => prev.filter(p => p.id !== playlistId));
        setPage('library');
      }
    } catch (err) {
      console.error('Failed to delete playlist:', err);
    }
  };

  const handleRenamePlaylist = async (playlistId: string) => {
    const newName = prompt('Enter new playlist name:');
    if (!newName) return;
    try {
      const res = await fetch(`/api/playlists/${playlistId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        setPlaylists(prev =>
          prev.map(p => (p.id === playlistId ? { ...p, name: newName } : p))
        );
      }
    } catch (err) {
      console.error('Failed to rename playlist:', err);
    }
  };

  const handleAddSongToPlaylist = async (playlistId: string, songId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: songId }),
      });
      if (res.ok) {
        setPlaylists(prev =>
          prev.map(p => (p.id === playlistId ? { ...p, songs: [...p.songs, songId] } : p))
        );
      }
    } catch (err) {
      console.error('Failed to add song to playlist:', err);
    }
  };

  const handleRemoveSongFromPlaylist = async (playlistId: string, songId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/songs/${songId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setPlaylists(prev =>
          prev.map(p =>
            p.id === playlistId ? { ...p, songs: p.songs.filter(id => id !== songId) } : p
          )
        );
      }
    } catch (err) {
      console.error('Failed to remove song from playlist:', err);
    }
  };

  const handleGeneratePlaylistCover = async (playlistId: string) => {
    try {
      const res = await fetch(`/api/playlists/${playlistId}/generate-cover`, {
        method: 'POST',
      });
      if (res.ok) {
        const data = await res.json();
        if (data.success && data.cover_url) {
          setPlaylists(prev =>
            prev.map(p => (p.id === playlistId ? { ...p, cover_url: data.cover_url } : p))
          );
        }
      }
    } catch (err) {
      console.error('Failed to generate playlist cover:', err);
    }
  };

  const handleCreatePlaylistAndAdd = async (name: string, songId: string) => {
    let createdPlaylistId: string | null = null;
    try {
      const res = await fetch('/api/playlists/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error('Failed to create playlist');
      }
      const data = await res.json();
      if (!data.success || !data.playlist?.id) {
        throw new Error('Failed to create playlist');
      }
      
      const newPlaylist = data.playlist;
      createdPlaylistId = newPlaylist.id;

      const resAdd = await fetch(`/api/playlists/${createdPlaylistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song_id: songId }),
      });
      if (!resAdd.ok) {
        throw new Error('Failed to add song to the new playlist');
      }

      setPlaylists(prev => [...prev, { ...newPlaylist, songs: [songId] }]);
      handleGeneratePlaylistCover(newPlaylist.id);
    } catch (err) {
      console.error('handleCreatePlaylistAndAdd error:', err);
      if (createdPlaylistId) {
        try {
          await fetch(`/api/playlists/${createdPlaylistId}`, { method: 'DELETE' });
        } catch (cleanupErr) {
          console.error('Failed to clean up orphaned playlist:', cleanupErr);
        }
      }
      throw err;
    }
  };

  const contextValue = useMemo(() => ({
    likedTrackIds,
    likedTracks,
    playlists,
    followedArtistIds,
    handleToggleLike,
    handleCreatePlaylistAndAdd,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    handleGeneratePlaylistCover,
    handlePlayTrack,
    currentTrack,
    isPlaying,
    onNavigate: handleNavigate
  }), [
    likedTrackIds,
    likedTracks,
    playlists,
    followedArtistIds,
    handleToggleLike,
    handleCreatePlaylistAndAdd,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    handleGeneratePlaylistCover,
    handlePlayTrack,
    currentTrack,
    isPlaying,
    handleNavigate
  ]);

  const renderPageContent = () => {
    // Custom chart details
    if (page.startsWith('chart:')) {
      const parts = page.split(':');
      const chartType = parts[1] || 'worldwide';
      const chartLanguage = parts[2] || '';
      return (
        <ChartDetailPage
          chartType={chartType}
          language={chartLanguage}
          onPlayTrack={handlePlayTrack}
          currentTrack={currentTrack}
          likedTrackIds={likedTrackIds}
          onToggleLike={handleToggleLike}
          onNavigate={handleNavigate}
        />
      );
    }

    // Custom playlist details
    if (page.startsWith('playlist:')) {
      const playlistId = page.substring(9);
      const playlist = playlists.find(p => p.id === playlistId);
      if (!playlist) {
        return (
          <LibraryPage
            onNavigate={setPage}
            onPlayTrack={handlePlayTrack}
            playlists={playlists}
            likedTrackIds={likedTrackIds}
            allTracks={tracks}
            followedArtistIds={followedArtistIds}
            onCreatePlaylist={handleCreatePlaylist}
            user={user}
          />
        );
      }
      return (
        <PlaylistPage
          playlistId={playlistId}
          title={playlist.name}
          description="Your custom premium playlist workspace."
          coverUrl={playlist.cover_url}
          onPlayTrack={handlePlayTrack}
          currentTrack={currentTrack}
          likedTrackIds={likedTrackIds}
          onToggleLike={handleToggleLike}
          playlistTracks={tracks.filter(t => playlist.songs.includes(t.id))}
          onDeletePlaylist={() => handleDeletePlaylist(playlistId)}
          onRenamePlaylist={() => handleRenamePlaylist(playlistId)}
          onRemoveTrack={(songId) => handleRemoveSongFromPlaylist(playlistId, songId)}
          allTracks={tracks}
          onAddTrack={(songId) => handleAddSongToPlaylist(playlistId, songId)}
        />
      );
    }

    switch (page) {
      case 'home':
        return (
          <HomePage 
            onPlayTrack={handlePlayTrack} 
            currentTrack={currentTrack} 
            onNavigate={handleNavigate}
            likedTrackIds={likedTrackIds}
            onToggleLike={handleToggleLike}
            allTracks={tracks}
            queue={queue}
            queueIndex={queueIndex}
            recentlyPlayed={recentlyPlayed}
          />
        )
      case 'artists':
        return (
          <ArtistsPage 
            activeArtistId={activeArtistId}
            onSelectArtist={(id: string | null) => handleNavigate('artists', id, null)}
            onPlayTrack={handlePlayTrack}
            likedTrackIds={likedTrackIds}
            onToggleLike={handleToggleLike}
            currentTrack={currentTrack}
            onNavigate={handleNavigate}
            followedArtistIds={followedArtistIds}
            onToggleFollow={handleToggleFollow}
          />
        )
      case 'library':
        return (
          <LibraryPage 
            onNavigate={handleNavigate} 
            onPlayTrack={handlePlayTrack} 
            playlists={playlists}
            likedTrackIds={likedTrackIds}
            allTracks={tracks}
            followedArtistIds={followedArtistIds}
            onCreatePlaylist={handleCreatePlaylist}
            user={user}
          />
        )
      case 'albums':
        return (
          <AlbumsPage 
            activeAlbumId={activeAlbumId}
            onSelectAlbum={(id: string | null) => handleNavigate('albums', null, id)}
            onPlayTrack={handlePlayTrack}
            likedTrackIds={likedTrackIds}
            onToggleLike={handleToggleLike}
            currentTrack={currentTrack}
            onSelectArtist={(id: string | null) => handleNavigate('artists', id, null)}
            onNavigate={handleNavigate}
          />
        )
      case 'radio':
        return <RadioPage onPlayTrack={handlePlayTrack} />
      case 'daily-mix':
        return (
          <PlaylistPage 
            playlistId="daily-mix"
            title="Daily Mix 1"
            description="Your daily dose of ambient, lofi, and synthwave textures curated especially for you."
            onPlayTrack={handlePlayTrack}
            currentTrack={currentTrack}
            likedTrackIds={likedTrackIds}
            onToggleLike={handleToggleLike}
            playlistTracks={tracks} // default to all tracks for Daily Mix
          />
        )
      case 'liked-songs':
        return (
          <PlaylistPage 
            playlistId="liked-songs"
            title="Liked Songs"
            description="All your favorite tracks saved in one premium dashboard space."
            onPlayTrack={handlePlayTrack}
            currentTrack={currentTrack}
            likedTrackIds={likedTrackIds}
            onToggleLike={handleToggleLike}
            playlistTracks={likedTracks}
          />
        )
      default:
        return (
          <HomePage 
            onPlayTrack={handlePlayTrack} 
            currentTrack={currentTrack} 
            onNavigate={handleNavigate} 
            likedTrackIds={likedTrackIds} 
            onToggleLike={handleToggleLike} 
            allTracks={tracks}
            queue={queue}
            queueIndex={queueIndex}
            recentlyPlayed={recentlyPlayed}
          />
        )
    }
  }

  // Loading Screen
  if (loadingUser) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-[#0f0f10]">
        <div className="flex flex-col items-center gap-3">
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 36, color: 'white', letterSpacing: '3.6px' }}>LYRICA</div>
          <div style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 10, color: '#E2FB5E', letterSpacing: '1px' }}>LOADING SESSION...</div>
        </div>
      </div>
    )
  }

  // Auth Screen
  if (!user) {
    return (
      <AuthModal
        onLoginSuccess={(userData) => {
          setUser(userData);
          setFollowedArtistIds(userData.followed_artists || []);
          loadInitialData();
        }}
      />
    )
  }

  return (
    <AppContext.Provider value={contextValue}>
      <div
        className="flex h-screen overflow-hidden"
        style={{ fontFamily: 'Inter, sans-serif', background: '#0f0f10', minWidth: 'auto' }}
      >
      {/* Left Sidebar */}
      <Sidebar 
        currentPage={page} 
        onNavigate={(p) => handleNavigate(p, null, null)} 
        playlists={playlists}
        onCreatePlaylist={handleCreatePlaylist}
        allTracks={tracks}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        {/* Global Search Header Bar */}
        <div className="flex items-center justify-between px-8 pt-6 pb-4 flex-shrink-0 z-30 gap-4">
          <div className="flex items-center gap-4 flex-1">
            {/* Home button directly before the search bar */}
            <button
              onClick={handleClearSearch}
              className="opacity-65 hover:opacity-100 transition-opacity flex-shrink-0"
              style={{ cursor: 'pointer' }}
              title="Go to Home"
            >
              <svg width="18" height="18" viewBox="0 0 16 18" fill="none">
                <path d="M2 16H5V10H11V16H14V7L8 2.5L2 7V16V16M0 18V6L8 0L16 6V18H9V12H7V18H0V18" fill="white" />
              </svg>
            </button>

            {/* Search Input Container */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-[800px]">
              <div
                className="flex items-center gap-4 px-4 py-3 rounded-full w-full"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <SearchIcon />
                <input
                  type="text"
                  placeholder="Search for tracks, artists..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    if (!e.target.value.trim()) {
                      setIsSearchSubmitted(false)
                    }
                  }}
                  onKeyDown={handleKeyDown}
                  className="bg-transparent text-white border-none outline-none w-full"
                  style={{ fontFamily: 'Inter, sans-serif', fontWeight: 400, fontSize: 14 }}
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="text-stone-400 hover:text-white text-xs px-2"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Typeahead Dropdown */}
              {showDropdown && (searchResults.length > 0 || matchingArtists.length > 0) && (
                <div
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    marginTop: 8,
                    background: '#18181b',
                    borderRadius: 16,
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
                    maxHeight: 360,
                    overflowY: 'auto',
                    zIndex: 50,
                    padding: '8px 0',
                  }}
                >
                  {/* Matching Artists Section in Dropdown */}
                  {matchingArtists.length > 0 && (
                    <div className="px-2 pb-2">
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-2 py-1.5">Artists</div>
                      {matchingArtists.slice(0, 3).map((artistItem) => (
                        <div
                          key={artistItem.id}
                          onClick={() => {
                            handleNavigate('artists', artistItem.id, null)
                            setShowDropdown(false)
                          }}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <img
                            src={artistItem.cover}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-white/10"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-bold truncate">{artistItem.name}</div>
                            <div className="text-stone-400 text-[10px] truncate">{artistItem.genre.split('/')[0]} • Artist</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Matching Songs Section in Dropdown */}
                  {searchResults.length > 0 && (
                    <div className="px-2">
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-2 py-1.5 border-t border-white/5 mt-1.5">Songs</div>
                      {searchResults.slice(0, 5).map((item) => (
                        <div
                          key={item.id}
                          onClick={() => {
                            handlePlayTrack(item, searchResults)
                            setShowDropdown(false)
                          }}
                          className="flex items-center gap-3 px-2 py-1.5 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                        >
                          <img
                            src={item.cover}
                            alt=""
                            className="w-8 h-8 rounded-md object-cover flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="text-white text-xs font-semibold truncate" dangerouslySetInnerHTML={{ __html: item.title }} />
                            <div className="text-stone-400 text-[10px] truncate">{item.artist}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div
                    onClick={() => {
                      setIsSearchSubmitted(true)
                      setShowDropdown(false)
                    }}
                    className="text-center py-2 text-xs font-bold border-t border-white/5 mt-1 cursor-pointer transition-colors"
                    style={{ color: '#E2FB5E' }}
                  >
                    Press Enter to see all results
                  </div>
                </div>
              )}
            </div>

            {/* Source Switch Toggle */}
            <div className="flex items-center gap-1 p-1 rounded-full bg-white/5 border border-white/10 flex-shrink-0">
              <button
                onClick={() => setSearchMode('saavn')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  searchMode === 'saavn'
                    ? 'bg-[#E2FB5E] text-black shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                JioSaavn
              </button>
              <button
                onClick={() => setSearchMode('youtube')}
                className={`px-3 py-1 rounded-full text-[11px] font-bold transition-all ${
                  searchMode === 'youtube'
                    ? 'bg-[#E2FB5E] text-black shadow-md'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                YT Music
              </button>
            </div>
          </div>
            
          <div className="flex items-center gap-4 flex-shrink-0">
            <button className="opacity-60 hover:opacity-100 transition-opacity"><TicketIcon /></button>
            <button className="opacity-60 hover:opacity-100 transition-opacity relative">
              <BellIcon />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#E2FB5E] border-2 border-[#0f0f10]" />
            </button>
            <button className="opacity-60 hover:opacity-100 transition-opacity"><SettingsIcon /></button>
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" 
              alt="Profile"
              className="w-8 h-8 rounded-full object-cover border border-white/10 flex-shrink-0"
            />
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
          {isSearchSubmitted ? (
            <div className="flex-1 overflow-y-auto px-8 pb-8 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 28, color: '#fff' }}>
                    Results for "{searchQuery}"
                  </h1>
                  <p className="text-stone-500 text-sm mt-1">
                    Showing matches from {searchMode === 'saavn' ? 'JioSaavn' : 'YouTube Music'}
                  </p>
                </div>
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 rounded-full text-xs font-bold border hover:bg-white/5 transition-all"
                  style={{ borderColor: 'rgba(255,255,255,0.15)', color: '#fff' }}
                >
                  Back to Home
                </button>
              </div>

              {/* Artists Search Shelf */}
              {matchingArtists.length > 0 && (
                <div className="mb-10">
                  <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                    Artists
                  </h2>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                    {matchingArtists.map((artistItem) => (
                      <div
                        key={artistItem.id}
                        onClick={() => {
                          handleNavigate('artists', artistItem.id, null);
                          setIsSearchSubmitted(false);
                        }}
                        className="group relative rounded-[20px] p-4 transition-all duration-300 cursor-pointer flex flex-col hover:bg-white/[0.04] border border-transparent hover:border-white/5 bg-white/[0.01]"
                      >
                        <div className="relative aspect-square w-full rounded-2xl overflow-hidden mb-4 border border-white/5">
                          <img
                            src={artistItem.cover}
                            alt={artistItem.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                          <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300" style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)' }} />
                          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="w-10 h-10 rounded-full bg-[#E2FB5E] flex items-center justify-center text-black font-bold transform translate-y-3 group-hover:translate-y-0 transition-all duration-300 hover:scale-110">
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="5" y1="12" x2="19" y2="12"></line>
                                <polyline points="12 5 19 12 12 19"></polyline>
                              </svg>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="text-white text-[14px] font-bold truncate group-hover:text-[#E2FB5E] transition-colors mb-1">
                            {artistItem.name}
                          </span>
                          <div className="flex items-center gap-1.5 text-stone-400 text-[11px] font-medium uppercase tracking-wider mb-0.5">
                            <span className="truncate">{artistItem.genre.split('/')[0].trim()}</span>
                          </div>
                          <span className="text-stone-500 text-[10px] font-semibold">{artistItem.monthlyListeners} Listeners</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Main Spotify double column */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
                {/* Top Result Card */}
                <div className="md:col-span-2 flex flex-col">
                  <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                    Top Result
                  </h2>
                  {searchResults[0] ? (
                    <div
                      onClick={() => handlePlayTrack(searchResults[0], searchResults)}
                      className="group flex-1 flex flex-col justify-end p-6 rounded-2xl relative overflow-hidden cursor-pointer transition-transform hover:scale-[1.01]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.05)',
                        minHeight: 280,
                      }}
                    >
                      <img
                        src={searchResults[0].cover}
                        alt=""
                        className="w-24 h-24 rounded-2xl object-cover shadow-2xl mb-6 border border-white/10"
                      />
                      <h3
                        style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 24, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                        dangerouslySetInnerHTML={{ __html: searchResults[0].title }}
                      />
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-stone-400 font-medium text-sm">{searchResults[0].artist}</span>
                      </div>
                      
                      {/* Floating Play Button */}
                      <div
                        className="absolute bottom-6 right-6 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transform translate-y-2 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                        style={{ background: '#E2FB5E' }}
                      >
                        <PlayIconGreen />
                      </div>
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center rounded-2xl border border-dashed border-white/10 text-stone-500">
                      No results
                    </div>
                  )}
                </div>

                {/* Songs list */}
                <div className="md:col-span-3 flex flex-col">
                  <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                    Songs
                  </h2>
                  <div className="flex flex-col gap-2">
                    {searchResults.slice(1, 6).map((song) => {
                      const isCurrent = currentTrack.id === song.id
                      const isLiked = likedTrackIds.includes(song.id)
                      return (
                        <div
                          key={song.id}
                          onClick={() => handlePlayTrack(song, searchResults)}
                          className="flex items-center justify-between p-2 rounded-xl hover:bg-white/5 transition-all cursor-pointer group"
                          style={{ background: isCurrent ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <img
                              src={song.cover}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: isCurrent ? '#E2FB5E' : '#fff' }}
                                className="truncate"
                                dangerouslySetInnerHTML={{ __html: song.title }}
                              />
                              <span className="text-stone-400 text-xs truncate">{song.artist}</span>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4 ml-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleLike(song.id)
                              }}
                              className="opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                              {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                            </button>
                            {song.duration && (
                              <span className="text-stone-500 text-xs font-semibold">{song.duration}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Extra search matches list */}
              {searchResults.length > 5 && (
                <div>
                  <h2 style={{ fontFamily: 'Inter, sans-serif', fontWeight: 900, fontSize: 18, color: '#fff', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: 16 }}>
                    All matches
                  </h2>
                  <div className="flex flex-col gap-2">
                    {searchResults.slice(5).map((track, index) => {
                      const isCurrent = currentTrack.id === track.id
                      const isLiked = likedTrackIds.includes(track.id)
                      return (
                        <div
                          key={track.id}
                          onClick={() => handlePlayTrack(track, searchResults)}
                          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/5 transition-all cursor-pointer"
                          style={{ background: isCurrent ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                        >
                          <div className="flex items-center gap-4 min-w-0 flex-1">
                            <span className="text-stone-500 font-bold text-xs w-6 flex-shrink-0">
                              {String(index + 6).padStart(2, '0')}
                            </span>
                            <img
                              src={track.cover}
                              alt=""
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
                            />
                            <div className="flex flex-col min-w-0">
                              <span
                                style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700, fontSize: 14, color: isCurrent ? '#E2FB5E' : '#fff' }}
                                className="truncate"
                                dangerouslySetInnerHTML={{ __html: track.title }}
                              />
                              <span className="text-stone-400 text-xs truncate">{track.artist}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                handleToggleLike(track.id)
                              }}
                            >
                              {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                            </button>
                            {track.duration && (
                              <span className="text-stone-500 text-xs">{track.duration}</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
              {renderPageContent()}
            </div>
          )}
        </div>

        {/* Bottom player */}
        <BottomPlayer 
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          isLiked={likedTrackIds.includes(currentTrack.id)}
          onToggleLike={() => handleToggleLike(currentTrack.id)}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          volume={volume}
          onVolumeChange={setVolume}
          isShuffle={isShuffle}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          isRepeat={isRepeat}
          onToggleRepeat={() => setIsRepeat(!isRepeat)}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          showLyrics={showLyrics}
          onToggleLyrics={() => setShowLyrics(v => !v)}
          hasLyrics={lyrics.length > 0}
          showNowPlaying={showNowPlaying}
          onToggleNowPlaying={() => setShowNowPlaying(v => !v)}
          onNavigateArtist={handleNavigateArtistByName}
        />
      </div>

      {/* Now Playing Side Panel */}
      {showNowPlaying && (
        <NowPlayingPanel
          currentTrack={currentTrack}
          isPlaying={isPlaying}
          onTogglePlay={handleTogglePlay}
          currentTime={currentTime}
          duration={duration}
          onSeek={handleSeek}
          isShuffle={isShuffle}
          onToggleShuffle={() => setIsShuffle(!isShuffle)}
          isRepeat={isRepeat}
          onToggleRepeat={() => setIsRepeat(!isRepeat)}
          onNext={handleNextTrack}
          onPrev={handlePrevTrack}
          lyrics={lyrics}
          activeLyricIdx={activeLyricIdx}
          queue={queue}
          queueIndex={queueIndex}
          onPlayTrackFromQueue={handlePlayTrack}
          onClose={() => setShowNowPlaying(false)}
          onNavigateArtist={handleNavigateArtistByName}
        />
      )}

      {/* Lyrics overlay */}
      {showLyrics && (
        <LyricsView
          lyrics={lyrics}
          activeLyricIdx={activeLyricIdx}
          hasSync={lyricsHasSync}
          track={currentTrack}
          onClose={() => setShowLyrics(false)}
        />
      )}
    </div>
    </AppContext.Provider>
  )
}
