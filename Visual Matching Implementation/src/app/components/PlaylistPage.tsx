import { useState } from 'react'
import { Track, useAppContext } from '../App'
import { PlaylistPopover } from './PlaylistPopover'
import imgTrack1 from 'figma:asset/14e70c7b032c1011dac6585594e2485187ee4b38.png'
import imgTrack2 from 'figma:asset/746c0f3335f4ce57c6ce8e8b0a80b9e3e46fbcc9.png'
import imgTrack3 from 'figma:asset/4ff19e7ec1c13a77562fcc29c262bba0e0652e9b.png'
import imgNowPlaying from 'figma:asset/4ee233c9fd9f345420928c5ccf8cba2ae01305c9.png'
import imgNightDrive from 'figma:asset/4f7dc13643565ba86b4c99b49f6d85abbcc197cf.png'
import imgApathy from 'figma:asset/e0d808bf1292af2ff08e473758f65ef4dbcf6f56.png'

const SparkleIcon = () => (
  <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5">
    <path d="M8 0a.75.75 0 0 1 .693.465l1.63 3.805 3.806 1.63a.75.75 0 0 1 0 1.386l-3.806 1.63-1.63 3.806a.75.75 0 0 1-1.386 0l-1.63-3.806-3.805-1.63a.75.75 0 0 1 0-1.386l3.805-1.63 1.63-3.805A.75.75 0 0 1 8 0z" />
  </svg>
)

const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <path d="M13.8333 15L8.58333 9.75C8.16667 10.0833 7.6875 10.3472 7.14583 10.5417C6.60417 10.7361 6.02778 10.8333 5.41667 10.8333C3.90278 10.8333 2.62153 10.309 1.57292 9.26042C0.524305 8.21181 0 6.93056 0 5.41667C0 3.90278 0.524305 2.62153 1.57292 1.57292C2.62153 0.524305 3.90278 0 5.41667 0C6.93056 0 8.21181 0.524305 9.26042 1.57292C10.309 2.62153 10.8333 3.90278 10.8333 5.41667C10.8333 6.02778 10.7361 6.60417 10.5417 7.14583C10.3472 7.6875 10.0833 8.16667 9.75 8.58333L15 13.8333L13.8333 15V15M5.41667 9.16667C6.45833 9.16667 7.34375 8.80208 8.07292 8.07292C8.80208 7.34375 9.16667 6.45833 9.16667 5.41667C9.16667 4.375 8.80208 3.48958 8.07292 2.76042C7.34375 2.03125 6.45833 1.66667 5.41667 1.66667C4.375 1.66667 3.48958 2.03125 2.76042 2.76042C2.03125 3.48958 1.66667 4.375 1.66667 5.41667C1.66667 6.45833 2.03125 7.34375 2.76042 8.07292C3.48958 8.80208 4.375 9.16667 5.41667 9.16667V9.16667" fill="#78716c" />
  </svg>
)

const BellIcon = () => (
  <svg width="16" height="17" viewBox="0 0 14 17" fill="none">
    <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0" fill="white" fillOpacity={0.5} />
  </svg>
)

const SettingsIcon = () => (
  <svg width="17" height="17" viewBox="0 0 16.75 16.6667" fill="none">
    <path d="M6.08333 16.6667L5.75 14C5.56944 13.9306 5.39931 13.8472 5.23958 13.75C5.07986 13.6528 4.92361 13.5486 4.77083 13.4375L2.29167 14.4792L0 10.5208L2.14583 8.89583C2.13194 8.79861 2.125 8.70486 2.125 8.61458V8.33333V8.05208C2.125 7.96181 2.13194 7.86806 2.14583 7.77083L0 6.14583L2.29167 2.1875L4.77083 3.22917C4.92361 3.11806 5.08333 3.01389 5.25 2.91667C5.41667 2.81944 5.58333 2.73611 5.75 2.66667L6.08333 0H10.6667L11 2.66667C11.1806 2.73611 11.3507 2.81944 11.5104 2.91667C11.6701 3.01389 11.8264 3.11806 11.9792 3.22917L14.4583 2.1875L16.75 6.14583L14.6042 7.77083V8.33333V8.89583L16.7292 10.5208L14.4375 14.4792L11.9792 13.4375C11.8264 13.5486 11.6667 13.6528 11.5 13.75C11.3333 13.8472 11.1667 13.9306 11 14L10.6667 16.6667H6.08333" fill="white" fillOpacity={0.5} />
  </svg>
)

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

const TrashIcon = () => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none">
    <path d="M1 14C1 14.55 1.2 15.0208 1.6 15.4125C2.0 15.8042 2.45 16 3 16H11C11.55 16 12.0208 15.8042 12.4125 15.4125C12.8042 15.0208 13 14.55 13 14V4H1V14ZM14 1H10.5L9.5 0H4.5L3.5 1H0V3H14V1Z" fill="#ef4444" fillOpacity={0.7} />
  </svg>
)

interface PlaylistPageProps {
  playlistId: string
  title: string
  description: string
  coverUrl?: string
  onPlayTrack: (track: Track, queue?: Track[]) => void
  currentTrack: Track
  likedTrackIds: string[]
  onToggleLike: (trackId: string) => void
  playlistTracks: Track[]
  onDeletePlaylist?: () => void
  onRenamePlaylist?: () => void
  onRemoveTrack?: (songId: string) => void
  allTracks?: Track[]
  onAddTrack?: (songId: string) => void
}

export function PlaylistPage({
  playlistId,
  title,
  description,
  coverUrl,
  onPlayTrack,
  currentTrack,
  likedTrackIds,
  onToggleLike,
  playlistTracks = [],
  onDeletePlaylist,
  onRenamePlaylist,
  onRemoveTrack,
  allTracks = [],
  onAddTrack,
}: PlaylistPageProps) {
  const { handleGeneratePlaylistCover } = useAppContext()
  const [generating, setGenerating] = useState(false)

  const handleGenerateCover = async () => {
    setGenerating(true)
    try {
      await handleGeneratePlaylistCover(playlistId)
    } catch (err) {
      console.error(err)
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      {/* Playlist Header Card */}
      <div
        className="rounded-[24px] p-8 mb-8 flex gap-8 items-end relative overflow-hidden"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
      >
        {/* Cover */}
        <div className="w-36 h-36 rounded-[16px] overflow-hidden flex-shrink-0 shadow-lg relative bg-neutral-900 border border-white/5">
          {coverUrl ? (
            <img
              src={coverUrl}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : playlistTracks[0]?.cover ? (
            <img
              src={playlistTracks[0]?.cover}
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <img
              src={playlistId === 'liked-songs' ? imgTrack2 : imgTrack1}
              alt={title}
              className="w-full h-full object-cover"
            />
          )}
          {playlistId === 'liked-songs' && (
            <div className="absolute inset-0 bg-primary/90 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 15.99 15.2483" fill="none">
                <path d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z" fill="var(--background)" />
              </svg>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <div>
            <span className="bg-primary/10 text-primary border border-primary/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider" style={{ fontFamily: 'var(--font-sans)' }}>PLAYLIST</span>
          </div>
          <h1 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 36, color: 'var(--text)', lineHeight: 1.1 }} className="truncate">{title}</h1>
          <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }} className="truncate">{description || 'No description'}</p>
          <div className="flex items-center gap-4 mt-2">
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)' }}>
              <strong style={{ fontFamily: 'var(--font-mono)', color: 'var(--text)' }}>{playlistTracks.length}</strong> songs
            </span>
            {playlistId !== 'liked-songs' && onRenamePlaylist && (
              <button
                onClick={onRenamePlaylist}
                className="text-xs text-primary hover:underline"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                Rename
              </button>
            )}

            {playlistId !== 'liked-songs' && !coverUrl && (
              <button
                onClick={handleGenerateCover}
                disabled={generating}
                className="text-xs bg-white/10 hover:bg-white/20 active:bg-white/30 text-primary border border-primary/30 px-3 py-1 rounded-full flex items-center gap-1 font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
                style={{ fontFamily: 'var(--font-sans)', backdropFilter: 'blur(8px)' }}
              >
                {generating ? (
                  <>
                    <span className="w-2.5 h-2.5 border-2 border-primary border-t-transparent rounded-full animate-spin"></span>
                    Generating...
                  </>
                ) : (
                  <>
                    <SparkleIcon />
                    Generate AI Cover
                  </>
                )}
              </button>
            )}

            {playlistId !== 'liked-songs' && onDeletePlaylist && (
              <button
                onClick={onDeletePlaylist}
                className="text-xs text-red-400 hover:underline flex items-center gap-1"
                style={{ fontFamily: 'var(--font-sans)' }}
              >
                <TrashIcon /> Delete
              </button>
            )}
          </div>
        </div>

        {/* Play all button */}
        {playlistTracks.length > 0 && (
          <button
            onClick={() => onPlayTrack(playlistTracks[0], playlistTracks)}
            className="w-14 h-14 rounded-full flex items-center justify-center bg-primary text-black shadow-lg hover:scale-105 transition-transform"
          >
            <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
              <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Playlist tracks table/list */}
      <div className="flex flex-col gap-2 mb-12">
        {playlistTracks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 rounded-[24px] border border-dashed border-white/10 bg-white/[0.01] text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 text-[#78716c]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M12 4V16C12 17.6569 10.6569 19 9 19C7.34315 19 6 17.6569 6 16C6 14.3431 7.34315 13 9 13C9.82843 13 10.5784 13.3358 11.1213 13.8787C11.6784 13.3213 12 12.35 12 11V4H18V8H14V4H12Z" fill="currentColor" />
              </svg>
            </div>
            <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontSize: 20, color: 'white', marginBottom: 6 }}>
              {playlistId === 'liked-songs' ? 'Your Liked Songs is empty' : 'This playlist is empty'}
            </h3>
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: 13, color: 'var(--text-muted)', maxWidth: 320, lineHeight: '1.4' }}>
              {playlistId === 'liked-songs'
                ? 'Heart your favorite tracks across the app to build your custom collection here.'
                : 'Find tracks and build your ultimate premium soundscape using the recommendations below.'}
            </p>
          </div>
        ) : (
          playlistTracks.map((track, index) => {
            const isLiked = likedTrackIds.includes(track.id)
            const isCurrent = currentTrack?.id === track.id
            return (
              <div
                key={track.id}
                className="group flex items-center px-6 rounded-[16px] hover:bg-white/5 transition-colors"
                style={{ height: 72 }}
              >
                {/* Index / Play action */}
                <div className="w-8 flex items-center">
                  <span className="group-hover:hidden text-[#78716c] font-medium" style={{ fontFamily: 'var(--font-mono)', fontSize: 13, color: 'var(--text-muted)' }}>
                    {index + 1}
                  </span>
                  <button
                    onClick={() => onPlayTrack(track, playlistTracks)}
                    className="hidden group-hover:block"
                  >
                    <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                      <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill={isCurrent ? 'var(--primary)' : 'white'} stroke={isCurrent ? 'var(--primary)' : 'white'} strokeWidth="1.5" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>

                {/* Cover & Title */}
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: 44, height: 44, border: '1px solid var(--border)' }}>
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span style={{
                      fontFamily: 'var(--font-sans)',
                      fontWeight: 600,
                      fontSize: 14,
                      color: isCurrent ? 'var(--primary)' : 'var(--text)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {track.title}
                    </span>
                    <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--text-muted)' }}>{track.artist}</span>
                  </div>
                </div>

                {/* Album */}
                <div className="flex-1 hidden md:block text-[#78716c] text-sm truncate px-4" style={{ fontFamily: 'var(--font-sans)', color: 'var(--text-muted)' }}>
                  {track.album || 'Single'}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-6">
                  {/* Like / Add to Playlist Popover */}
                  <PlaylistPopover track={track} />
                  {/* Remove Track Button */}
                  {playlistId !== 'liked-songs' && onRemoveTrack && (
                    <button
                      onClick={() => onRemoveTrack(track.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <TrashIcon />
                    </button>
                  )}
                  {/* Duration */}
                  <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)', width: 40, textAlign: 'right' }}>
                    {track.duration}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Add Tracks Section (if not liked-songs) */}
      {playlistId !== 'liked-songs' && onAddTrack && allTracks.length > 0 && (
        <div className="border-t pt-8" style={{ borderColor: 'var(--border)' }}>
          <h2 className="mb-6" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 22, color: 'var(--text)' }}>Recommended Songs</h2>
          <div className="flex flex-col gap-2">
            {allTracks
              .filter(t => !playlistTracks.some(pt => pt.id === t.id))
              .map((track) => (
                <div
                  key={track.id}
                  className="flex items-center justify-between px-6 rounded-[12px] hover:bg-white/5 transition-colors"
                  style={{ height: 60 }}
                >
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, border: '1px solid var(--border)' }}>
                      <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 14, color: 'var(--text)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {track.title}
                      </span>
                      <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: 'var(--text-muted)' }}>{track.artist}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => onAddTrack(track.id)}
                    className="px-4 py-1.5 rounded-full bg-white/5 hover:bg-primary text-white hover:text-black text-xs font-semibold transition-colors"
                    style={{ fontFamily: 'var(--font-sans)' }}
                  >
                    Add to Playlist
                  </button>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  )
}
