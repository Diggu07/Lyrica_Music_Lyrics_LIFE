import React, { useState, useEffect, useRef } from 'react'
import { useAppContext, Track } from '../App'

interface PlaylistPopoverProps {
  track: Track
  showText?: boolean // Whether to render "Add to Playlist" text alongside the icon (e.g. in table rows)
}

export const PlaylistPopover: React.FC<PlaylistPopoverProps> = ({ track, showText = false }) => {
  const {
    likedTrackIds,
    playlists,
    handleToggleLike,
    handleAddSongToPlaylist,
    handleRemoveSongFromPlaylist,
    handleCreatePlaylistAndAdd
  } = useAppContext()

  const [isOpen, setIsOpen] = useState(false)
  const [placement, setPlacement] = useState<'top' | 'bottom'>('top')
  const [isCreating, setIsCreating] = useState(false)
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const triggerRef = useRef<HTMLButtonElement>(null)
  const popoverRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const isLiked = likedTrackIds.includes(track.id)

  const handleOpenToggle = () => {
    if (!isOpen) {
      setError(null)
      setIsCreating(false)
      setNewPlaylistName('')
      
      // Calculate boundary placement
      if (triggerRef.current) {
        const rect = triggerRef.current.getBoundingClientRect()
        // If there's less than 280px space above, flip to bottom
        if (rect.top < 280) {
          setPlacement('bottom')
        } else {
          setPlacement('top')
        }
      }
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  // Escape key to close
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen])

  // Focus trap on open
  useEffect(() => {
    if (isOpen && popoverRef.current) {
      // Find first focusable element inside popover
      const focusable = popoverRef.current.querySelectorAll('button, input')
      if (focusable.length > 0) {
        (focusable[0] as HTMLElement).focus()
      }
    }
  }, [isOpen])

  // Focus input when creating playlist
  useEffect(() => {
    if (isCreating && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isCreating])

  const handleLikeClick = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setError(null)
    setIsLoading(true)
    try {
      await handleToggleLike(track.id, track)
    } catch (err) {
      setError('Failed to update liked songs.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePlaylistClick = async (e: React.MouseEvent, playlistId: string, isInPlaylist: boolean) => {
    e.stopPropagation()
    setError(null)
    setIsLoading(true)
    try {
      if (isInPlaylist) {
        await handleRemoveSongFromPlaylist(playlistId, track.id)
      } else {
        await handleAddSongToPlaylist(playlistId, track.id)
      }
    } catch (err) {
      setError('Failed to update playlist songs.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePlaylistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (!newPlaylistName.trim()) return

    setError(null)
    setIsLoading(true)
    try {
      await handleCreatePlaylistAndAdd(newPlaylistName.trim(), track.id)
      setIsCreating(false)
      setNewPlaylistName('')
      setIsOpen(false) // Close popover on success
    } catch (err) {
      setError('Failed to create playlist.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative inline-block">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        onClick={handleOpenToggle}
        aria-label="Add to Playlist or Like Song"
        aria-haspopup="true"
        aria-expanded={isOpen}
        style={{
          width: showText ? 'auto' : 36,
          height: 36,
          borderRadius: 12,
          border: 'none',
          cursor: 'pointer',
          transition: 'all 150ms ease-out',
        }}
        className={`flex items-center justify-center gap-2 text-stone-400 hover:text-white ${
          isOpen ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'
        } ${isLiked && !showText ? 'text-[#E2FB5E]' : ''}`}
      >
        <svg width="18" height="18" viewBox="0 0 16 15" fill="none">
          {isLiked ? (
            <path
              d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z"
              fill="currentColor"
            />
          ) : (
            <path
              d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483ZM4.39725 1.62934C3.59371 1.62934 2.92548 1.90562 2.39343 2.45722C1.86138 3.00881 1.59473 3.71447 1.59473 4.57032C1.59473 5.01168 1.67086 5.46738 1.82424 5.93774C1.97762 6.40809 2.2472 6.91979 2.6322 7.47209C3.01719 8.02438 3.58552 8.68114 4.33642 9.44281C5.08732 10.2045 6.00222 11.1444 7.08051 12.2618L7.995 13.2081L8.90872 12.2625C9.98777 11.1451 10.9027 10.2049 11.6536 9.44281C12.4045 8.6807 12.9728 8.0237 13.5578 7.47209C14.1428 6.92047 14.4124 6.40843 14.5658 5.93774C14.7191 5.46704 14.7953 5.01134 14.7953 4.57032C14.7953 3.71447 14.5286 3.00881 13.9966 2.45722C13.4645 1.90562 12.7963 1.62934 11.9928 1.62934C11.4589 1.62934 10.9576 1.76077 10.4891 2.02293C10.0206 2.2851 9.57685 2.6718 9.15732 3.18182L7.995 4.59091L6.83268 3.18182C6.41315 2.6718 5.96941 2.2851 5.5009 2.02293C5.03239 1.76077 4.53103 1.62934 4.39725 1.62934Z"
              fill="currentColor"
            />
          )}
        </svg>
        {showText && <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: 13 }}>Add to Playlist</span>}
      </button>

      {/* Popover Menu Card */}
      {isOpen && (
        <div
          ref={popoverRef}
          role="menu"
          aria-label="Playlist options"
          style={{
            position: 'absolute',
            [placement === 'top' ? 'bottom' : 'top']: '115%',
            right: 0,
            width: 220,
            background: 'rgba(24, 24, 27, 0.96)',
            backdropFilter: 'blur(20px)',
            borderRadius: 12,
            border: '1px solid rgba(255, 255, 255, 0.08)',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            padding: '12px 8px',
          }}
          className="animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          {/* Liked Songs Toggle Row */}
          <button
            onClick={handleLikeClick}
            disabled={isLoading}
            className="flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm text-white hover:bg-white/5 transition-colors text-left"
          >
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 500 }}>
              {isLiked ? 'Remove from Liked Songs' : 'Add to Liked Songs'}
            </span>
            <svg width="14" height="13" viewBox="0 0 16 15" fill="none">
              <path
                d="M7.995 15.2483L6.83572 14.168C5.4899 12.9077 4.37726 11.8205 3.49781 10.9064C2.61836 9.99238 1.9188 9.1718 1.39912 8.44471C0.879449 7.71761 0.516343 7.04937 0.309806 6.44C0.103269 5.83062 0 5.2074 0 4.57032C0 3.26847 0.419737 2.18129 1.25921 1.30877C2.09869 0.436258 3.1447 0 4.39725 0C5.09015 0 5.74973 0.152344 6.37601 0.457032C7.00228 0.76172 7.54195 1.19105 7.995 1.74503C8.44804 1.19105 8.98771 0.76172 9.61398 0.457032C10.2403 0.152344 10.8998 0 11.5927 0C12.8453 0 13.8913 0.436258 14.7308 1.30877C15.5703 2.18129 15.99 3.26847 15.99 4.57032C15.99 5.2074 15.8867 5.83062 15.6802 6.44C15.4736 7.04937 15.1105 7.71761 14.5909 8.44471C14.0712 9.1718 13.3716 9.99238 12.4922 10.9064C11.6127 11.8205 10.5001 12.9077 9.15427 14.168L7.995 15.2483Z"
                fill={isLiked ? '#E2FB5E' : 'rgba(255,255,255,0.4)'}
              />
            </svg>
          </button>

          <div className="my-2 border-t border-white/5" />

          {/* Playlist Selection List */}
          <div className="text-[10px] text-stone-500 font-bold uppercase tracking-wider mb-2 px-3">
            Add to Playlist
          </div>

          <div className="max-height-[140px] overflow-y-auto pr-1 flex flex-col gap-0.5" style={{ maxHeight: 130 }}>
            {playlists.length === 0 ? (
              <div className="text-stone-500 text-xs py-1 px-3 italic">
                No playlists yet
              </div>
            ) : (
              playlists.map((pl) => {
                const isInPlaylist = pl.songs.includes(track.id)
                return (
                  <button
                    key={pl.id}
                    onClick={(e) => handlePlaylistClick(e, pl.id, isInPlaylist)}
                    disabled={isLoading}
                    className="flex items-center justify-between w-full px-3 py-1.5 rounded-md text-xs text-stone-300 hover:text-white hover:bg-white/5 transition-colors text-left"
                  >
                    <span className="truncate pr-2 font-medium">{pl.name}</span>
                    <span
                      style={{
                        width: 14,
                        height: 14,
                        borderRadius: 3,
                        border: isInPlaylist ? '1px solid #E2FB5E' : '1px solid rgba(255,255,255,0.2)',
                        background: isInPlaylist ? '#E2FB5E' : 'transparent',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'black',
                        fontSize: 9,
                        fontWeight: 'bold',
                        transition: 'all 100ms ease-out',
                      }}
                    >
                      {isInPlaylist && '✓'}
                    </span>
                  </button>
                )
              })
            )}
          </div>

          <div className="my-2 border-t border-white/5" />

          {/* Inline Create Playlist Row */}
          {!isCreating ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setIsCreating(true)
              }}
              disabled={isLoading}
              className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg text-xs text-[#E2FB5E] hover:bg-white/5 transition-colors text-left font-semibold"
            >
              <span>+ Create Playlist</span>
            </button>
          ) : (
            <form onSubmit={handleCreatePlaylistSubmit} className="flex items-center gap-1 px-2 py-1">
              <input
                ref={inputRef}
                type="text"
                value={newPlaylistName}
                onChange={(e) => setNewPlaylistName(e.target.value)}
                placeholder="Playlist name..."
                disabled={isLoading}
                className="flex-1 bg-white/5 text-white border border-white/10 rounded px-2 py-1 text-xs outline-none focus:border-[#E2FB5E] transition-colors"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
              <button
                type="submit"
                disabled={!newPlaylistName.trim() || isLoading}
                className="p-1 rounded bg-[#E2FB5E] text-black hover:opacity-95 transition-opacity disabled:opacity-50"
                title="Confirm"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M10 3L4.5 8.5L2 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setIsCreating(false)
                }}
                disabled={isLoading}
                className="p-1 rounded bg-white/5 text-stone-400 hover:text-white transition-colors"
                title="Cancel"
              >
                ✕
              </button>
            </form>
          )}

          {/* Inline error feedback */}
          {error && (
            <div
              className="text-red-500 text-[10px] mt-1.5 px-3 text-center leading-tight font-medium"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {error}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
