import { Track } from '../App'
import { useState } from 'react'
import { PlaylistPopover } from './PlaylistPopover'

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

const DotsIcon = () => (
  <svg width="16" height="4" viewBox="0 0 16 4" fill="none">
    <path d="M2 4C1.45 4 0.979167 3.80417 0.5875 3.4125C0.195833 3.02083 0 2.55 0 2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0C2.55 0 3.02083 0.195833 3.4125 0.5875C3.80417 0.979167 4 1.45 4 2C4 2.55 3.80417 3.02083 3.4125 3.4125C3.02083 3.80417 2.55 4 2 4ZM8 4C7.45 4 6.97917 3.80417 6.5875 3.4125C6.19583 3.02083 6 2.55 6 2C6 1.45 6.19583 0.979167 6.5875 0.5875C6.97917 0.195833 7.45 0 8 0C8.55 0 9.02083 0.195833 9.4125 0.5875C9.80417 0.979167 10 1.45 10 2C10 2.55 9.80417 3.02083 9.4125 3.4125C9.02083 3.80417 8.55 4 8 4ZM14 4C13.45 4 12.9792 3.80417 12.5875 3.4125C12.1958 3.02083 12 2.55 12 2C12 1.45 12.1958 0.979167 12.5875 0.5875C12.9792 0.195833 13.45 0 14 0C14.55 0 15.0208 0.195833 15.4125 0.5875C15.8042 0.979167 16 1.45 16 2C16 2.55 15.8042 3.02083 15.4125 3.4125C15.0208 3.80417 14.55 4 14 4Z" fill="#78716c" />
  </svg>
)

interface AlbumData {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  year: string;
  tracksCount: number;
  cover: string;
  tracks: Track[];
}

export const albumsList: AlbumData[] = [
  {
    id: '1',
    title: "Short n' Sweet",
    artist: 'Sabrina Carpenter',
    artistId: 'sabrina-carpenter',
    year: '2024',
    tracksCount: 2,
    cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300',
    tracks: [
      { id: 'yt_oqpyR015p8o', title: 'Espresso', artist: 'Sabrina Carpenter', cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300', album: "Short n' Sweet", duration: '2:55', videoId: 'oqpyR015p8o', source: 'youtube' },
      { id: 'yt_cPbqDmaIbOM', title: 'Please Please Please', artist: 'Sabrina Carpenter', cover: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?q=80&w=300', album: "Short n' Sweet", duration: '3:06', videoId: 'cPbqDmaIbOM', source: 'youtube' }
    ]
  },
  {
    id: '2',
    title: 'Starboy',
    artist: 'The Weeknd',
    artistId: 'the-weeknd',
    year: '2016',
    tracksCount: 2,
    cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300',
    tracks: [
      { id: 'yt_hYnBv4zHqSM', title: 'Lose Control', artist: 'Teddy Swims', cover: 'https://images.unsplash.com/photo-1498038432885-c6f3f1b912ee?q=80&w=300', album: 'Starboy', duration: '3:30', videoId: 'hYnBv4zHqSM', source: 'youtube' },
      { id: 'yt_1', title: 'Starboy', artist: 'The Weeknd', cover: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=300', album: 'Starboy', duration: '3:50', videoId: 'JX8Y6KQD4g4', source: 'youtube' }
    ]
  },
  {
    id: 'jawan-ost',
    title: 'Jawan (OST)',
    artist: 'Arijit Singh',
    artistId: 'arijit-singh',
    year: '2023',
    tracksCount: 1,
    cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300',
    tracks: [
      { id: 'yt_VAdGW7QDJiU', title: 'Chaleya', artist: 'Anirudh Ravichander, Arijit Singh', cover: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=300', album: 'Jawan', duration: '3:20', videoId: 'VAdGW7QDJiU', source: 'youtube' }
    ]
  },
  {
    id: '5',
    title: 'How Sweet',
    artist: 'NewJeans',
    artistId: 'newjeans',
    year: '2024',
    tracksCount: 1,
    cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300',
    tracks: [
      { id: 'yt_Q3K0TOv7D-o', title: 'How Sweet', artist: 'NewJeans', cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300', album: 'How Sweet', duration: '3:39', videoId: 'Q3K0TOv7D-o', source: 'youtube' }
    ]
  },
  {
    id: '6',
    title: 'Making Memories',
    artist: 'Karan Aujla',
    artistId: 'karan-aujla',
    year: '2023',
    tracksCount: 2,
    cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300',
    tracks: [
      { id: 'yt_LgY4LhRz3aY', title: 'Tauba Tauba', artist: 'Karan Aujla', cover: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?q=80&w=300', album: 'Bad Newz', duration: '3:27', videoId: 'LgY4LhRz3aY', source: 'youtube' },
      { id: 'yt_cHM8225e5o4', title: 'Softly', artist: 'Karan Aujla', cover: 'https://images.unsplash.com/photo-1526218626217-dc65b29bb444?q=80&w=300', album: 'Making Memories', duration: '2:36', videoId: 'cHM8225e5o4', source: 'youtube' }
    ]
  }
];

interface AlbumsPageProps {
  activeAlbumId: string | null
  onSelectAlbum: (albumId: string | null) => void
  onPlayTrack: (track: Track, queue?: Track[]) => void
  likedTrackIds: string[]
  onToggleLike: (trackId: string) => void
  currentTrack: Track
  onSelectArtist: (artistId: string | null) => void
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
}

export function AlbumsPage({
  activeAlbumId,
  onSelectAlbum,
  onPlayTrack,
  likedTrackIds,
  onToggleLike,
  currentTrack,
  onSelectArtist,
  onNavigate
}: AlbumsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')

  // Search filter
  const filteredAlbums = albumsList.filter(album =>
    album.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    album.artist.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Find selected album or construct dynamic fallback
  let album: AlbumData | undefined = albumsList.find(a => a.id === activeAlbumId)

  if (activeAlbumId && !album) {
    const formattedTitle = activeAlbumId
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')

    album = {
      id: activeAlbumId,
      title: formattedTitle,
      artist: 'Various Artists',
      artistId: 'various-artists',
      year: '2024',
      tracksCount: 1,
      cover: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300',
      tracks: []
    }
  }

  // RENDER ALBUM DETAILS VIEW
  if (album) {
    return (
      <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
        {/* Back Button */}
        <button
          onClick={() => onSelectAlbum(null)}
          className="flex items-center gap-2 text-stone-400 hover:text-white transition-colors mb-6 text-xs uppercase font-bold tracking-wider"
          style={{ cursor: 'pointer', fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}
        >
          ← Back to Albums
        </button>

        {/* Album Header Header Box */}
        <div className="flex flex-col md:flex-row gap-8 items-end mb-12">
          {/* Cover Art */}
          <div className="rounded-[24px] overflow-hidden shadow-2xl flex-shrink-0" style={{ width: 220, height: 220, border: '1px solid var(--border)' }}>
            <img src={album.cover} alt={album.title} className="w-full h-full object-cover" />
          </div>

          {/* Details */}
          <div className="flex flex-col gap-3 min-w-0">
            <div>
              <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>ALBUM</span>
            </div>
            <h1 className="text-white font-extrabold truncate" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 44, letterSpacing: '-1px', lineHeight: 1.1 }}>{album.title}</h1>
            <div className="flex items-center flex-wrap gap-2 text-xs font-bold text-stone-400" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
              <span
                onClick={() => onSelectArtist(album?.artistId || null)}
                className="text-white hover:underline cursor-pointer"
              >
                {album.artist}
              </span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              <span style={{ fontFamily: 'var(--font-mono)' }}>{album.year}</span>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }} />
              <span>{album.tracksCount} Songs</span>
            </div>
          </div>
        </div>

        {/* Album Play controls */}
        {album.tracks.length > 0 && (
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={() => onPlayTrack(album!.tracks[0], album!.tracks)}
              className="px-6 py-3 rounded-full font-bold text-xs uppercase tracking-wider bg-primary text-black shadow-lg hover:scale-105 transition-transform"
              style={{ fontFamily: 'var(--font-sans)', color: 'var(--background)' }}
            >
              Play Album
            </button>
          </div>
        )}

        {/* Tracks List */}
        <div>
          <div style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--text)', marginBottom: 24 }}>Album Tracks</div>
          {album.tracks.length > 0 ? (
            <div className="flex flex-col gap-2">
              {album.tracks.map((track, idx) => {
                const isCurrentPlaying = currentTrack.id === track.id
                const isLiked = likedTrackIds.includes(track.id)
                const numStr = String(idx + 1).padStart(2, '0')

                return (
                  <div
                    key={track.id}
                    onClick={() => onPlayTrack(track, album?.tracks)}
                    className="flex items-center justify-between px-4 rounded-[12px] hover:bg-white/5 transition-colors cursor-pointer"
                    style={{ height: 60, background: isCurrentPlaying ? 'rgba(255,255,255,0.03)' : 'transparent' }}
                  >
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 500, fontSize: 12, color: isCurrentPlaying ? 'var(--primary)' : 'var(--text-muted)', width: 20, flexShrink: 0 }}>
                        {numStr}
                      </span>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: isCurrentPlaying ? 'var(--primary)' : 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {track.title}
                        </span>
                        <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 11, color: 'var(--text-muted)' }}>{track.artist}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>{track.duration || '3:30'}</span>
                      <div onClick={(e) => e.stopPropagation()} className="opacity-70 hover:opacity-100 transition-opacity flex items-center justify-center">
                        <PlaylistPopover track={track} />
                      </div>
                      <button className="opacity-70 hover:opacity-100"><DotsIcon /></button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-stone-500 text-sm italic py-8" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
              No tracks loaded for this album catalog.
            </div>
          )}
        </div>
      </div>
    )
  }

  // RENDER DIRECTORY HUB (Default View)
  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: 'var(--text)' }}>Trending Albums</h1>
          <div className="text-stone-500 text-xs mt-1" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>Explore curated high-fidelity albums and original soundtracks.</div>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search albums..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-2 rounded-full bg-white/5 border border-white/5 text-white outline-none text-xs w-full max-w-[240px]"
          style={{ fontFamily: 'var(--font-sans)', border: '1px solid var(--border)' }}
        />
      </div>

      {/* Albums grid */}
      <div
        className="grid gap-8"
        style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' }}
      >
        {filteredAlbums.map((albumItem) => (
          <div
            key={albumItem.id}
            onClick={() => onSelectAlbum(albumItem.id)}
            className="group p-5 rounded-[24px] cursor-pointer transition-all duration-300"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            {/* Cover image wrapper */}
            <div className="w-full aspect-square rounded-[16px] overflow-hidden mb-6 relative shadow-lg border border-white/5">
              <img src={albumItem.cover} alt={albumItem.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center bg-primary text-black shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (albumItem.tracks.length > 0) {
                      onPlayTrack(albumItem.tracks[0], albumItem.tracks)
                    }
                  }}
                >
                  <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                    <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Album info */}
            <div className="flex flex-col gap-1">
              <span className="truncate text-white text-base font-bold group-hover:text-primary transition-colors" style={{ fontFamily: 'var(--font-sans)' }}>{albumItem.title}</span>
              <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 13, color: 'var(--text-muted)' }}>{albumItem.artist}</span>
              <div className="flex items-center gap-2 mt-2">
                <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>{albumItem.year}</span>
                <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--border)' }} />
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 12, color: 'var(--text-muted)' }}>{albumItem.tracksCount} Tracks</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
