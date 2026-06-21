import { useState } from 'react'
import { Track } from '../App'
import imgTrack3 from 'figma:asset/4ff19e7ec1c13a77562fcc29c262bba0e0652e9b.png'
import imgNowPlaying from 'figma:asset/4ee233c9fd9f345420928c5ccf8cba2ae01305c9.png'
import imgNightDrive from 'figma:asset/4f7dc13643565ba86b4c99b49f6d85abbcc197cf.png'
import imgApathy from 'figma:asset/e0d808bf1292af2ff08e473758f65ef4dbcf6f56.png'

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

interface RadioPageProps {
  onPlayTrack: (track: Track) => void
}

export function RadioPage({ onPlayTrack }: RadioPageProps) {
  const [activeStation, setActiveStation] = useState<string | null>(null)

  const stations = [
    { id: 'lofi', title: 'Lofi Beat Radio', desc: 'Chill beats to study/relax to.', listeners: '12.4k listening', color: '#B6E2D3', img: imgTrack3 },
    { id: 'synth', title: 'Synthwave Focus', desc: 'Cyberpunk beats for coding.', listeners: '8.1k listening', color: '#FAE1DF', img: imgNightDrive },
    { id: 'ambient', title: 'Deep Space Ambient', desc: 'Space textures and soundscapes.', listeners: '5.2k listening', color: '#D8B4F8', img: imgNowPlaying },
    { id: 'jazz', title: 'Retro Jazz Chill', desc: 'Late night cozy lounge jazz.', listeners: '3.9k listening', color: '#FCD0A1', img: imgApathy },
  ]

  const handlePlayStation = (station: typeof stations[0]) => {
    setActiveStation(station.id)
    onPlayTrack({
      id: `radio-${station.id}`,
      title: station.title,
      artist: 'Live Radio Broadcast',
      cover: station.img,
      album: 'Radio Live',
      duration: 'Live'
    })
  }

  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      <h1 className="mb-2" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: 32, color: 'var(--text)' }}>Lyrica Radio</h1>
      <p className="mb-8 max-w-[600px]" style={{ fontFamily: 'var(--font-sans)', fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.6 }}>
        Live 24/7 curated non-stop music broadcasts. Connect to any frequency block below and drift into focused ambient fields.
      </p>

      {/* Stations grid */}
      <div className="grid grid-cols-2 gap-8">
        {stations.map((station) => {
          const isPlaying = activeStation === station.id
          return (
            <div
              key={station.id}
              onClick={() => handlePlayStation(station)}
              className="group p-6 rounded-[24px] cursor-pointer transition-all duration-300 relative overflow-hidden flex items-center gap-6"
              style={{
                background: 'var(--surface)',
                border: isPlaying ? '1px solid var(--primary)' : '1px solid var(--border)',
              }}
            >
              {/* Image */}
              <div className="w-24 h-24 rounded-[16px] overflow-hidden flex-shrink-0 relative border border-white/5">
                <img src={station.img} alt={station.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-black">
                    {isPlaying ? (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                        <rect x="4" y="3" width="2.5" height="10" fill="var(--background)" />
                        <rect x="9.5" y="3" width="2.5" height="10" fill="var(--background)" />
                      </svg>
                    ) : (
                      <svg width="10" height="12" viewBox="0 0 11 14" fill="none">
                        <path d="M1.5 12.25V1.75L9.25 7L1.5 12.25Z" fill="var(--background)" stroke="var(--background)" strokeWidth="1.5" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>
                </div>
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 600, fontSize: 16, color: 'var(--text)' }}>{station.title}</span>
                <p className="mt-1 truncate" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, fontSize: 13, color: 'var(--text-muted)' }}>{station.desc}</p>
                <div className="flex items-center gap-2 mt-3">
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: isPlaying ? 'var(--primary)' : 'rgba(255,255,255,0.2)' }} />
                  <span style={{ fontFamily: 'var(--font-sans)', fontWeight: 500, fontSize: 12, color: isPlaying ? 'var(--primary)' : 'var(--text-muted)' }}>
                    {station.listeners}
                  </span>
                </div>
              </div>

              {/* Concentric resonance pulse when active */}
              {isPlaying && (
                <div className="absolute bottom-6 right-6 flex items-center justify-center w-12 h-12">
                  <div className="absolute w-8 h-8 rounded-full border border-primary/20 animate-resonance-1" />
                  <div className="absolute w-8 h-8 rounded-full border border-primary/20 animate-resonance-2" />
                  <div className="relative w-2.5 h-2.5 rounded-full bg-primary/40" />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
