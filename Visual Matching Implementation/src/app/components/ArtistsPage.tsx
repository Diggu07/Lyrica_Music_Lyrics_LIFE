import { Track } from '../App'
import { useState, useEffect, useRef } from 'react'
import { PlaylistPopover } from './PlaylistPopover'

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
  // Identity Metrics
  topEmotion?: string;
  mostSavedLyric?: string;
  discoveryScore?: number;
  activeYears?: string;
  country?: string;
}

export const artistsList: ArtistData[] = []; // Clear hardcoded, loaded dynamically

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
    emotion?: string;
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
  love: "#E2FB5E",
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

// Types for the Interactive Music Universe Canvas Graph
interface GraphNode {
  id: string;
  label: string;
  type: "artist" | "album" | "song" | "lyric" | "emotion" | "playlist";
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  level: number;
  expanded?: boolean;
  meta?: any;
}

interface GraphEdge {
  source: string;
  target: string;
  type: string;
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
  onToggleFollow
}: ArtistsPageProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState<{
    artists: any[];
    songs: any[];
    albums: any[];
    lyrics: any[];
  } | null>(null)
  
  const [artist, setArtist] = useState<ArtistData | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(false)
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)
  const [savedQuotes, setSavedQuotes] = useState<Record<string, boolean>>({})

  // Active emotion filters
  const [selectedDnaCategory, setSelectedDnaCategory] = useState<string | null>(null)
  const [currentEmotionFilter, setCurrentEmotionFilter] = useState<string | null>(null)

  // Discovery Hub lists
  const [discoveryData, setDiscoveryData] = useState<{
    trending: ArtistData[];
    popular_in_india: ArtistData[];
    similar_to_taste: ArtistData[];
    mood_categories: Record<string, ArtistData[]>;
    quoted_lyrics: any[];
  } | null>(null)
  const [loadingDiscovery, setLoadingDiscovery] = useState(false)

  // Graph Canvas references
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [graphNodes, setGraphNodes] = useState<GraphNode[]>([])
  const [graphEdges, setGraphEdges] = useState<GraphEdge[]>([])
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null)
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null)

  // Autocomplete Suggestions effect
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions(null)
      return
    }
    const timer = setTimeout(() => {
      fetch(`/api/artists/search/suggest?q=${encodeURIComponent(searchQuery)}`)
        .then(res => res.json())
        .then(data => setSuggestions(data))
        .catch(err => console.error(err))
    }, 250)
    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load default discovery lists
  useEffect(() => {
    if (!activeArtistId) {
      setLoadingDiscovery(true)
      fetch('/api/artists/discovery')
        .then(res => res.json())
        .then(data => {
          const mapArtist = (a: any) => ({
            id: a.artistId,
            name: a.name,
            genre: a.genres.join(" / "),
            cover: a.cover,
            banner: a.banner,
            followers: "Verified",
            monthlyListeners: "Explore",
            songsCount: 12,
            trendingPercentage: "+15% this week",
            bio: a.bio,
            popularTracks: [],
            albums: a.albums || [],
            singles: a.singles || [],
            mostQuotedLyrics: [],
            lyricalDNA: [],
            timeline: [],
            relatedArtists: [],
            topEmotion: a.topEmotion || "Nostalgia",
            mostSavedLyric: a.quotedLyrics && a.quotedLyrics[0] ? a.quotedLyrics[0].quote : "Memories bring back memories...",
            discoveryScore: a.discoveryScore || 78
          })

          const mappedTrending = (data.trending || []).map(mapArtist)
          const mappedPopular = (data.popular_in_india || []).map(mapArtist)
          const mappedTaste = (data.recommendations || []).map(mapArtist)

          const mappedMoods: Record<string, ArtistData[]> = {}
          Object.entries(data.mood_categories || {}).forEach(([moodName, items]: [string, any]) => {
            mappedMoods[moodName] = items.map(mapArtist)
          })

          setDiscoveryData({
            trending: mappedTrending,
            popular_in_india: mappedPopular,
            similar_to_taste: mappedTaste,
            mood_categories: mappedMoods,
            quoted_lyrics: data.quoted_lyrics || []
          })
          setLoadingDiscovery(false)
        })
        .catch(err => {
          console.error("Failed loading discovery data:", err)
          setLoadingDiscovery(false)
        })
    }
  }, [activeArtistId])

  // Load selected artist profile and handle background aggregation progress updates
  useEffect(() => {
    if (!activeArtistId) {
      setArtist(null)
      setAnalytics(null)
      return
    }

    let isMounted = true
    let pollInterval: any | null = null

    async function loadProfile() {
      setLoading(true)
      try {
        const res = await fetch(`/api/artists/${activeArtistId}`)
        if (!res.ok) throw new Error("Failed fetching profile")
        const data = await res.json()
        if (!isMounted) return

        const mapped: ArtistData = {
          id: data.artistId,
          name: data.name,
          genre: data.genres.join(" / "),
          cover: data.cover,
          banner: data.banner,
          followers: "Verified",
          monthlyListeners: "Explore",
          songsCount: 15,
          trendingPercentage: "+10%",
          bio: data.bio,
          popularTracks: [],
          albums: data.albums || [],
          singles: data.singles || [],
          mostQuotedLyrics: [],
          lyricalDNA: [],
          timeline: [],
          relatedArtists: []
        }
        setArtist(mapped)

        // Load analytics
        const resAnalytics = await fetch(`/api/artists/${activeArtistId}/analytics`)
        if (resAnalytics.ok) {
          const analData = await resAnalytics.json()
          setAnalytics({
            artistEssence: {
              primaryEmotion: analData.topEmotion,
              secondaryEmotion: analData.secondaryEmotion,
              energy: 85
            },
            lyricalDNA: analData.lyricalDNA,
            mostQuotedLyrics: analData.quotedLyrics,
            lyricsWall: analData.quotedLyrics.map((q: any) => ({
              quote: q.quote,
              song: q.song,
              album: q.album || "Greatest Hits",
              emotion: q.emotion || "nostalgia",
              saveCount: q.saveCount || 4200,
              shareCount: q.shareCount || 150
            })),
            timeline: [
              { year: data.activeYears ? data.activeYears.split(" ")[0] : "2012", title: "Debut Era", desc: "First launched and established core audience." },
              { year: "2024", title: "Emotions Tour", desc: "Successfully dominated emotional music charts globally." }
            ]
          })
        }

        // If status is aggregating, poll until completed
        if (data.aggregationStatus === 'seeded' || data.aggregationStatus === 'aggregating') {
          pollInterval = setInterval(async () => {
            const pollRes = await fetch(`/api/artists/${activeArtistId}`)
            if (pollRes.ok) {
              const pollData = await pollRes.json()
              if (isMounted) {
                const polledMapped: ArtistData = {
                  id: pollData.artistId,
                  name: pollData.name,
                  genre: pollData.genres.join(" / "),
                  cover: pollData.cover,
                  banner: pollData.banner,
                  followers: "Verified",
                  monthlyListeners: "Explore",
                  songsCount: 15,
                  trendingPercentage: "+10%",
                  bio: pollData.bio,
                  popularTracks: [],
                  albums: pollData.albums || [],
                  singles: pollData.singles || [],
                  mostQuotedLyrics: [],
                  lyricalDNA: [],
                  timeline: [],
                  relatedArtists: []
                }
                setArtist(polledMapped)
                if (pollData.aggregationStatus === 'completed' || pollData.aggregationStatus === 'failed') {
                  if (pollInterval) clearInterval(pollInterval)
                  // Reload analytics to get enriched text
                  const finalRes = await fetch(`/api/artists/${activeArtistId}/analytics`)
                  if (finalRes.ok) {
                    const finalAnal = await finalRes.json()
                    setAnalytics({
                      artistEssence: {
                        primaryEmotion: finalAnal.topEmotion,
                        secondaryEmotion: finalAnal.secondaryEmotion,
                        energy: 85
                      },
                      lyricalDNA: finalAnal.lyricalDNA,
                      mostQuotedLyrics: finalAnal.quotedLyrics,
                      lyricsWall: finalAnal.quotedLyrics.map((q: any) => ({
                        quote: q.quote,
                        song: q.song,
                        album: q.album || "Greatest Hits",
                        emotion: q.emotion || "nostalgia",
                        saveCount: q.saveCount || 4200,
                        shareCount: q.shareCount || 150
                      })),
                      timeline: [
                        { year: pollData.activeYears ? pollData.activeYears.split(" ")[0] : "2012", title: "Debut Era", desc: "First launched and established core audience." },
                        { year: "2024", title: "Emotions Tour", desc: "Successfully dominated emotional music charts globally." }
                      ]
                    })
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

  // Setup Dynamic Graph Node Layout on First Boot / Active Artist select
  useEffect(() => {
    const width = 800
    const height = 450
    
    // Seed initial level 1 node (Artist)
    const rootNode: GraphNode = {
      id: "root-artist",
      label: artist ? artist.name : "Taylor Swift",
      type: "artist",
      x: width / 2,
      y: height / 2,
      radius: 28,
      vx: 0,
      vy: 0,
      level: 1,
      expanded: true,
      meta: {
        img: artist ? artist.cover : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300",
        vibe: artist ? "Nostalgia" : "Love Story",
        score: artist ? 95 : 98
      }
    }

    // Seed level 2 nodes (Albums)
    const initialAlbums = artist ? artist.albums.slice(0, 3) : [
      { id: "alb_1", title: "1989 (Taylor's Version)", cover: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=300" },
      { id: "alb_2", title: "Midnights", cover: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=300" }
    ]

    const initialNodes: GraphNode[] = [rootNode]
    const initialEdges: GraphEdge[] = []

    initialAlbums.forEach((alb, idx) => {
      const angle = (idx / initialAlbums.length) * Math.PI * 2
      const albNode: GraphNode = {
        id: alb.id,
        label: alb.title,
        type: "album",
        x: width / 2 + Math.cos(angle) * 120,
        y: height / 2 + Math.sin(angle) * 120,
        radius: 18,
        vx: 0,
        vy: 0,
        level: 2,
        meta: { cover: alb.cover }
      }
      initialNodes.push(albNode)
      initialEdges.push({
        source: "root-artist",
        target: alb.id,
        type: "Created"
      })
    })

    setGraphNodes(initialNodes)
    setGraphEdges(initialEdges)
  }, [artist])

  // Canvas Force-Directed Animation Tick Loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animFrame: number
    const width = canvas.width
    const height = canvas.height

    const tick = () => {
      // 1. Force simulation: apply simple spring-like attraction and repulsion forces
      const nodes = [...graphNodes]
      
      // Node repulsion
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const n1 = nodes[i]
          const n2 = nodes[j]
          const dx = n2.x - n1.x
          const dy = n2.y - n1.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const minDist = n1.radius + n2.radius + 60
          if (dist < minDist) {
            const force = (minDist - dist) * 0.04
            const fx = (dx / dist) * force
            const fy = (dy / dist) * force
            n2.vx += fx
            n2.vy += fy
            n1.vx -= fx
            n1.vy -= fy
          }
        }
      }

      // Edge attraction
      graphEdges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source)
        const targetNode = nodes.find(n => n.id === edge.target)
        if (sourceNode && targetNode) {
          const dx = targetNode.x - sourceNode.x
          const dy = targetNode.y - sourceNode.y
          const dist = Math.sqrt(dx * dx + dy * dy) || 1
          const desiredDist = 130
          const force = (dist - desiredDist) * 0.015
          const fx = (dx / dist) * force
          const fy = (dy / dist) * force
          targetNode.vx -= fx
          targetNode.vy -= fy
          sourceNode.vx += fx
          sourceNode.vy += fy
        }
      })

      // Central gravity
      nodes.forEach(node => {
        const cx = width / 2
        const cy = height / 2
        const dx = cx - node.x
        const dy = cy - node.y
        node.vx += dx * 0.002
        node.vy += dy * 0.002

        // Apply velocity & friction
        node.x += node.vx
        node.y += node.vy
        node.vx *= 0.85
        node.vy *= 0.85

        // Keep inside bounds
        node.x = Math.max(node.radius, Math.min(width - node.radius, node.x))
        node.y = Math.max(node.radius, Math.min(height - node.radius, node.y))
      })

      // 2. Draw canvas
      ctx.clearRect(0, 0, width, height)

      // Draw background grid lines
      ctx.strokeStyle = "rgba(255,255,255,0.02)"
      ctx.lineWidth = 1
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw Edges
      ctx.lineWidth = 1.5
      graphEdges.forEach(edge => {
        const s = nodes.find(n => n.id === edge.source)
        const t = nodes.find(n => n.id === edge.target)
        if (s && t) {
          ctx.beginPath()
          ctx.moveTo(s.x, s.y)
          ctx.lineTo(t.x, t.y)
          
          if (edge.type === "Created") ctx.strokeStyle = "rgba(226, 251, 94, 0.4)"
          else if (edge.type === "Contains") ctx.strokeStyle = "rgba(56, 189, 248, 0.4)"
          else if (edge.type === "Related To") ctx.strokeStyle = "rgba(168, 85, 247, 0.4)"
          else ctx.strokeStyle = "rgba(255, 255, 255, 0.15)"
          
          ctx.stroke()
        }
      })

      // Draw Nodes
      nodes.forEach(node => {
        // Drop shadow / glow
        ctx.shadowBlur = 15
        if (node.type === "artist") ctx.shadowColor = "#E2FB5E"
        else if (node.type === "album") ctx.shadowColor = "#38bdf8"
        else if (node.type === "song") ctx.shadowColor = "#f43f5e"
        else ctx.shadowColor = "rgba(255,255,255,0.3)"

        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        
        if (node.type === "artist") {
          ctx.fillStyle = "#E2FB5E"
        } else if (node.type === "album") {
          ctx.fillStyle = "#38bdf8"
        } else if (node.type === "song") {
          ctx.fillStyle = "#f43f5e"
        } else if (node.type === "lyric") {
          ctx.fillStyle = "#a855f7"
        } else {
          ctx.fillStyle = "#78716c"
        }
        ctx.fill()
        
        // Reset shadow
        ctx.shadowBlur = 0

        // Draw labels
        ctx.fillStyle = hoveredNode?.id === node.id ? "white" : "rgba(255,255,255,0.7)"
        ctx.font = "bold 9px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + node.radius + 12)
      })

      animFrame = requestAnimationFrame(tick)
    }

    animFrame = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(animFrame)
  }, [graphNodes, graphEdges, hoveredNode])

  // Handles click in Music Universe graph to expand next levels
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Find clicked node
    const clicked = graphNodes.find(node => {
      const dist = Math.sqrt((node.x - clickX) ** 2 + (node.y - clickY) ** 2)
      return dist <= node.radius
    })

    if (clicked) {
      setSelectedNode(clicked)

      // Level 2 (Album) click -> expand Level 3 (Songs)
      if (clicked.type === "album" && !clicked.expanded) {
        clicked.expanded = true
        
        // Generate mock real songs under this album
        const newSongs = [
          { id: `song_${clicked.id}_1`, title: "Emotional Horizon" },
          { id: `song_${clicked.id}_2`, title: "Love Echoes" }
        ]

        const currentNodes = [...graphNodes]
        const currentEdges = [...graphEdges]

        newSongs.forEach((song, idx) => {
          const angle = (idx / newSongs.length) * Math.PI + Math.PI / 2
          const songNode: GraphNode = {
            id: song.id,
            label: song.title,
            type: "song",
            x: clicked.x + Math.cos(angle) * 90,
            y: clicked.y + Math.sin(angle) * 90,
            radius: 12,
            vx: 0,
            vy: 0,
            level: 3
          }
          currentNodes.push(songNode)
          currentEdges.push({
            source: clicked.id,
            target: song.id,
            type: "Contains"
          })
        })

        setGraphNodes(currentNodes)
        setGraphEdges(currentEdges)
      }

      // Level 3 (Song) click -> expand Level 4 (Lyric Quotes)
      if (clicked.type === "song" && !clicked.expanded) {
        clicked.expanded = true
        
        const lyricId = `lyric_${clicked.id}`
        const lyricNode: GraphNode = {
          id: lyricId,
          label: "Quote: Stay with me...",
          type: "lyric",
          x: clicked.x + 50,
          y: clicked.y + 50,
          radius: 10,
          vx: 0,
          vy: 0,
          level: 4
        }

        setGraphNodes([...graphNodes, lyricNode])
        setGraphEdges([...graphEdges, {
          source: clicked.id,
          target: lyricId,
          type: "Contains"
        }])
      }
    } else {
      setSelectedNode(null)
    }
  }

  // Handles canvas hover states
  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const moveX = e.clientX - rect.left
    const moveY = e.clientY - rect.top

    const found = graphNodes.find(node => {
      const dist = Math.sqrt((node.x - moveX) ** 2 + (node.y - moveY) ** 2)
      return dist <= node.radius
    })
    setHoveredNode(found || null)
  }

  // Action: Play artist tracks
  const handlePlayArtistSongs = (artistItem: ArtistData) => {
    const tracksList: Track[] = (analytics?.mostQuotedLyrics || []).map((q, idx) => ({
      id: `yt_track_${artistItem.id}_${idx}`,
      title: q.song,
      artist: artistItem.name,
      cover: artistItem.cover,
      album: "Popular Track",
      duration: "3:30",
      source: "youtube",
      videoId: "oqpyR015p8o"
    }))
    if (tracksList.length > 0) {
      onPlayTrack(tracksList[0], tracksList)
    }
  }

  // Action: Play artist radio feed
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

  const handleViewProfile = (artistId: string) => {
    onSelectArtist(artistId)
  }

  // RENDER DETAILED SELECTED PROFILE VIEW
  if (artist) {
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

    const filteredTracks = selectedDnaCategory
      ? trackCatalog.filter(t => {
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

        {/* 1. Banner Section */}
        <div className="relative rounded-[24px] overflow-hidden mb-8" style={{ height: 380, border: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="absolute inset-0">
            <img src={artist.banner} alt={artist.name} className="w-full h-full object-cover opacity-35 blur-sm scale-105" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f10] via-black/40 to-transparent" />

          <div className="absolute bottom-0 left-0 right-0 p-8 flex flex-col md:flex-row md:items-end justify-between gap-6 z-10">
            <div className="flex items-end gap-6">
              <div className="rounded-[20px] overflow-hidden border border-[#E2FB5E] flex-shrink-0" style={{ width: 140, height: 140 }}>
                <img src={artist.cover} alt={artist.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-2">
                <span className="bg-[#E2FB5E]/10 text-[#E2FB5E] border border-[#E2FB5E]/20 px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider w-fit">VERIFIED LYRICA ARTIST</span>
                <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 56, color: 'white', lineHeight: 1.1 }}>{artist.name}</h1>
                <span className="text-stone-400 text-xs font-bold uppercase tracking-widest">{artist.activeYears} • {artist.country}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => handlePlayArtistSongs(artist)}
                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider transition-all duration-300 hover:scale-105 active:scale-95 bg-[#E2FB5E] text-black cursor-pointer shadow-lg"
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
                  background: followedArtistIds.includes(artist.id) ? '#E2FB5E' : 'transparent',
                  color: followedArtistIds.includes(artist.id) ? 'black' : 'white',
                  borderColor: followedArtistIds.includes(artist.id) ? '#E2FB5E' : 'rgba(255,255,255,0.3)',
                }}
              >
                {followedArtistIds.includes(artist.id) ? 'Following' : 'Follow'}
              </button>

              <button
                onClick={() => handlePlayArtistRadio(artist.id)}
                className="px-6 py-2.5 rounded-full font-bold text-xs uppercase tracking-wider bg-white/5 hover:bg-white/10 border border-white/10 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 text-white"
              >
                <RadioIcon /> Artist Radio
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Profile Tabs */}
        <div className="flex flex-col gap-12 mt-10">
          {/* Most Quoted Lyrics */}
          {analytics?.mostQuotedLyrics && analytics.mostQuotedLyrics.length > 0 && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-widest">Fans Signature Quotes</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Most Quoted Lyrics</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {analytics.mostQuotedLyrics.map((quoteItem, idx) => {
                  const isSaved = savedQuotes[quoteItem.quote];
                  return (
                    <div key={idx} className="p-6 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.04] transition-all flex flex-col justify-between gap-6">
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
                              background: isSaved ? '#E2FB5E' : 'rgba(255,255,255,0.05)',
                              color: isSaved ? 'black' : 'white',
                              borderColor: isSaved ? '#E2FB5E' : 'rgba(255,255,255,0.1)'
                            }}
                          >
                            {isSaved ? '✓ Saved' : 'Save'} ({((quoteItem.saveCount + (isSaved ? 1 : 0)) / 1000).toFixed(1)}k)
                          </button>
                          <button
                            onClick={() => handleCopyText(quoteItem.quote, idx)}
                            className="px-3 py-1.5 rounded-full text-[10px] font-bold bg-white/5 hover:bg-white/10 border border-white/10 text-white cursor-pointer"
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

          {/* Pinterest-style Wall */}
          {analytics?.lyricsWall && analytics.lyricsWall.length > 0 && (
            <div>
              <div className="mb-4">
                <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-widest">Pinterest-style Snippet Gallery</span>
                <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4 }}>Lyrics Wall</h2>
              </div>
              <div style={{ columnCount: window.innerWidth > 768 ? 3 : 1, columnGap: '20px' }}>
                {analytics.lyricsWall.map((wallItem, idx) => {
                  const color = emotionColors[wallItem.emotion.toLowerCase()] || "#E2FB5E"
                  return (
                    <div key={idx} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all mb-5 break-inside-avoid flex flex-col gap-4" style={{ display: 'inline-block', width: '100%' }}>
                      <div className="flex justify-between items-center">
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: color, background: `${color}15`, border: `1px solid ${color}30` }}>
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
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Lyrical DNA theme filters */}
          {analytics?.lyricalDNA && (
            <div className="p-6 rounded-[24px] border border-white/5 bg-white/[0.01]">
              <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-widest">Interactive Theme Navigation</span>
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white', marginTop: 4, marginBottom: 20 }}>Lyrical DNA</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(analytics.lyricalDNA).map(([key, val]) => {
                  const color = emotionColors[key.toLowerCase()] || "#E2FB5E"
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

          {/* Top Songs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 24, color: 'white' }}>Top Songs</h2>
              {selectedDnaCategory && (
                <button onClick={() => setSelectedDnaCategory(null)} className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#E2FB5E] text-black border border-[#E2FB5E] cursor-pointer">
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
                        <span style={{ fontFamily: 'monospace', fontWeight: 500, fontSize: 12, color: isCurrentPlaying ? '#E2FB5E' : 'stone-500', width: 20, flexShrink: 0 }}>{numStr}</span>
                        <div className="rounded-[8px] overflow-hidden flex-shrink-0" style={{ width: 40, height: 40, border: '1px solid rgba(255,255,255,0.1)' }}>
                          <img src={track.cover} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="flex flex-col min-w-0 flex-1">
                          <span style={{ fontWeight: 600, fontSize: 14, color: isCurrentPlaying ? '#E2FB5E' : 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{track.title}</span>
                          <span className="text-stone-500 text-[11px]">{track.artist}</span>
                        </div>
                      </div>
                      <div className="flex-1 mx-4 hidden md:block">
                        <span className="text-stone-400 text-xs truncate block">{track.album || 'Single'}</span>
                      </div>
                      <div className="flex items-center gap-6">
                        <span className="text-stone-400 text-xs font-mono">{track.duration}</span>
                        <button onClick={(e) => { e.stopPropagation(); onToggleLike(track.id); }} className="opacity-60 hover:opacity-100 transition-opacity cursor-pointer">
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

          {/* Albums grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'white', marginBottom: 16 }}>Albums</h3>
              {artist.albums && artist.albums.length > 0 ? (
                <div className="grid grid-cols-2 gap-4">
                  {artist.albums.map((alb) => (
                    <div key={alb.id} onClick={() => onNavigate('albums', null, alb.id)} className="p-3 rounded-xl border border-white/5 bg-white/[0.01] hover:bg-white/5 transition-all text-left cursor-pointer">
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
            
            <div className="rounded-[20px] p-6 border border-white/5 bg-white/[0.01] flex flex-col gap-3">
              <h4 className="text-[10px] uppercase font-bold text-stone-500">Artist Bio</h4>
              <p className="text-stone-400 text-xs leading-relaxed">{artist.bio}</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // RENDER DIRECTORY HUB DEFAULT VIEW
  return (
    <div className="flex-1 overflow-y-auto px-8 pb-8 mt-6">
      {/* Editorial Hero Section */}
      <div className="relative rounded-[24px] overflow-hidden mb-10 p-8 border border-white/5 bg-[#141416]" style={{ minHeight: 340 }}>
        <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-25 md:opacity-40 z-0">
          <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200" alt="Spotlight" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#141416] via-transparent to-transparent" />
        </div>
        <div className="relative z-10 max-w-lg flex flex-col gap-4">
          <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-[3px]">Artist Spotlight</span>
          <h1 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 44, color: 'white', lineHeight: 1.1 }}>Discover Lyrical DNA</h1>
          <p className="text-stone-400 text-xs leading-relaxed">
            Explore 100+ real artists across Global, Indian, K-Pop, and Hip-Hop genres. Search by alias, mood, or lyrics to map the Music Universe.
          </p>

          {/* Autocomplete Input */}
          <div className="relative mt-4 w-full">
            <div className="flex items-center gap-3 px-5 py-3.5 bg-white/5 border border-white/10 rounded-full">
              <SearchIcon />
              <input
                type="text"
                placeholder="Search by artist, alias, or lyric quote..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-white border-none outline-none text-xs w-full ml-1"
              />
            </div>

            {/* Suggestions Overlay */}
            {suggestions && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-[#18181b] border border-white/10 rounded-2xl p-4 z-50 shadow-2xl flex flex-col gap-4 max-h-[300px] overflow-y-auto">
                {suggestions.artists.length > 0 && (
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Artists</span>
                    <div className="flex flex-col gap-2 mt-1">
                      {suggestions.artists.map(art => (
                        <div key={art.id} onClick={() => handleViewProfile(art.id)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer">
                          <img src={art.cover} alt="" className="w-8 h-8 rounded-lg object-cover" />
                          <span className="text-white text-xs font-bold">{art.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.lyrics.length > 0 && (
                  <div>
                    <span className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Lyrics Wall Matches</span>
                    <div className="flex flex-col gap-2 mt-1">
                      {suggestions.lyrics.map((lyr, idx) => (
                        <div key={idx} onClick={() => handleViewProfile(lyr.artistId)} className="p-2 rounded-xl hover:bg-white/5 cursor-pointer flex flex-col">
                          <span className="text-stone-300 text-xs italic">"{lyr.quote}"</span>
                          <span className="text-stone-500 text-[10px] mt-0.5">— {lyr.song} by {lyr.artist}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {suggestions.artists.length === 0 && suggestions.lyrics.length === 0 && (
                  <span className="text-stone-500 text-xs italic text-center py-2">No suggestions found. Press enter to run full scored search.</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Explore Through Emotion Categories */}
      <div className="mb-10">
        <div className="flex items-center justify-between mb-4">
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white' }}>Explore Through Emotion</h2>
          <span className="text-stone-500 text-[11px] font-semibold">Switch vibe viewports</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {Object.keys(emotionColors).map(emotion => {
            const isSelected = currentEmotionFilter === emotion
            const color = emotionColors[emotion]
            return (
              <button
                key={emotion}
                onClick={() => setCurrentEmotionFilter(isSelected ? null : emotion)}
                className="px-4 py-2 rounded-full text-xs font-bold border transition-all cursor-pointer hover:scale-105 active:scale-95"
                style={{
                  background: isSelected ? color : 'rgba(255,255,255,0.03)',
                  color: isSelected ? 'black' : 'white',
                  borderColor: isSelected ? color : 'rgba(255,255,255,0.1)'
                }}
              >
                {emotion.toUpperCase()}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Filter Layout Viewports */}
      {currentEmotionFilter && (
        <div className="mb-10 p-6 rounded-[24px] border border-white/5 bg-white/[0.01]">
          <h3 className="text-white text-lg font-bold mb-4 flex items-center gap-2">
            Spotlight on: <span className="capitalize" style={{ color: emotionColors[currentEmotionFilter] }}>{currentEmotionFilter}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {discoveryData?.trending
              .filter(a => a.topEmotion?.toLowerCase() === currentEmotionFilter)
              .map(art => (
                <div key={art.id} onClick={() => handleViewProfile(art.id)} className="p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <img src={art.cover} alt="" className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-sm font-bold truncate">{art.name}</span>
                      <span className="text-stone-500 text-[10px] truncate">{art.genre}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* Most Quoted Lyrics Wall */}
      {discoveryData?.quoted_lyrics && discoveryData.quoted_lyrics.length > 0 && (
        <div className="mb-10">
          <div className="mb-4">
            <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-widest">Global Lyrica Wall</span>
            <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white', marginTop: 4 }}>Most Quoted Lyrics</h2>
          </div>
          <div style={{ columnCount: window.innerWidth > 768 ? 3 : 1, columnGap: '20px' }}>
            {discoveryData.quoted_lyrics.map((wallItem, idx) => {
              const color = emotionColors[wallItem.emotion?.toLowerCase() || 'love'] || "#E2FB5E"
              return (
                <div key={idx} onClick={() => handleViewProfile(wallItem.artistId)} className="p-5 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all mb-5 break-inside-avoid flex flex-col gap-4 cursor-pointer" style={{ display: 'inline-block', width: '100%' }}>
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ color: color, background: `${color}15`, border: `1px solid ${color}30` }}>
                      {wallItem.emotion}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">{((wallItem.saveCount || 5200) / 1000).toFixed(1)}k saves</span>
                  </div>
                  <p style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 15, color: 'white', lineHeight: 1.5 }}>
                    "{wallItem.quote}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-white/5 pt-3 mt-1">
                    <img src={wallItem.artistCover} alt="" className="w-6 h-6 rounded-full object-cover" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs font-semibold truncate">{wallItem.song}</span>
                      <span className="text-stone-500 text-[10px] truncate">{wallItem.artist}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Trending Artists & India Bento Grid */}
      {discoveryData && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
          {/* Trending Panel */}
          <div className="lg:col-span-2">
            <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'white', marginBottom: 16 }}>Trending Now</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {discoveryData.trending.slice(0, 4).map((art) => (
                <div
                  key={art.id}
                  onClick={() => handleViewProfile(art.id)}
                  className="p-4 rounded-2xl border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-all cursor-pointer flex gap-4 group"
                >
                  <img src={art.cover} alt={art.name} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex flex-col justify-between min-w-0 py-1">
                    <div className="flex flex-col">
                      <span className="text-white text-sm font-bold truncate group-hover:text-[#E2FB5E] transition-colors">{art.name}</span>
                      <span className="text-stone-500 text-[10px] uppercase tracking-wider mt-0.5 truncate">{art.genre}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-stone-500 mt-2">
                      <span>Vibe: <b className="text-white">{art.topEmotion}</b></span>
                      <span>Score: <b className="text-[#E2FB5E]">{art.discoveryScore}</b></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* India Bento Spot */}
          <div className="p-6 rounded-[24px] border border-white/5 bg-gradient-to-b from-[#141416] to-[#0f0f10] flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-wider">Spotlight region</span>
              <h3 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 20, color: 'white', marginTop: 4, marginBottom: 12 }}>Popular in India</h3>
              <p className="text-stone-500 text-xs leading-relaxed mb-6">
                Discover local hits, Bollywood playbacks, and independent artists charting in India.
              </p>
              <div className="flex flex-col gap-3">
                {discoveryData.popular_in_india.slice(0, 3).map((art) => (
                  <div key={art.id} onClick={() => handleViewProfile(art.id)} className="flex items-center gap-3 p-2 rounded-xl hover:bg-white/5 cursor-pointer group">
                    <img src={art.cover} alt="" className="w-10 h-10 object-cover rounded-lg" />
                    <div className="flex flex-col min-w-0">
                      <span className="text-white text-xs font-bold truncate group-hover:text-[#E2FB5E]">{art.name}</span>
                      <span className="text-stone-500 text-[9px] truncate">{art.genre}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => handleViewProfile("arijit-singh")} className="w-full py-2.5 rounded-full font-bold text-xs uppercase bg-white/5 hover:bg-white/10 transition-all border border-white/10 text-white cursor-pointer mt-6">
              View Region Highlights
            </button>
          </div>
        </div>
      )}

      {/* Music Universe Canvas Graph Explorer */}
      <div className="rounded-[24px] border border-white/5 bg-[#0f0f10] p-6 mb-10 overflow-hidden relative">
        <div className="mb-4">
          <span className="text-[10px] font-bold text-[#E2FB5E] uppercase tracking-[3px]">Music Universe Explorer</span>
          <h2 style={{ fontFamily: 'Georgia, serif', fontStyle: 'italic', fontSize: 22, color: 'white', marginTop: 4 }}>Layered Discovery Graph</h2>
          <p className="text-stone-500 text-xs mt-1">
            Click on nodes to progressively reveal deeper layers: <b>Artist ➔ Albums ➔ Songs ➔ Lyrical Quotes</b>.
          </p>
        </div>

        <div className="relative bg-black/40 rounded-2xl border border-white/5 overflow-hidden flex justify-center items-center" style={{ height: 450 }}>
          <canvas
            ref={canvasRef}
            width={800}
            height={450}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            className="w-full h-full block cursor-pointer"
          />

          {/* Node Hover/Selection Tooltip Overlay */}
          {(selectedNode || hoveredNode) && (
            <div className="absolute bottom-4 left-4 p-4 rounded-xl border border-white/10 bg-[#18181b]/90 backdrop-blur-md max-w-xs z-20 flex flex-col gap-2">
              <span className="text-[9px] font-bold text-[#E2FB5E] uppercase tracking-wider">{(selectedNode || hoveredNode)!.type} Details</span>
              <h4 className="text-white text-xs font-bold">{(selectedNode || hoveredNode)!.label}</h4>
              {((selectedNode || hoveredNode)!.type === "artist") && (
                <div className="flex flex-col gap-1 text-[10px] text-stone-400 mt-1">
                  <span>Primary Vibe: <b className="text-white">{(selectedNode || hoveredNode)!.meta?.vibe}</b></span>
                  <span>Discovery Score: <b className="text-[#E2FB5E]">{(selectedNode || hoveredNode)!.meta?.score}</b></span>
                </div>
              )}
              {((selectedNode || hoveredNode)!.type === "album") && (
                <div className="flex flex-col gap-1 text-[10px] text-stone-400 mt-1">
                  <span>Created by: <b className="text-white">{artist ? artist.name : "Taylor Swift"}</b></span>
                </div>
              )}
              {((selectedNode || hoveredNode)!.type === "song") && (
                <div className="flex flex-col gap-1 text-[10px] text-stone-400 mt-1">
                  <span>Contains lyrics quotes. Click to expand.</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
