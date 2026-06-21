import { Track } from '../App'
import { useState, useEffect, useRef } from 'react'

import imgProfileBanner from 'figma:asset/a7b31d91016b1bfaafcc04725a949a98c92026ac.png'
import imgProfilePic from 'figma:asset/1db58108fc3ac1546c7560ca3b72085a7af10bfc.png'

const HeartOutlineIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="currentColor" />
  </svg>
)

const HeartFilledIcon = () => (
  <svg width="16" height="15" viewBox="0 0 15.99 15.2483" fill="none">
    <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="var(--primary)" />
  </svg>
)

const DotsIcon = () => (
  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
    <path d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4ZM8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4ZM14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4Z" fill="currentColor" />
  </svg>
)

interface ArtistData {
  id: string;
  name: string;
  genre: string;
  cover: string;
  banner: string;
  followers: string;
  bio: string;
  popularTracks: Track[];
  albums: { id: string; title: string; year: string; cover: string }[];
}

export const artistsList: ArtistData[] = [
  {
    id: 'sabrina-carpenter',
    name: 'Sabrina Carpenter',
    genre: 'Pop / Dance',
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200',
    followers: '34.2M Followers',
    bio: 'Sabrina Annlynn Carpenter is an American singer and actress. She first gained recognition for her starring role in the Disney Channel series Girl Meets World. She signed with Hollywood Records and released her debut single in 2014.',
    popularTracks: [
      {"id": "yt_oqpyR015p8o", "title": "Espresso", "artist": "Sabrina Carpenter", "cover": "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300", "album": "Short n' Sweet", "duration": "2:55", "videoId": "oqpyR015p8o", "source": "youtube"},
      {"id": "yt_cPbqDmaIbOM", "title": "Please Please Please", "artist": "Sabrina Carpenter", "cover": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300", "album": "Short n' Sweet", "duration": "3:06", "videoId": "cPbqDmaIbOM", "source": "youtube"}
    ],
    albums: [
      { id: '1', title: "Short n' Sweet", year: '2024', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300' }
    ]
  },
  {
    id: 'arijit-singh',
    name: 'Arijit Singh',
    genre: 'Bollywood / Classical',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    followers: '85.4M Followers',
    bio: 'Arijit Singh is an Indian playback singer and music composer. He sings predominantly in Hindi and Bengali, but has also performed in various other Indian languages. He is the recipient of several accolades.',
    popularTracks: [
      {"id": "yt_VAdGW7QDJiU", "title": "Chaleya", "artist": "Anirudh Ravichander, Arijit Singh", "cover": "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300", "album": "Jawan", "duration": "3:20", "videoId": "VAdGW7QDJiU", "source": "youtube"},
      {"id": "yt_K3Qzzggn--s", "title": "Sajni", "artist": "Arijit Singh", "cover": "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300", "album": "Laapataa Ladies", "duration": "2:50", "videoId": "K3Qzzggn--s", "source": "youtube"},
      {"id": "yt_g7n3wV-o1kE", "title": "O Maahi", "artist": "Arijit Singh", "cover": "https://images.unsplash.com/photo-1506157786151-b8491531f063?q=80&w=300", "album": "Dunki", "duration": "3:53", "videoId": "g7n3wV-o1kE", "source": "youtube"}
    ],
    albums: [
      { id: 'jawan-ost', title: "Jawan (OST)", year: '2023', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300' }
    ]
  },
  {
    id: 'the-weeknd',
    name: 'The Weeknd',
    genre: 'R&B / Synthwave',
    cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=1200',
    followers: '68.9M Followers',
    bio: 'Abel Makkonen Tesfaye, known professionally as The Weeknd, is a Canadian singer-songwriter and record producer. Known for his sonic versatility and dark lyricism, his music explores escapism and romance.',
    popularTracks: [
      {"id": "yt_hYnBv4zHqSM", "title": "Lose Control", "artist": "Teddy Swims", "cover": "https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300", "album": "I've Tried Everything", "duration": "3:30", "videoId": "hYnBv4zHqSM", "source": "youtube"}
    ],
    albums: [
      { id: '2', title: 'Starboy', year: '2016', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300' }
    ]
  },
  {
    id: 'newjeans',
    name: 'NewJeans',
    genre: 'K-Pop / R&B',
    cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=1200',
    followers: '14.5M Followers',
    bio: 'NewJeans is a South Korean girl group formed by ADOR. The group is composed of five members: Minji, Hanni, Danielle, Haerin, and Hyein. They are known for their distinct 90s-infused pop styling.',
    popularTracks: [
      {"id": "yt_Q3K0TOv7D-o", "title": "How Sweet", "artist": "NewJeans", "cover": "https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300", "album": "How Sweet", "duration": "3:39", "videoId": "Q3K0TOv7D-o", "source": "youtube"}
    ],
    albums: [
      { id: '5', title: 'How Sweet', year: '2024', cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300' }
    ]
  },
  {
    id: 'karan-aujla',
    name: 'Karan Aujla',
    genre: 'Punjabi / Hip-Hop',
    cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=1200',
    followers: '12.8M Followers',
    bio: 'Jaskaran Singh "Karan" Aujla is an Indian singer, lyricist, and rapper known for his work in Punjabi music. He is widely popular for his chartbusting hits and international collaborations.',
    popularTracks: [
      {"id": "yt_LgY4LhRz3aY", "title": "Tauba Tauba", "artist": "Karan Aujla", "cover": "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300", "album": "Bad Newz", "duration": "3:27", "videoId": "LgY4LhRz3aY", "source": "youtube"},
      {"id": "yt_cHM8225e5o4", "title": "Softly", "artist": "Karan Aujla", "cover": "https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300", "album": "Making Memories", "duration": "2:36", "videoId": "cHM8225e5o4", "source": "youtube"}
    ],
    albums: [
      { id: '6', title: 'Making Memories', year: '2023', cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300' }
    ]
  },
  {
    id: 'billie-eilish',
    name: 'Billie Eilish',
    genre: 'Alternative / Pop',
    cover: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1200',
    followers: '54.1M Followers',
    bio: 'Billie Eilish Pirate Baird O\'Connell is an American singer-songwriter. She first gained public attention in 2015 with her debut single "Ocean Eyes", written and produced by her brother Finneas O\'Connell.',
    popularTracks: [
      {"id": "yt_d572V6eW9k4", "title": "Birds of a Feather", "artist": "Billie Eilish", "cover": "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=300", "album": "HIT ME HARD AND SOFT", "duration": "3:30", "videoId": "d572V6eW9k4", "source": "youtube"}
    ],
    albums: []
  },
  {
    id: 'kendrick-lamar',
    name: 'Kendrick Lamar',
    genre: 'Hip-Hop / Rap',
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
    followers: '28.9M Followers',
    bio: 'Kendrick Lamar Duckworth is an American rapper and songwriter. Known for his progressive musical styles and socially conscious songwriting, he is often considered one of the most influential hip-hop artists of his generation.',
    popularTracks: [
      {"id": "yt_T6eK-mIutjA", "title": "Not Like Us", "artist": "Kendrick Lamar", "cover": "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300", "album": "Not Like Us", "duration": "4:43", "videoId": "T6eK-mIutjA", "source": "youtube"}
    ],
    albums: []
  },
  {
    id: 'aespa',
    name: 'aespa',
    genre: 'K-Pop / EDM',
    cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300',
    banner: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=1200',
    followers: '10.2M Followers',
    bio: 'aespa is a South Korean girl group formed by SM Entertainment. The group consists of Karina, Giselle, Winter, and Ningning. They popularized the metaverse aesthetic and cyberpunk concepts in K-Pop.',
    popularTracks: [
      {"id": "yt_phuiiNCxRMg", "title": "Supernova", "artist": "aespa", "cover": "https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300", "album": "Armageddon", "duration": "2:59", "videoId": "phuiiNCxRMg", "source": "youtube"}
    ],
    albums: []
  }
];

interface ArtistsPageProps {
  activeArtistId: string | null
  onSelectArtist: (artistId: string | null) => void
  onPlayTrack: (track: Track, queue?: Track[]) => void
  likedTrackIds: string[]
  onToggleLike: (trackId: string) => void
  currentTrack: Track
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
  followedArtistIds?: string[]
  onToggleFollow?: (artistId: string) => void
}

export function ArtistsPage({
  activeArtistId,
  onSelectArtist,
  onPlayTrack,
  likedTrackIds,
  onToggleLike,
  currentTrack,
  onNavigate,
  followedArtistIds = [],
  onToggleFollow = () => {}
}: ArtistsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')
  const [isFollowersModalOpen, setIsFollowersModalOpen] = useState(false)
  const [modalFollowersList, setModalFollowersList] = useState<{ name: string; img: string; type: string }[]>([])
  const [isSpotlightLoading, setIsSpotlightLoading] = useState(false)

  // 300ms Search Debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setDebouncedQuery(searchQuery)
    }, 300)
    return () => clearTimeout(delay)
  }, [searchQuery])

  // Filter artists
  const filteredArtistsList = artistsList.filter(artist =>
    artist.name.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
    artist.genre.toLowerCase().includes(debouncedQuery.toLowerCase())
  )

  // Find selected artist
  let artist: ArtistData | undefined = artistsList.find(a => a.id === activeArtistId)
  if (activeArtistId && !artist) {
    const formattedName = activeArtistId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    artist = {
      id: activeArtistId,
      name: formattedName,
      genre: 'Trending Artist',
      cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=300',
      banner: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1200',
      followers: '5.2M Followers',
      bio: `${formattedName} is a popular recording artist streaming live on Lyrica. Check out their top releases below.`,
      popularTracks: [],
      albums: []
    }
  }

  // Handle opening followers modal
  const openFollowersModal = (title: string) => {
    // Generate some mock followers
    setModalFollowersList([
      { name: 'Sarah Connor', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80', type: 'Verified Fan' },
      { name: 'Marcus Aurelius', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80', type: 'Producer' },
      { name: 'Elena Rostova', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&h=80&q=80', type: 'Artist' },
      { name: 'Kenji Sato', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80', type: 'Billboard Curator' },
    ])
    setIsFollowersModalOpen(true)
  }

  // Spotlight active status check
  const isSpotlightPlaying = currentTrack && (
    currentTrack.title.toLowerCase().includes('espresso') || 
    currentTrack.album?.toLowerCase().includes('sweet') ||
    currentTrack.id.toString().startsWith('yt_')
  )

  const handleSpotlightTuneIn = () => {
    setIsSpotlightLoading(true)
    setTimeout(() => {
      // Play Espresso (Sabrina Carpenter) as default Spotlight track
      const spotlightTrack: Track = {
        id: "yt_oqpyR015p8o",
        title: "Espresso",
        artist: "Sabrina Carpenter",
        cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300",
        album: "Short n' Sweet",
        duration: "2:55",
        videoId: "oqpyR015p8o",
        source: "youtube"
      }
      onPlayTrack(spotlightTrack, [spotlightTrack])
      setIsSpotlightLoading(false)
    }, 800)
  }

  // Keyboard navigation for Artists Grid
  const handleGridKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      const activeEl = document.activeElement;
      if (activeEl && activeEl.parentElement?.id === 'artists-grid') {
        e.preventDefault();
        const children = Array.from(activeEl.parentElement.children);
        const index = children.indexOf(activeEl);
        if (index === -1) return;
        
        let nextIndex = index;
        const columns = window.innerWidth >= 1024 ? 6 : window.innerWidth >= 640 ? 3 : 2;

        if (e.key === 'ArrowRight') {
          nextIndex = (index + 1) % children.length;
        } else if (e.key === 'ArrowLeft') {
          nextIndex = (index - 1 + children.length) % children.length;
        } else if (e.key === 'ArrowDown') {
          nextIndex = (index + columns) % children.length;
          if (nextIndex >= children.length) nextIndex = index; // bounds check
        } else if (e.key === 'ArrowUp') {
          nextIndex = (index - columns + children.length) % children.length;
          if (nextIndex < 0) nextIndex = index; // bounds check
        }

        (children[nextIndex] as HTMLElement).focus();
      }
    }
  }

  // RENDER DETAILED VIEW (Profile Screen)
  if (artist) {
    const isFollowing = followedArtistIds.includes(artist.id)
    return (
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 mt-6">
        {/* Back Button */}
        <button
          onClick={() => onSelectArtist(null)}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6 text-xs uppercase font-bold tracking-wider focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-md px-2 py-1"
          style={{ cursor: 'pointer', fontFamily: 'var(--font-sans)', minHeight: 44 }}
        >
          ← Back to Artists
        </button>

        {/* Artist Header Banner */}
        <div className="relative rounded-[24px] overflow-hidden mb-12 border border-white/5" style={{ minHeight: 320 }}>
          {/* Blurred Background Art */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img 
              src={artist.banner} 
              alt="" 
              className="w-full h-full object-cover scale-110 filter blur-2xl opacity-30" 
            />
          </div>

          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-[#0A0A0B]/40 to-transparent z-10" />

          {/* Banner Contents */}
          <div className="relative z-20 w-full h-full p-6 md:p-8 flex flex-col justify-end min-h-[320px]">
            {/* Responsive Hero stack layout */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
              {/* Photo Container */}
              <div 
                className="rounded-full overflow-hidden border-2 border-[var(--primary)] flex-shrink-0" 
                style={{ 
                  width: 120, 
                  height: 120, 
                  boxShadow: '0 0 24px rgba(212,245,0,0.35)' 
                }}
              >
                <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
              </div>

              {/* Profile Meta & Action Buttons */}
              <div className="flex flex-col gap-3 flex-1 min-w-0">
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  <span className="bg-[var(--primary-tint-12)] text-[var(--primary)] border border-primary/20 px-3 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>
                    VERIFIED ARTIST
                  </span>
                  
                  {/* Follow Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onToggleFollow(artist!.id);
                    }}
                    className={`px-4 py-1.5 rounded-full text-[10px] font-bold border transition-all duration-150 cursor-pointer uppercase tracking-wider hover:scale-[1.03] flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none`}
                    style={{
                      background: isFollowing ? 'var(--primary)' : 'transparent',
                      color: isFollowing ? 'var(--primary-foreground)' : 'var(--text)',
                      borderColor: isFollowing ? 'var(--primary)' : 'rgba(255,255,255,0.2)',
                      minHeight: 32,
                    }}
                  >
                    {isFollowing && (
                      <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                        <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    )}
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>

                  <button 
                    className="px-4 py-1.5 rounded-full text-[10px] font-bold border border-white/20 hover:bg-white/5 transition-all uppercase tracking-wider focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    style={{ minHeight: 32 }}
                  >
                    Message
                  </button>

                  <button 
                    className="p-2 rounded-full border border-white/20 hover:bg-white/5 transition-all text-white flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                    style={{ width: 32, height: 32 }}
                    title="More actions"
                  >
                    <DotsIcon />
                  </button>
                </div>

                <h1 
                  style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 44, color: 'var(--text)', lineHeight: 1.1 }}
                  className="truncate w-full"
                >
                  {artist.name}
                </h1>
                
                {/* Clickable Followers Stats */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-xs font-bold uppercase tracking-wider text-stone-400">
                  <button 
                    onClick={() => openFollowersModal(artist!.name)}
                    className="hover:text-[var(--primary)] hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none rounded px-1"
                  >
                    {artist.followers}
                  </button>
                  <span>•</span>
                  <span className="text-[var(--accent-secondary)]">{artist.genre}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - Popular Tracks */}
          <div className="lg:col-span-2">
            <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--text)', marginBottom: 24 }}>Popular Tracks</div>
            {artist.popularTracks.length > 0 ? (
              <div className="flex flex-col gap-2">
                {artist.popularTracks.map((track, idx) => {
                  const isCurrentPlaying = currentTrack.id === track.id
                  const isLiked = likedTrackIds.includes(track.id)
                  const numStr = String(idx + 1).padStart(2, '0')

                  return (
                    <button
                      key={track.id}
                      onClick={() => onPlayTrack(track, artist?.popularTracks)}
                      className="flex items-center justify-between px-4 rounded-[12px] hover:bg-white/5 transition-all duration-150 cursor-pointer text-left w-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      style={{ height: 60, background: isCurrentPlaying ? 'rgba(255,255,255,0.03)' : 'transparent', minHeight: 44 }}
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, color: isCurrentPlaying ? 'var(--primary)' : 'var(--text-muted)', width: 20, flexShrink: 0 }}>
                          {numStr}
                        </span>
                        <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, background: 'var(--surface-2)', border: '1px solid var(--border)' }}>
                          <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: isCurrentPlaying ? 'var(--primary)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {track.title}
                          </span>
                          <span className="text-[11px] text-stone-400 truncate">{track.artist}</span>
                        </div>
                      </div>
                      <div className="hidden sm:block flex-1 mx-4 truncate">
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)' }}>
                          {track.album || 'Single'}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 md:gap-6 flex-shrink-0">
                        <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>{track.duration || '3:30'}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onToggleLike(track.id)
                          }}
                          className="opacity-70 hover:opacity-100 transition-opacity p-2 hover:bg-white/5 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          {isLiked ? <HeartFilledIcon /> : <HeartOutlineIcon />}
                        </button>
                        <button 
                          className="opacity-70 hover:opacity-100 p-2 hover:bg-white/5 rounded-full focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                          style={{ width: 40, height: 40, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                          <DotsIcon />
                        </button>
                      </div>
                    </button>
                  )
                })}
              </div>
            ) : (
              <div className="text-stone-500 text-sm italic py-8" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                No custom popular tracks curated. Search above to find and play their songs!
              </div>
            )}
          </div>

          {/* Right - Bio & Albums */}
          <div className="flex flex-col gap-8">
            {/* Bio Box */}
            <div 
              className="rounded-[20px] p-6 flex flex-col gap-3" 
              style={{ 
                background: 'var(--glass-bg)', 
                backdropFilter: 'var(--glass-blur)', 
                border: 'var(--glass-border)' 
              }}
            >
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, color: 'var(--text)', letterSpacing: '1px', textTransform: 'uppercase' }}>Artist Bio</div>
              <p className="text-stone-400 text-xs leading-relaxed" style={{ fontWeight: 400, fontFamily: 'var(--font-sans)' }}>{artist.bio}</p>
            </div>

            {/* Albums */}
            <div className="flex flex-col gap-4">
              <div style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 12, color: 'var(--text)', letterSpacing: '1px', textTransform: 'uppercase' }}>Albums</div>
              {artist.albums.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {artist.albums.map((album) => (
                    <button
                      key={album.id}
                      onClick={() => onNavigate('albums', null, album.id)}
                      className="group flex flex-col items-start p-3 rounded-[16px] transition-all text-left w-full hover:scale-[1.02] cursor-pointer focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                      style={{ 
                        background: 'var(--glass-bg)', 
                        backdropFilter: 'var(--glass-blur)', 
                        border: 'var(--glass-border)' 
                      }}
                    >
                      <div className="w-full aspect-square rounded-[12px] overflow-hidden mb-3 relative">
                        <img src={album.cover} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full flex items-center justify-center bg-primary text-black">
                            <svg width="8" height="10" viewBox="0 0 11 14" fill="none">
                              <path d="M1.5 8.75V1.25L7.25 5L1.5 8.75Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                            </svg>
                          </div>
                        </div>
                      </div>
                      <span className="truncate text-white text-xs font-bold w-full block" style={{ fontFamily: 'var(--font-sans)' }}>{album.title}</span>
                      <span className="text-stone-500 text-[10px] uppercase font-bold tracking-wider mt-1" style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>{album.year}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-stone-500 text-xs italic" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>No albums listed.</div>
              )}
            </div>
          </div>
        </div>

        {/* Followers List Modal Overlay */}
        {isFollowersModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div 
              className="w-full max-w-md rounded-3xl p-6 relative"
              style={{
                background: 'var(--glass-bg)',
                backdropFilter: 'var(--glass-blur)',
                border: 'var(--glass-border)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
              }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-serif italic text-2xl text-white">Verified Followers</h3>
                <button 
                  onClick={() => setIsFollowersModalOpen(false)}
                  className="text-stone-400 hover:text-white w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                  style={{ width: 44, height: 44 }}
                >
                  ✕
                </button>
              </div>
              <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
                {modalFollowersList.map((f, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={f.img} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                      <span className="font-sans text-sm font-semibold text-white">{f.name}</span>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      f.type === 'Artist' 
                        ? 'bg-[var(--accent-secondary-tint-12)] text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/20' 
                        : 'bg-white/5 text-stone-400'
                    }`}>
                      {f.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // RENDER DIRECTORY HUB (Default Hub Screen)
  return (
    <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-8 mt-6">
      {/* Bento Header Container */}
      <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 mb-12">
        {/* User Hero Profile Card (2 columns on lg) */}
        <div 
          className="lg:col-span-2 relative rounded-[24px] overflow-hidden flex flex-col justify-end min-h-[280px]" 
          style={{ 
            background: 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-blur)', 
            border: 'var(--glass-border)' 
          }}
        >
          {/* Blurred Background Banner */}
          <div className="absolute inset-0 opacity-20 pointer-events-none">
            <img src={imgProfileBanner} alt="" className="w-full h-full object-cover" />
          </div>
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0B] via-transparent to-transparent" />
          
          {/* Content at bottom */}
          <div className="relative p-6 md:p-8 flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
            {/* User Profile avatar with accent glowing ring */}
            <div
              className="flex-shrink-0 rounded-full overflow-hidden p-1 relative cursor-pointer hover:scale-105 transition-transform"
              onClick={() => openFollowersModal('Alex Rivera')}
              style={{ 
                width: 100, 
                height: 100, 
                border: '2px solid var(--primary)', 
                boxShadow: '0 0 20px rgba(212,245,0,0.3)' 
              }}
            >
              <img src={imgProfilePic} alt="Alex Rivera" className="w-full h-full object-cover rounded-full" />
            </div>

            {/* Name and stats */}
            <div className="flex flex-col gap-2 min-w-0">
              <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 40, color: 'var(--text)', lineHeight: 1.1 }}>
                Alex Rivera
              </h1>
              
              {/* Stats triggers */}
              <div className="flex flex-wrap justify-center sm:justify-start gap-6 mt-1">
                <button 
                  onClick={() => openFollowersModal('Playlists')}
                  className="font-sans text-xs hover:text-[var(--primary)] hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none rounded px-1"
                >
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'white' }}>128</strong> <span style={{ color: 'var(--text-muted)' }}>Playlists</span>
                </button>
                <button 
                  onClick={() => openFollowersModal('Followers')}
                  className="font-sans text-xs hover:text-[var(--primary)] hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none rounded px-1"
                >
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'white' }}>2.4k</strong> <span style={{ color: 'var(--text-muted)' }}>Followers</span>
                </button>
                <button 
                  onClick={() => openFollowersModal('Following')}
                  className="font-sans text-xs hover:text-[var(--primary)] hover:underline transition-colors focus-visible:ring-1 focus-visible:ring-primary focus-visible:outline-none rounded px-1"
                >
                  <strong style={{ fontFamily: 'var(--font-mono)', color: 'white' }}>582</strong> <span style={{ color: 'var(--text-muted)' }}>Following</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Weekly Spotlight Card (1 column on lg) */}
        <div 
          className="rounded-[24px] p-6 relative overflow-hidden flex flex-col justify-end min-h-[220px]" 
          style={{ 
            background: 'var(--glass-bg)', 
            backdropFilter: 'var(--glass-blur)', 
            border: 'var(--glass-border)',
            boxShadow: '0 12px 24px rgba(0,0,0,0.3)'
          }}
        >
          {/* Blurred Album Art cover background */}
          <div 
            className="absolute inset-0 z-0 opacity-15 filter blur-xl scale-110 pointer-events-none"
            style={{
              backgroundImage: `url(https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300)`,
              backgroundPosition: 'center',
              backgroundSize: 'cover',
            }}
          />

          {/* Accent decoration */}
          <div className="absolute top-0 right-0 w-24 h-24" style={{ background: 'radial-gradient(circle, rgba(212,245,0,0.1) 0%, rgba(212,245,0,0) 70%)' }} />
          
          <div className="relative z-10 flex flex-col gap-4">
            <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 700, fontSize: 10, color: 'var(--primary)', letterSpacing: '1.5px', textTransform: 'uppercase' }}>
              Weekly Spotlight
            </span>
            <div className="flex flex-col gap-1">
              <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>Espresso Hits</div>
              <div style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>By Sabrina Carpenter</div>
            </div>
            
            <button
              onClick={handleSpotlightTuneIn}
              className="mt-2 w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all duration-150 hover:scale-[1.02] hover:brightness-110 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)', fontFamily: 'var(--font-sans)', minHeight: 44 }}
            >
              {isSpotlightLoading ? (
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : isSpotlightPlaying ? (
                <>
                  <span className="text-[10px]">Tuning In</span>
                  {/* Equalizer animation */}
                  <div className="flex items-end gap-1 h-3.5 w-4 justify-center">
                    <div className={`eq-bar animating`} style={{ background: 'black', width: 2, height: 4 }} />
                    <div className={`eq-bar animating`} style={{ background: 'black', width: 2, height: 4 }} />
                    <div className={`eq-bar animating`} style={{ background: 'black', width: 2, height: 4 }} />
                  </div>
                </>
              ) : (
                'Tune In'
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Directory Hub grid/carousel list */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
          <div>
            <span style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 24, color: 'var(--text)' }}>
              Top Artists
            </span>
            <div className="text-stone-500 text-xs mt-1" style={{ fontFamily: 'var(--font-sans)' }}>
              Discover verified profiles and billboard trending stars.
            </div>
          </div>
          
          {/* Search bar inside directory */}
          <input
            type="text"
            placeholder="Search artists..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-4 py-2.5 rounded-full bg-white/5 border border-white/10 text-white outline-none text-xs w-full max-w-[240px] focus:border-[var(--primary)] focus:scale-[1.01] transition-all focus:shadow-[0_0_12px_rgba(212,245,0,0.1)] focus:outline-none"
            style={{ fontFamily: 'var(--font-sans)', minHeight: 36 }}
          />
        </div>

        {/* Directory List Container */}
        {filteredArtistsList.length > 0 ? (
          <div 
            id="artists-grid"
            onKeyDown={handleGridKeyDown}
            className="flex md:grid overflow-x-auto md:overflow-x-visible snap-x snap-mandatory md:snap-none scrollbar-hide grid-cols-3 lg:grid-cols-6 gap-6 pb-6"
          >
            {filteredArtistsList.map((artistItem) => {
              const userFollows = followedArtistIds.includes(artistItem.id)
              return (
                <button
                  key={artistItem.id}
                  onClick={() => onSelectArtist(artistItem.id)}
                  className="snap-center flex-shrink-0 w-[160px] md:w-auto group flex flex-col items-center cursor-pointer transition-all duration-150 hover:scale-[1.03] text-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none rounded-xl p-2"
                >
                  {/* Circular image wrapper */}
                  <div className="w-[120px] h-[120px] xl:w-[140px] xl:h-[140px] overflow-hidden rounded-full border-2 border-transparent group-hover:border-[var(--primary)] group-hover:shadow-[0_0_15px_rgba(212,245,0,0.25)] transition-all relative flex-shrink-0">
                    <img src={artistItem.cover} alt={artistItem.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-primary text-[10px] font-black uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>
                        VIEW
                      </span>
                    </div>

                    {/* Following badge dot */}
                    {userFollows && (
                      <div 
                        className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-[var(--primary)] text-black flex items-center justify-center shadow-lg border border-black"
                        title="Following"
                      >
                        <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                          <path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    )}
                  </div>
                  
                  {/* Info Block */}
                  <div className="mt-3 flex flex-col items-center w-full min-w-0">
                    <span 
                      className="text-white text-xs font-bold text-center group-hover:text-[var(--primary)] transition-colors w-full block truncate px-2" 
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {artistItem.name}
                    </span>
                    <span 
                      className="text-stone-500 text-[9px] font-bold tracking-wider uppercase mt-1 w-full block truncate px-2" 
                      style={{ fontFamily: 'var(--font-sans)' }}
                    >
                      {artistItem.genre}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        ) : (
          /* Premium Empty state */
          <div 
            className="flex flex-col items-center justify-center py-16 rounded-[24px] text-center px-6"
            style={{ 
              background: 'var(--glass-bg)', 
              border: 'var(--glass-border)',
              backdropFilter: 'var(--glass-blur)' 
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" className="text-stone-500 mb-4 animate-bounce">
              <path d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <h3 className="font-serif italic text-xl text-white mb-2">No artists found</h3>
            <p className="font-sans text-xs text-stone-400 max-w-sm">
              Try searching with a different name, genre, or discover other verified stars from our list.
            </p>
          </div>
        )}
      </div>

      {/* Followers List Modal Overlay (Hub view) */}
      {isFollowersModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div 
            className="w-full max-w-md rounded-3xl p-6 relative"
            style={{
              background: 'var(--glass-bg)',
              backdropFilter: 'var(--glass-blur)',
              border: 'var(--glass-border)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif italic text-2xl text-white">Verified Followers</h3>
              <button 
                onClick={() => setIsFollowersModalOpen(false)}
                className="text-stone-400 hover:text-white w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
                style={{ width: 44, height: 44 }}
              >
                ✕
              </button>
            </div>
            <div className="flex flex-col gap-4 max-h-[300px] overflow-y-auto pr-1">
              {modalFollowersList.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={f.img} alt="" className="w-10 h-10 rounded-full object-cover border border-white/10" />
                    <span className="font-sans text-sm font-semibold text-white">{f.name}</span>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    f.type === 'Artist' 
                      ? 'bg-[var(--accent-secondary-tint-12)] text-[var(--accent-secondary)] border border-[var(--accent-secondary)]/20' 
                      : 'bg-white/5 text-stone-400'
                  }`}>
                    {f.type}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
