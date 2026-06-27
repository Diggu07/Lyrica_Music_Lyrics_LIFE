import { Track } from '../../App'
import { ArtistProfile, editorialLabels, editorialPhotos, eventCities, eventVenues, freshReleaseLabels, genrePills, inferGenre, moodCollections, pickFrom, playlistTitles } from '../../services/homeData'
import { SectionHeader, PlayGlyph } from './shared'

export default function LowerHomeSections({
  selectedGenre,
  setSelectedGenre,
  genreAwareTracks,
  recommendationTracks,
  featuredTrack,
  artistProfiles,
  trackPool,
  libraryAdditions,
  onPlayTrack,
  onNavigate,
}: {
  selectedGenre: string
  setSelectedGenre: (genre: string) => void
  genreAwareTracks: Track[]
  recommendationTracks: Track[]
  featuredTrack: Track
  artistProfiles: ArtistProfile[]
  trackPool: Track[]
  libraryAdditions: Track[]
  onPlayTrack: (track: Track, queue?: Track[]) => void
  onNavigate: (page: string, artistId?: string | null, albumId?: string | null) => void
}) {
  return (
    <>
      <section className="grid gap-7 xl:grid-cols-[1.1fr_0.9fr] editorial-reveal">
        <div>
          <SectionHeader eyebrow="Section 3" title="For You" caption={`Smarter recommendation framing for your ${selectedGenre} lane, with more varied layout and denser music context.`} />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              {
                title: 'Because you liked...',
                lines: [featuredTrack.title, featuredTrack.artist],
                image: featuredTrack.cover,
              },
              {
                title: 'Recently obsessed',
                lines: recommendationTracks.slice(0, 2).map((track) => track.album || track.title),
                image: pickFrom(recommendationTracks, 1, featuredTrack).cover,
              },
              {
                title: 'Hidden gems',
                lines: recommendationTracks.slice(2, 4).map((track) => `${track.title} by ${track.artist}`),
                image: pickFrom(recommendationTracks, 2, featuredTrack).cover,
              },
            ].map((card, index) => (
              <div
                key={card.title}
                className={`${index === 0 ? 'md:col-span-2' : ''} overflow-hidden rounded-[26px] border`}
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="grid h-full md:grid-cols-[0.9fr_1.1fr]">
                  <img src={card.image} alt={card.title} className="h-full min-h-[180px] w-full object-cover" />
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--primary)]">{card.title}</div>
                    <div className="mt-4 space-y-3">
                      {card.lines.map((line) => (
                        <div key={line} className="text-[15px] text-white/88">
                          {line}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <SectionHeader eyebrow="Section 4" title="Trending Artists" caption="Verified artist blocks with rank, followers, and top songs so the section earns more vertical weight." />
          <div className="space-y-4">
            {artistProfiles.map((artist) => (
              <button
                key={artist.id}
                onClick={() => onNavigate('artists', artist.id)}
                className="group flex w-full items-center gap-4 overflow-hidden rounded-[26px] border p-4 text-left transition-all duration-300 hover:scale-[1.01]"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}
              >
                <div className="relative h-[92px] w-[92px] overflow-hidden rounded-full border border-white/10">
                  <img src={artist.image} alt={artist.name} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <div className="text-[18px] text-white">{artist.name}</div>
                    {artist.verified ? <span className="rounded-full bg-[var(--primary)] px-2 py-0.5 text-[10px] font-semibold text-[var(--background)]">Verified</span> : null}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-white/55">
                    <span>{artist.rank} trending</span>
                    <span>{artist.monthlyListeners} monthly listeners</span>
                    <span>{artist.followers} followers</span>
                  </div>
                  <div className="mt-2 truncate text-[11px] text-white/45">{artist.topSongs.slice(0, 3).join(' / ')}</div>
                </div>
                <div className="rounded-full border px-4 py-2 text-[11px] text-white/70 transition-all duration-300 group-hover:border-[rgba(198,255,51,0.3)] group-hover:text-[var(--primary)]" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                  Follow
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[1.05fr_0.95fr] editorial-reveal">
        <div>
          <SectionHeader eyebrow="Section 5" title="Fresh Releases" caption="One large featured release followed by smaller supporting cards, instead of a row of identical tiles." />
          <div className="grid gap-4 sm:grid-cols-2">
            {freshReleaseLabels.map((label, index) => {
              const track = pickFrom(trackPool, index, featuredTrack)
              return (
                <button
                  key={label}
                  onClick={() => onPlayTrack(track, trackPool)}
                  className={`${index === 0 ? 'sm:col-span-2' : ''} group overflow-hidden rounded-[26px] border text-left`}
                  style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className={`grid ${index === 0 ? 'md:grid-cols-[1fr_1.1fr]' : 'grid-cols-1'}`}>
                    <div className="relative min-h-[160px] overflow-hidden">
                      <img src={track.cover} alt={track.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/45 to-transparent" />
                    </div>
                    <div className="p-4">
                      <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">{label}</div>
                      <h3 className="mt-3 text-[22px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                        {track.title}
                      </h3>
                      <p className="mt-2 text-[12px] leading-5 text-white/58">{track.artist} / {track.album || 'Curated release story'}</p>
                      <div className="mt-4 inline-flex items-center gap-2 rounded-full border px-3 py-2 text-[11px] text-white/72" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                        <PlayGlyph dark={false} />
                        Editorial preview
                      </div>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <SectionHeader eyebrow="Section 6" title="Mood Collections" caption="Different tile sizes and cropped imagery to break the carousel rhythm while keeping discovery elegant." />
          <div className="grid gap-4 sm:grid-cols-2">
            {moodCollections.slice(0, 6).map((mood, index) => (
              <button
                key={mood}
                onClick={() => setSelectedGenre(genrePills[index % genrePills.length])}
                className={`${index === 0 ? 'sm:col-span-2' : ''} group relative overflow-hidden rounded-[28px] border text-left`}
                style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: index === 0 ? 220 : 160 }}
              >
                <img src={editorialPhotos[index % editorialPhotos.length]} alt={mood} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.32em] text-white/45">Collection</div>
                  <h3 style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400, fontSize: '1.8rem', color: 'white' }}>
                    {mood}
                  </h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr] editorial-reveal">
        <div>
          <SectionHeader eyebrow="Section 7" title="Genres" caption="Genre pills now sit beside live recommendation context so switching feels smarter and more immediate." />
          <div className="rounded-[28px] border p-5" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}>
            <div className="flex flex-wrap gap-2">
              {genrePills.map((genre) => {
                const isActive = genre === selectedGenre
                return (
                  <button
                    key={genre}
                    onClick={() => setSelectedGenre(genre)}
                    className="rounded-full px-4 py-2 text-[12px] transition-all duration-300"
                    style={{
                      background: isActive ? 'var(--primary)' : 'rgba(255,255,255,0.06)',
                      color: isActive ? 'var(--background)' : 'white',
                      boxShadow: isActive ? '0 0 20px rgba(198,255,51,0.18)' : 'none',
                    }}
                  >
                    {genre}
                  </button>
                )
              })}
            </div>

            <div className="mt-5 grid gap-4 lg:grid-cols-[1fr_0.9fr]">
              <div className="grid gap-3 sm:grid-cols-2">
                {genreAwareTracks.slice(0, 4).map((track, index) => (
                  <button
                    key={`${selectedGenre}-${track.id}-${index}`}
                    onClick={() => onPlayTrack(track, genreAwareTracks)}
                    className="group flex items-center gap-3 rounded-[20px] border p-3 text-left transition-all duration-300 hover:border-[rgba(198,255,51,0.28)] hover:bg-white/6"
                    style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}
                  >
                    <img src={track.cover} alt="" className="h-14 w-14 rounded-[14px] object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-[13px] font-semibold text-white">{track.title}</div>
                      <div className="truncate text-[11px] text-white/55">{track.artist}</div>
                    </div>
                  </button>
                ))}
              </div>
              <div className="rounded-[22px] border p-4" style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.025)' }}>
                <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">{selectedGenre} snapshot</div>
                <div className="mt-4 space-y-3 text-[12px] text-white/75">
                  <div>Top artist: {genreAwareTracks[0]?.artist || featuredTrack.artist}</div>
                  <div>Top playlist: {selectedGenre} rotation</div>
                  <div>Top album: {genreAwareTracks[0]?.album || featuredTrack.album || featuredTrack.title}</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div>
          <SectionHeader eyebrow="Section 8" title="Editorial Picks" caption="Still premium and magazine-like, but now varied in proportion and tucked later in the page so it supports discovery instead of interrupting it." />
          <div className="space-y-4">
            {editorialLabels.map((label, index) => (
              <div
                key={label}
                className="overflow-hidden rounded-[26px] border"
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="grid md:grid-cols-[0.85fr_1.15fr]">
                  <img src={editorialPhotos[index % editorialPhotos.length]} alt={label} className="h-full min-h-[180px] w-full object-cover" />
                  <div className="p-5">
                    <div className="text-[10px] uppercase tracking-[0.32em] text-[var(--primary)]">{label}</div>
                    <h3 className="mt-3 text-[28px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                      {pickFrom(recommendationTracks, index, featuredTrack).title}
                    </h3>
                    <p className="mt-3 text-[12px] leading-6 text-white/58">
                      A richer editorial framing built from your catalog, with less repetition and more music-first visual storytelling.
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="editorial-reveal">
        <SectionHeader eyebrow="Section 9" title="Trending Playlists" caption="Playlist layouts now feel more editorial and less like repeated square covers." />
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {playlistTitles.map((title, index) => {
            const track = pickFrom(trackPool, index, featuredTrack)
            return (
              <button
                key={title}
                onClick={() => onPlayTrack(track, trackPool)}
                className={`${index % 3 === 0 ? 'xl:col-span-2' : ''} group overflow-hidden rounded-[26px] border text-left transition-transform duration-300 hover:scale-[1.02]`}
                style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}
              >
                <div className="relative">
                  <img src={track.cover} alt={title} className="h-[220px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/85" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">Playlist</div>
                    <div className="mt-2 text-[24px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                      {title}
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="editorial-reveal">
        <SectionHeader eyebrow="Section 10" title="Continue Exploring" caption="A denser mixed-size exploration field that makes every scroll reveal feel different." />
        <div className="grid auto-rows-[160px] gap-4 md:grid-cols-2 xl:grid-cols-4">
          {recommendationTracks.map((track, index) => {
            const isLarge = index % 5 === 0
            const isTall = index % 4 === 0
            return (
              <button
                key={`${track.id}-explore-${index}`}
                onClick={() => onPlayTrack(track, recommendationTracks)}
                className={`${isLarge ? 'xl:col-span-2' : ''} ${isTall ? 'row-span-2' : ''} group relative overflow-hidden rounded-[26px] border text-left`}
                style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: isTall ? 336 : 160 }}
              >
                <img src={track.cover} alt={track.title} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/88" />
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <div className="mb-2 text-[10px] uppercase tracking-[0.3em] text-[var(--primary)]">{inferGenre(track)}</div>
                  <div className="text-[22px] text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                    {track.title}
                  </div>
                  <div className="mt-1 text-[11px] text-white/55">{track.artist}</div>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      <section className="grid gap-7 xl:grid-cols-[0.95fr_1.05fr] editorial-reveal">
        <div>
          <SectionHeader eyebrow="Bottom Shelf" title="Lyrics Spotlight" caption="Moved lower so it adds emotional flavor without interrupting your main discovery loop." />
          <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-1">
            {recommendationTracks.slice(0, 3).map((track, index) => (
              <div
                key={`${track.id}-lyric`}
                className="relative overflow-hidden rounded-[26px] border p-5"
                style={{ borderColor: 'rgba(255,255,255,0.08)', minHeight: 180 }}
              >
                <img src={track.cover} alt="" className="absolute inset-0 h-full w-full object-cover blur-[2px]" />
                <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgba(198,255,51,${0.12 + index * 0.04}), rgba(11,11,13,0.92))` }} />
                <div className="relative">
                  <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">Lyrics spotlight</div>
                  <div className="mt-4 text-[24px] leading-9 text-white" style={{ fontFamily: 'var(--font-serif)', fontStyle: 'italic', fontWeight: 400 }}>
                    "{track.title} keeps echoing after the chorus ends."
                  </div>
                  <div className="mt-4 text-[12px] text-white/58">{track.artist}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-7">
          <div>
            <SectionHeader eyebrow="Bottom Shelf" title="Music Videos" caption="Also moved lower, but still presented as premium cinematic cards." />
            <div className="flex gap-4 overflow-x-auto pb-2">
              {trackPool.slice(0, 4).map((track, index) => (
                <button
                  key={`${track.id}-video-${index}`}
                  onClick={() => onPlayTrack(track, trackPool)}
                  className="group relative w-[300px] min-w-[300px] overflow-hidden rounded-[24px] border text-left"
                  style={{ borderColor: 'rgba(255,255,255,0.08)' }}
                >
                  <img src={track.cover} alt={track.title} className="h-[170px] w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/88" />
                  <div className="absolute left-4 top-4 rounded-full bg-white/12 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-white backdrop-blur-xl">
                    Video
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between gap-4">
                    <div>
                      <div className="text-[18px] text-white">{track.title}</div>
                      <div className="text-[11px] text-white/55">{track.artist}</div>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[var(--primary)] shadow-[0_0_24px_rgba(198,255,51,0.18)]">
                      <PlayGlyph />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <SectionHeader eyebrow="Bottom Shelf" title="Live Events" caption="Concert signals stay discoverable, but no longer interrupt the top-level music journey." />
            <div className="space-y-3">
              {trackPool.slice(0, 4).map((track, index) => (
                <div
                  key={`${track.id}-event`}
                  className="rounded-[24px] border p-4"
                  style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.28em] text-[var(--primary)]">Tour announcement</div>
                      <div className="mt-2 text-[18px] text-white">{track.artist} live</div>
                      <div className="mt-1 text-[12px] text-white/55">{eventCities[index % eventCities.length]} / {eventVenues[index % eventVenues.length]}</div>
                    </div>
                    <div className="rounded-[18px] border px-4 py-3 text-center" style={{ borderColor: 'rgba(255,255,255,0.1)' }}>
                      <div className="text-[11px] uppercase tracking-[0.2em] text-white/45">Date</div>
                      <div className="mt-1 text-[16px] text-white">{`${18 + index} Jul`}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="editorial-reveal">
        <SectionHeader eyebrow="Library" title="Recently Added to Library" caption="Quick access remains, but in a denser strip that supports the rest of the page rather than standing alone." />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {libraryAdditions.slice(0, 4).map((track, index) => (
            <button
              key={`${track.id}-library-${index}`}
              onClick={() => onPlayTrack(track, libraryAdditions)}
              className="group flex items-center gap-3 rounded-[22px] border p-3 text-left transition-all duration-300 hover:border-[rgba(198,255,51,0.28)] hover:bg-white/6"
              style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}
            >
              <img src={track.cover} alt={track.title} className="h-16 w-16 rounded-[16px] object-cover transition-transform duration-500 group-hover:scale-105" />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[14px] font-semibold text-white">{track.title}</div>
                <div className="truncate text-[11px] text-white/55">{track.artist}</div>
                <div className="mt-2 text-[10px] uppercase tracking-[0.22em] text-[var(--primary)]">Saved to library</div>
              </div>
            </button>
          ))}
        </div>
      </section>
    </>
  )
}
