// --- Liked Songs Persistence Helpers ---
async function fetchLikedSongs() {
  try {
    const res = await fetch('/api/user/liked-songs', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      state.liked = new Set(data.liked_songs || []);
      renderDashboard && renderDashboard();
    }
  } catch (e) { console.warn('Failed to fetch liked songs:', e); }
}

async function updateLikedSong(songId, action) {
  try {
    const res = await fetch('/api/user/liked-songs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ song_id: songId, action })
    });
    if (res.ok) {
      const data = await res.json();
      state.liked = new Set(data.liked_songs || []);
      updateHeartButton && updateHeartButton();
      renderPlaylists && renderPlaylists();
      if (state.currentPlaylist === "liked" && typeof renderPlaylist === 'function') renderPlaylist("liked");
    }
  } catch (e) { console.warn('Failed to update liked song:', e); }
}

// --- User Playlists Persistence Helpers ---
async function fetchUserPlaylists() {
  try {
    const res = await fetch('/api/playlists/', { credentials: 'include' });
    if (res.ok) {
      const data = await res.json();
      // replace local PLAYLISTS with server playlists
      PLAYLISTS.length = 0;
      (data.playlists || []).forEach((p) => {
        PLAYLISTS.push({ id: p.id, name: p.name, songs: p.songs || [] });
      });
      renderPlaylists && renderPlaylists();
    }
  } catch (e) { console.warn('Failed to fetch user playlists:', e); }
}

async function updatePlaylistSong(playlistId, songId, action) {
  try {
    if (action === 'add') {
      const res = await fetch(`/api/playlists/${playlistId}/songs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ song_id: songId })
      });
      if (res.ok) {
        await fetchUserPlaylists();
      }
    } else {
      const res = await fetch(`/api/playlists/${playlistId}/songs/${encodeURIComponent(songId)}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      if (res.ok) {
        await fetchUserPlaylists();
      }
    }
  } catch (e) { console.warn('Failed to update playlist song:', e); }
}
/* ============================================
   LYRICA - VANILLA JS APP
   ============================================ */

// ========== DATA ==========
const SONGS = [
  {
    id: 1,
    title: "Blank",
    artist: "Disfigure",
    album: "NCS Release",
    duration: "",
    cover: "./images/disfigure.jpg",
    file: "./songs/disfigure.mp3",
  },
  {
    id: 2,
    title: "Fade",
    artist: "",
    album: "",
    duration: "",
    cover: "./images/fade.jpg",
    file: "./songs/fade.mp3",
  },
  {
    id: 3,
    title: "Fearless",
    artist: "",
    album: "",
    duration: "",
    cover: "./images/fearless.jpg",
    file: "./songs/fearless.mp3",
  },
  {
    id: 4,
    title: "For A Reason",
    artist: "Karan Aujla",
    album: "P-POP CULTURE",
    duration: "",
    cover: "./images/for-a-reason.jpg",
    file: "./songs/for%20a%20reason.mp3",
  },
  {
    id: 5,
    title: "Laembadgini",
    artist: "Diljit Dosanjh",
    album: "Laembadgini",
    duration: "",
    cover: "./images/Laembadgini.jpg",
    file: "./songs/laembadgini.mp3",
  },
  {
    id: 6,
    title: "Lover Ft. Intense",
    artist: "Diljit Dosanjh",
    album: "Lover",
    duration: "",
    cover: "./images/lover.jpg",
    file: "./songs/lover.mp3",
  },
  {
    id: 7,
    title: "Sky High",
    artist: "",
    album: "",
    duration: "",
    cover: "./images/skyhigh.jpg",
    file: "./songs/sky%20high.mp3",
  },
  {
    id: 8,
    title: "Shine",
    artist: "Spektrem",
    album: "NCS Release",
    duration: "",
    cover: "./images/spektrem.jpg",
    file: "./songs/spektrem.mp3",
  },
  {
    id: 9,
    title: "Wavy",
    artist: "Karan Aujla, Jay Trak",
    album: "Wavy",
    duration: "",
    cover: "./images/wavy.jpg",
    file: "./songs/wavy.mp3",
  },
  {
    id: 10,
    title: "Winning Speech",
    artist: "",
    album: "",
    duration: "",
    cover: "./images/winning-speech.jpg",
    file: "./songs/winning%20speech.mp3",
  },
];

const PLAYLISTS = [
  { id: "fav", name: "My Favorites", songs: [1, 3] },
  { id: "workout", name: "Workout Mix", songs: [2, 4, 5] },
  { id: "chill", name: "Chill Vibes", songs: [3, 6] },
  { id: "road", name: "Road Trip", songs: [1, 2, 4] },
  { id: "study", name: "Study Focus", songs: [5, 6] },
];

// Liked Songs playlist (special playlist that can't be deleted/renamed)
function getLikedSongsPlaylist() {
  return {
    id: "liked",
    name: "Liked Songs",
    songs: Array.from(state.liked),
    isSpecial: true,
    cover: "./images/liked.png",
  };
}

const CONCERTS = [
  {
    id: 1,
    artist: "Luna Eclipse",
    venue: "The Grand Theater",
    city: "New York, NY",
    date: "Dec 15, 2025",
    time: "8:00 PM",
    img: "./images/disfigure.jpg",
    price: "$45",
  },
  {
    id: 2,
    artist: "Neon Waves",
    venue: "Electric Arena",
    city: "Los Angeles, CA",
    date: "Dec 20, 2025",
    time: "7:30 PM",
    img: "./images/fade.jpg",
    price: "$55",
  },
  {
    id: 3,
    artist: "Coastal Sounds",
    venue: "Beachside Pavilion",
    city: "Miami, FL",
    date: "Dec 22, 2025",
    time: "9:00 PM",
    img: "./images/fearless.jpg",
    price: "$40",
  },
  {
    id: 4,
    artist: "City Beats",
    venue: "Metropolitan Hall",
    city: "Chicago, IL",
    date: "Dec 28, 2025",
    time: "8:30 PM",
    img: "./images/skyhigh.jpg",
    price: "$50",
  },
];

// ========== STATE ==========
let state = {
  isLoggedIn: true,
  isSignUp: false,
  currentScreen: "dashboard",
  currentPlaylist: "fav",
  currentTrackIndex: 0,
  currentSongId: null,
  currentQueue: [], // Array of song IDs in current playback queue
  isPlaying: false,
  isShuffle: false,
  isRepeat: false,
  liked: new Set([1, 3]),
  recentlyPlayed: [1, 2, 3],
};

// ========== DOM REFS ==========
const screens = {
  login: document.getElementById("login-screen"),
  dashboard: document.getElementById("dashboard-screen"),
  playlist: document.getElementById("playlist-screen"),
};

const loginEl = {
  form: document.getElementById("auth-form"),
  title: document.getElementById("auth-title"),
  subtitle: document.getElementById("auth-subtitle"),
  nameGroup: document.getElementById("name-group"),
  toggleBtn: document.getElementById("toggle-auth-btn"),
  toggleText: document.getElementById("toggle-text"),
  forgotLink: document.getElementById("forgot-password-link"),
};

function setAuthMode(isSignUp) {
  state.isSignUp = isSignUp;
  if (isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
  }
  const submitBtn = loginEl.form?.querySelector("button[type='submit']");
  if (submitBtn) {
    submitBtn.textContent = isSignUp ? "Create Account" : "Sign In";
  }
}

// Ensure the UI reflects the starting mode on load
setAuthMode(state.isSignUp);

const dashboardEl = {
  sidebar: document.getElementById("sidebar"),
  menuBtn: document.getElementById("menu-btn"),
  closeSidebarBtn: document.getElementById("close-sidebar-btn"),
  navItems: document.querySelectorAll(".nav-item"),
  playlistsList: document.getElementById("playlists-list"),
  addPlaylistBtn: document.getElementById("add-playlist-btn"),
  searchInput: document.getElementById("search-input"),
  resultsContainer: document.getElementById("results-container"),
  trendingGrid: document.getElementById("trending-grid"),
  recentlyPlayed: document.getElementById("recently-played"),
  concertsBtn: document.getElementById("concerts-btn"),
};

// Ensure top navbar hamburger reliably toggles sidebar
if (dashboardEl.menuBtn) {
  dashboardEl.menuBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    dashboardEl.sidebar?.classList.toggle('open');
  });
}

// Top logout button in navbar (transparent style)
const topLogoutBtn = document.getElementById('logout-top-btn');
if (topLogoutBtn) {
  topLogoutBtn.addEventListener('click', async (ev) => {
    ev.preventDefault();
    try {
      const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
      if (res.ok) {
        // reload the page to reflect logged out state
        window.location.reload();
      } else {
        console.warn('Logout failed', await res.text());
        alert('Logout failed');
      }
    } catch (e) {
      console.warn('Logout request failed', e);
      alert('Logout request failed');
    }
  });
}

// --- Debug & robust listeners: log clicks and ensure toggles work ---
function showDebugToast(msg) {
  try {
    let t = document.getElementById('debug-toast');
    if (!t) {
      t = document.createElement('div');
      t.id = 'debug-toast';
      t.style.position = 'fixed';
      t.style.right = '16px';
      t.style.bottom = '80px';
      t.style.padding = '8px 12px';
      t.style.background = 'rgba(0,0,0,0.7)';
      t.style.color = '#fff';
      t.style.borderRadius = '6px';
      t.style.zIndex = 9999;
      document.body.appendChild(t);
    }
    t.textContent = msg;
    t.style.opacity = '1';
    clearTimeout(t._hideTimer);
    t._hideTimer = setTimeout(() => { t.style.opacity = '0'; }, 1800);
  } catch (e) { console.warn('Toast failed', e); }
}

['menu-btn','menu-btn-pl','user-menu-btn','user-menu-btn-pl','concerts-btn','concerts-btn-pl'].forEach(id => {
  const el = document.getElementById(id);
  if (!el) return;
  el.addEventListener('click', (ev) => {
    ev.stopPropagation();
    console.info('Clicked top control:', id);
    // Only show debug toast for concerts buttons (helpful during event debugging)
    if (id.startsWith('concerts')) showDebugToast('Clicked: ' + id);
    // specific behaviors
    if (id === 'menu-btn') document.getElementById('sidebar')?.classList.toggle('open');
    if (id === 'menu-btn-pl') document.getElementById('sidebar-pl')?.classList.toggle('open');
    if (id === 'user-menu-btn') {
      const menu = document.getElementById('user-menu');
      if (menu) {
        const isOpen = menu.classList.toggle('open');
        menu.style.display = isOpen ? 'block' : 'none';
      }
    }
    if (id === 'user-menu-btn-pl') {
      const menu = document.getElementById('user-menu-pl');
      if (menu) {
        const isOpen = menu.classList.toggle('open');
        menu.style.display = isOpen ? 'block' : 'none';
      }
    }
    // removed automatic re-dispatch to avoid recursion
  });
});

const playlistEl = {
  backBtn: document.getElementById("btn-back"),
  cover: document.getElementById("playlist-cover"),
  title: document.getElementById("playlist-title"),
  count: document.getElementById("playlist-count"),
  tbody: document.getElementById("songs-tbody"),
  playBtn: document.getElementById("btn-play-playlist"),
  shuffleBtn: document.getElementById("btn-shuffle-playlist"),
  editBtn: document.getElementById("btn-edit-playlist"),
  sidebar: document.getElementById("sidebar-pl"),
  menuBtn: document.getElementById("menu-btn-pl"),
  closeSidebarBtn: document.getElementById("close-sidebar-btn-pl"),
  playlistsList: document.getElementById("playlists-list-pl"),
  addPlaylistBtn: document.getElementById("add-playlist-btn-pl"),
  concertsBtn: document.getElementById("concerts-btn-pl"),
};

const playerEl = {
  // Original (now bottom floating player)
  cover: document.getElementById("bottom-player-cover") || document.getElementById("player-cover"),
  title: document.getElementById("bottom-player-title") || document.getElementById("player-title"),
  artist: document.getElementById("bottom-player-artist") || document.getElementById("player-artist"),
  // New right sidebar (Now Playing)
  npCover: document.getElementById("player-cover"),
  npTitle: document.getElementById("player-title"),
  npArtist: document.getElementById("player-artist"),
  // Controls
  playBtn: document.getElementById("btn-play"),
  playIcon: document.querySelector("#btn-play .icon"),
  prevBtn: document.getElementById("btn-prev"),
  nextBtn: document.getElementById("btn-next"),
  shuffleBtn: document.getElementById("btn-shuffle"),
  repeatBtn: document.getElementById("btn-repeat"),
  volumeBtn: document.getElementById("btn-volume"),
  progressSlider: document.getElementById("progress-slider"),
  volumeSlider: document.getElementById("volume-slider"),
  audio: document.getElementById("audio-player"),
  heartBtn: null, // Will be created dynamically
};

const isFileProtocol =
  typeof window !== "undefined" && window.location.protocol === "file:";

function resolveSongSource(filePath) {
  if (!filePath) return null;

  if (
    /^https?:\/\//i.test(filePath) ||
    filePath.startsWith("blob:") ||
    filePath.startsWith("data:")
  ) {
    return filePath;
  }

  const normalized = filePath.replace(/^[.\\/]+/, "");
  const startsWithSongs = /^songs[\\/]/i.test(normalized);

  if (isFileProtocol) {
    if (filePath.startsWith("./") || filePath.startsWith(".\\")) {
      return filePath;
    }
    if (startsWithSongs) {
      return `./${normalized}`;
    }
    return `./songs/${normalized}`;
  }

  if (filePath.startsWith("/")) {
    return filePath;
  }
  if (startsWithSongs) {
    return `/${normalized.replace(/\\/g, "/")}`;
  }
  return `/songs/${normalized.replace(/\\/g, "/")}`;
}

// Map a 0..1 slider normalized value to audio gain (0..1) using a perceptual curve.
// Use a power curve with exponent < 1 to make the volume more sensitive to small slider moves.
// Lower exponents (e.g. 0.4) make small values map to higher gains (more fragile/high sensitivity).
function sliderNormToGain(norm) {
  const n = Math.min(1, Math.max(0, Number(norm) || 0));
  
  const minDb = -50;
  const maxDb = 0;

  const db = minDb + (maxDb - minDb) * n;
  return Math.pow(10, db / 20);
}

if (playerEl.audio && playerEl.volumeSlider) {
  const initialVolume =
    typeof playerEl.volumeSlider.value === "string"
      ? parseFloat(playerEl.volumeSlider.value)
      : playerEl.volumeSlider.value || 70;
  const norm = (initialVolume || 70) / 100;
  playerEl.audio.volume = sliderNormToGain(norm);

  // Mirror the value to the playlist player slider if present
  try {
    if (playerPl && playerPl.volumeSlider) playerPl.volumeSlider.value = initialVolume;
  } catch (e) {}
}

// Playlist-bottom player controls (mirror UI for same audio element)
const playerPl = {
  cover: document.getElementById("player-cover-pl"),
  title: document.getElementById("player-title-pl"),
  artist: document.getElementById("player-artist-pl"),
  shuffleBtn: document.getElementById("btn-shuffle-pl"),
  repeatBtn: document.getElementById("btn-repeat-pl"),
  playBtn: document.getElementById("btn-play-pl"),
  playIcon: document.querySelector("#btn-play-pl .icon"),
  prevBtn: document.getElementById("btn-prev-pl"),
  nextBtn: document.getElementById("btn-next-pl"),
  progressSlider: document.getElementById("progress-slider-pl"),
  volumeSlider: document.getElementById("volume-slider-pl"),
  heartBtn: null, // Will be created dynamically
};

const concertsModal = {
  modal: document.getElementById("concerts-modal"),
  closeBtn: document.getElementById("close-modal-btn"),
  list: document.getElementById("concerts-list"),
};

// Guard to prevent multiple simultaneous concert fetches
let concertsLoading = false;

// Fetch nearby concerts from server (which proxies Ticketmaster)
async function fetchNearbyConcerts(lat, lng, radius = 50, country) {
  try {
    let url = `/api/discover/concerts?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&radius=${encodeURIComponent(radius)}`;
    if (country) url += `&country=${encodeURIComponent(country)}`;
    const res = await fetch(url);
    if (!res.ok) {
      // try parse JSON error body
      let body = null;
      try { body = await res.json(); } catch (e) { body = await res.text(); }
      console.warn('Failed to fetch nearby concerts', res.status, body);
      return { error: body && body.error ? body.error : (typeof body === 'string' ? body : JSON.stringify(body)) };
    }
    const data = await res.json();
    return { events: data.events || [] };
  } catch (e) {
    console.warn('Error fetching nearby concerts', e);
    return { error: e.message || String(e) };
  }
}

const createPlaylistModal = {
  modal: document.getElementById("create-playlist-modal"),
  closeBtn: document.getElementById("close-create-playlist-modal"),
  form: document.getElementById("create-playlist-form"),
  input: document.getElementById("playlist-name-input"),
};

const playlistContextModal = {
  modal: document.getElementById("playlist-context-menu"),
  renameBtn: document.getElementById("playlist-rename-btn"),
  deleteBtn: document.getElementById("playlist-delete-btn"),
  selectedPlaylistId: null,
};

const renamePlaylistModal = {
  modal: document.getElementById("rename-playlist-modal"),
  closeBtn: document.getElementById("close-rename-playlist-modal"),
  form: document.getElementById("rename-playlist-form"),
  input: document.getElementById("rename-playlist-input"),
  playlistId: null,
};

const userMenus = {
  dashboard: {
    btn: document.getElementById("user-menu-btn"),
    menu: document.getElementById("user-menu"),
    logoutBtn: document.getElementById("logout-btn"),
  },
  playlist: {
    btn: document.getElementById("user-menu-btn-pl"),
    menu: document.getElementById("user-menu-pl"),
    logoutBtn: document.getElementById("logout-btn-pl"),
  },
};

// ---------------------------
// UI: Playlist context (rename/delete) handlers
// ---------------------------
if (playlistContextModal.renameBtn) {
  playlistContextModal.renameBtn.addEventListener("click", () => {
    // Hide context menu and open rename modal
    try {
      playlistContextModal.modal.style.display = "none";
      const id = playlistContextModal.selectedPlaylistId;
      const pl = PLAYLISTS.find((p) => p.id === id) || { name: "" };
      renamePlaylistModal.input.value = pl.name || "";
      renamePlaylistModal.playlistId = id;
      renamePlaylistModal.modal.classList.add("active");
      // focus input
      setTimeout(() => renamePlaylistModal.input.focus(), 50);
    } catch (e) {
      console.warn("Rename dialog open failed:", e);
    }
  });
}

if (playlistContextModal.deleteBtn) {
  playlistContextModal.deleteBtn.addEventListener("click", async () => {
    try {
      const id = playlistContextModal.selectedPlaylistId;
      if (!id) return;
      const ok = confirm("Delete this playlist? This action cannot be undone.");
      if (!ok) return;
      const res = await fetch(`/api/playlists/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (res.ok) {
        await fetchUserPlaylists();
        renderPlaylists();
        // if currently viewing the deleted playlist, go back to dashboard
        if (state.currentPlaylist === id) {
          showScreen("dashboard");
        }
      } else {
        console.warn("Failed to delete playlist:", await res.text());
      }
    } catch (e) {
      console.warn("Playlist delete failed:", e);
    } finally {
      playlistContextModal.modal.style.display = "none";
    }
  });
}

// Wire rename form submit
if (renamePlaylistModal.form) {
  renamePlaylistModal.form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const id = renamePlaylistModal.playlistId;
    const newName = (renamePlaylistModal.input.value || "").trim();
    if (!id || !newName) return;
    try {
      const res = await fetch(`/api/playlists/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName }),
      });
      if (res.ok) {
        await fetchUserPlaylists();
        renderPlaylists();
        renamePlaylistModal.modal.classList.remove("active");
      } else {
        console.warn("Rename failed:", await res.text());
      }
    } catch (e) {
      console.warn("Rename request failed:", e);
    }
  });
}

// Close buttons for modals
if (renamePlaylistModal.closeBtn) {
  renamePlaylistModal.closeBtn.addEventListener("click", () => {
    renamePlaylistModal.modal.classList.remove("active");
  });
}
if (createPlaylistModal.closeBtn) {
  createPlaylistModal.closeBtn.addEventListener("click", () => {
    createPlaylistModal.modal.classList.remove("active");
  });
}

// ---------------------------
// Global: fallback menu toggles (hamburger buttons and three-dots)
// Adds robustness in case elements are dynamically re-rendered
// ---------------------------
document.addEventListener("click", (e) => {
  const menuBtn = e.target.closest(".btn-menu");
  if (menuBtn) {
    // determine which screen the button belongs to
    if (menuBtn.id === "menu-btn") {
      document.getElementById("sidebar")?.classList.toggle("open");
    } else if (menuBtn.id === "menu-btn-pl") {
      document.getElementById("sidebar-pl")?.classList.toggle("open");
    }
  }

  const userDot = e.target.closest(".btn-user-menu");
  if (userDot) {
    // toggle corresponding user menu
    const wrapper = userDot.closest(".top-right, .user-menu-wrapper");
    if (!wrapper) return;
    const menu = wrapper.querySelector(".user-menu");
    if (!menu) return;
    menu.classList.toggle("open");
  }
});

// ========== UTILITY FUNCTIONS ==========
function showScreen(screenName) {
  Object.values(screens).forEach((s) => s.classList.remove("active"));
  screens[screenName]?.classList.add("active");
  state.currentScreen = screenName;
  // Close any open modals when switching screens
  concertsModal.modal.classList.remove("active");
}

// ========== INTERACTION HANDLERS ==========
function playSong(songId, queue = null, displayOverride = null) {
  console.log(`[playSong] Attempting to play song ID: ${songId}`);
  const song = getSongById(songId);
  if (!song) {
    console.warn(`[playSong] Song not found for ID: ${songId}`);
    return;
  }

  // Update queue if provided, otherwise use all songs
  if (queue) {
    state.currentQueue = queue;
  } else if (state.currentQueue.length === 0) {
    state.currentQueue = SONGS.map((s) => s.id);
  }

  state.currentSongId = songId;
  state.currentTrackIndex = state.currentQueue.findIndex((id) => id === songId);

  const songSrc = resolveSongSource(song.file);
  console.log(`[playSong] Resolved audio source:`, songSrc);
  if (!songSrc) {
    console.warn(`[playSong] No audio source resolved for:`, song.file);
    alert("This song cannot be played because it has no audio source.");
    return;
  }
  
  if (!playerEl.audio) {
    console.error("[playSong] playerEl.audio is undefined!");
    return;
  }

  playerEl.audio.src = songSrc;
  playerEl.audio.load();

  const titleToDisplay = displayOverride ? displayOverride.title : song.title;
  const artistToDisplay = displayOverride ? displayOverride.artist : song.artist;
  const coverToDisplay = displayOverride ? displayOverride.cover : song.cover;

  if (playerEl.cover) playerEl.cover.src = coverToDisplay;
  if (playerEl.title) playerEl.title.textContent = titleToDisplay;
  if (playerEl.artist) playerEl.artist.textContent = artistToDisplay;

  if (playerEl.npCover) playerEl.npCover.src = coverToDisplay;
  if (playerEl.npTitle) playerEl.npTitle.textContent = titleToDisplay;
  if (playerEl.npArtist) playerEl.npArtist.textContent = artistToDisplay;

  // Sync playlist page player
  if (playerPl.cover) {
    playerPl.cover.src = song.cover;
    playerPl.title.textContent = song.title;
    playerPl.artist.textContent = song.artist;
  }

  console.log(`[playSong] Calling playerEl.audio.play()...`);
  playerEl.audio
    .play()
    .then(() => {
      console.log(`[playSong] Playback started successfully.`);
      state.isPlaying = true;
      updatePlayButton();
    })
    .catch((err) => {
      console.error(`[playSong] Playback failed:`, err);
      // alert("Unable to start playback. Please check the console for details or ensure the file exists.");
    });

  // Reset progress bar and timer
  if (playerEl.progressSlider) playerEl.progressSlider.value = 0;
  if (playerPl.progressSlider) playerPl.progressSlider.value = 0;
  updatePlayerTimer(0, playerEl.audio.duration || 0);

  // Update heart button state
  updateHeartButton();

  // Add to recently played (move to front, remove previous occurrence)
  const idx = state.recentlyPlayed.indexOf(songId);
  if (idx !== -1) state.recentlyPlayed.splice(idx, 1);
  state.recentlyPlayed.unshift(songId);
  if (state.recentlyPlayed.length > 10) state.recentlyPlayed.pop();

  // Update the UI
  renderRecentlyPlayed();
}

// =====================================================
// YOUTUBE AUDIO PLAYER (Hidden iframe)
// =====================================================

// =============================================
// YOUTUBE PLAYER API — AUTOPLAY FIX
// =============================================
let ytPlayer = null;

function loadYTPlayerAPI() {
    return new Promise(resolve => {
        if (window.YT && window.YT.Player) {
            resolve();
            return;
        }
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.body.appendChild(tag);

        window.onYouTubeIframeAPIReady = () => {
            resolve();
        };
    });
}

async function playYouTube(videoId) {
    console.log("[YT] Play request:", videoId);

    // stop local audio
    if (playerEl.audio) {
        try {
            playerEl.audio.pause();
            playerEl.audio.currentTime = 0;
        } catch (e) {
            console.warn("Failed to pause local audio before YouTube playback:", e);
        }
    }

    await loadYTPlayerAPI();

    if (!ytPlayer) {
        // create container
        let div = document.createElement("div");
        div.id = "hidden-yt-player";
        div.style.position = "fixed";
        div.style.left = "-9999px";       // not display:none (required for autoplay)
        div.style.width = "1px";
        div.style.height = "1px";
        document.body.appendChild(div);

        ytPlayer = new YT.Player("hidden-yt-player", {
            height: "1",
            width: "1",
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 0,
                mute: 1          // IMPORTANT TRICK
            },
            events: {
                onReady: (event) => {
                    event.target.playVideo();
                    setTimeout(() => {
                        event.target.unMute();
                    }, 600);
                }
            }
        });
    } else {
        ytPlayer.loadVideoById(videoId);
        ytPlayer.mute();               // mute to allow autoplay
        setTimeout(() => {
            ytPlayer.unMute();         // unmute after allowed
        }, 600);
    }

    // update your player UI
    const titleEl = document.getElementById("player-title");
    const artistEl = document.getElementById("player-artist");
    if (titleEl) titleEl.textContent = "YouTube Track";
    if (artistEl) artistEl.textContent = "Streaming via YouTube";
}



function updatePlayButton() {
  const playIcon =
    playerEl.playIcon || playerEl.playBtn?.querySelector(".icon");
  if (playIcon) {
    if (state.isPlaying) {
      playIcon.innerHTML = '<use xlink:href="#icon-pause"></use>';
    } else {
      playIcon.innerHTML = '<use xlink:href="#icon-play"></use>';
    }
  }

  // Update playlist page play button
  if (playerPl.playIcon) {
    if (state.isPlaying) {
      playerPl.playIcon.innerHTML = '<use xlink:href="#icon-pause"></use>';
    } else {
      playerPl.playIcon.innerHTML = '<use xlink:href="#icon-play"></use>';
    }
  }
}

function updateHeartButton() {
  if (!state.currentSongId) return;
  const isLiked = state.liked.has(state.currentSongId);
  const heartBtns = [playerEl.heartBtn, playerPl.heartBtn].filter(Boolean);
  heartBtns.forEach((btn) => {
    if (btn) {
      btn.classList.toggle("liked", isLiked);
      btn.style.color = isLiked ? "#e74c3c" : "currentColor";
    }
  });
}

function getNextSong() {
  if (state.currentQueue.length === 0) return null;

  if (state.isShuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * state.currentQueue.length);
    } while (
      state.currentQueue.length > 1 &&
      state.currentQueue[nextIndex] === state.currentSongId
    );
    return state.currentQueue[nextIndex];
  } else {
    const nextIndex = (state.currentTrackIndex + 1) % state.currentQueue.length;
    return state.currentQueue[nextIndex];
  }
}

function getPrevSong() {
  if (state.currentQueue.length === 0) return null;

  if (state.isShuffle) {
    let prevIndex;
    do {
      prevIndex = Math.floor(Math.random() * state.currentQueue.length);
    } while (
      state.currentQueue.length > 1 &&
      state.currentQueue[prevIndex] === state.currentSongId
    );
    return state.currentQueue[prevIndex];
  } else {
    const prevIndex =
      (state.currentTrackIndex - 1 + state.currentQueue.length) %
      state.currentQueue.length;
    return state.currentQueue[prevIndex];
  }
}

// Update progress bar and timer as song plays
if (playerEl.audio) {
  playerEl.audio.addEventListener("timeupdate", () => {
    const current = playerEl.audio.currentTime;
    const total = playerEl.audio.duration || 0;
    playerEl.progressSlider.value = total ? (current / total) * 100 : 0;
    if (playerPl.progressSlider)
      playerPl.progressSlider.value = total ? (current / total) * 100 : 0;
    updatePlayerTimer(current, total);
  });

  playerEl.audio.addEventListener("error", () => {
    const mediaError = playerEl.audio.error;
    let message = "Unknown audio error.";
    if (mediaError) {
      switch (mediaError.code) {
        case mediaError.MEDIA_ERR_ABORTED:
          message = "Playback was aborted.";
          break;
        case mediaError.MEDIA_ERR_NETWORK:
          message = "Network error while fetching the audio.";
          break;
        case mediaError.MEDIA_ERR_DECODE:
          message = "Browser failed to decode the audio stream.";
          break;
        case mediaError.MEDIA_ERR_SRC_NOT_SUPPORTED:
          message = "Audio source not supported or missing.";
          break;
      }
    }
    alert(`Audio error: ${message}`);
  });

  // Auto-play next song when current song ends
  playerEl.audio.addEventListener("ended", () => {
    if (state.isRepeat) {
      // Repeat current song
      playSong(state.currentSongId);
    } else {
      // Play next song
      const nextId = getNextSong();
      if (nextId) {
        playSong(nextId);
      } else {
        state.isPlaying = false;
        updatePlayButton();
      }
    }
  });

  playerEl.progressSlider.addEventListener("input", () => {
    const total = playerEl.audio.duration || 0;
    playerEl.audio.currentTime = (playerEl.progressSlider.value / 100) * total;
  });

  if (playerPl.progressSlider) {
    playerPl.progressSlider.addEventListener("input", () => {
      const total = playerEl.audio.duration || 0;
      playerEl.audio.currentTime =
        (playerPl.progressSlider.value / 100) * total;
    });
  }

  playerEl.volumeSlider.addEventListener("input", () => {
    const raw = Number(playerEl.volumeSlider.value || 0);
    const vol = sliderNormToGain(raw / 100);
    playerEl.audio.volume = vol;
    if (playerPl && playerPl.volumeSlider) playerPl.volumeSlider.value = raw;
  });
}

// Mirror playlist page volume slider to main player (if present)
if (playerPl && playerPl.volumeSlider) {
  try {
    playerPl.volumeSlider.addEventListener('input', () => {
      const raw = Number(playerPl.volumeSlider.value || 0);
      const vol = sliderNormToGain(raw / 100);
      if (playerEl && playerEl.audio) playerEl.audio.volume = vol;
      if (playerEl && playerEl.volumeSlider) playerEl.volumeSlider.value = raw;
    });
  } catch (e) {}
}

function updatePlayerTimer(current, total) {
  const cur = formatDuration(current);
  const tot = formatDuration(total);

  // Backwards-compatible: if an element with id `player-timer` exists, update it
  const timerEl = document.getElementById("player-timer");
  if (timerEl) {
    timerEl.textContent = `${cur} / ${tot}`;
  }

  // Update the visible time spans next to the main progress slider
  try {
    if (playerEl.progressSlider) {
      const progressBar = playerEl.progressSlider.closest('.progress-bar');
      if (progressBar) {
        const times = progressBar.querySelectorAll('.time');
        if (times && times.length >= 2) {
          times[0].textContent = cur;
          times[1].textContent = tot;
        }
      }
    }
  } catch (e) {
    // ignore DOM errors
  }

  // Update the playlist-page progress time spans as well
  try {
    if (playerPl.progressSlider) {
      const progressBarPl = playerPl.progressSlider.closest('.progress-bar');
      if (progressBarPl) {
        const times2 = progressBarPl.querySelectorAll('.time');
        if (times2 && times2.length >= 2) {
          times2[0].textContent = cur;
          times2[1].textContent = tot;
        }
      }
    }
  } catch (e) {
    // ignore DOM errors
  }
}

// Playlist page controls (play/shuffle)
if (playlistEl.playBtn) {
  playlistEl.playBtn.addEventListener("click", () => {
    const songs = getSongsInPlaylist(state.currentPlaylist);
    if (songs.length > 0) playSong(songs[0].id);
  });
}
if (playlistEl.shuffleBtn) {
  playlistEl.shuffleBtn.addEventListener("click", () => {
    const songs = getSongsInPlaylist(state.currentPlaylist);
    if (songs.length > 0) {
      const randomSong = songs[Math.floor(Math.random() * songs.length)];
      playSong(randomSong.id);
    }
  });
}

function openPlaylistContextMenu(playlistId, anchorEl) {
  playlistContextModal.selectedPlaylistId = playlistId;
  const rect = anchorEl.getBoundingClientRect();
  playlistContextModal.modal.style.display = "block";
  playlistContextModal.modal.style.position = "absolute";
  playlistContextModal.modal.style.left = `${rect.left}px`;
  playlistContextModal.modal.style.top = `${rect.bottom + window.scrollY}px`;
}

// Hide context menu when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest("#playlist-context-menu")) {
    playlistContextModal.modal.style.display = "none";
  }
});

// Concerts button handler
if (dashboardEl.concertsBtn) {
  dashboardEl.concertsBtn.addEventListener("click", async () => {
    if (concertsLoading) return; // ignore repeated clicks while loading
    concertsLoading = true;
    try {
      concertsModal.modal.classList.add("active");
      concertsModal.list.innerHTML = "<div style='padding:12px;color:#666;'>Loading nearby concerts...</div>";

    // Try to get geolocation; if not available or denied, fall back to static CONCERTS
    function getPosition() {
      return new Promise((resolve, reject) => {
        if (!navigator.geolocation) return reject(new Error('Geolocation not supported'));
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve(pos.coords),
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
      });
    }

    let eventsResult = null;
    let usedCoords = null;
    try {
      const coords = await getPosition();
      usedCoords = coords;
      // Show the coords being used so user can verify location
      const info = document.createElement('div');
      info.style.padding = '8px';
      info.style.color = '#333';
      info.style.fontSize = '13px';
      info.textContent = `Using location: ${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
      concertsModal.list.innerHTML = '';
      concertsModal.list.appendChild(info);
      eventsResult = await fetchNearbyConcerts(coords.latitude, coords.longitude, 50);
    } catch (e) {
      console.warn('Geolocation or fetchNearbyConcerts failed:', e);
      eventsResult = { error: e && e.message ? e.message : String(e) };
    }
    // If fetchNearbyConcerts returned an error object, show it to the user
    if (eventsResult && eventsResult.error) {
      const errMsg = typeof eventsResult.error === 'string' ? eventsResult.error : JSON.stringify(eventsResult.error);
      const warn = document.createElement('div');
      warn.style.padding = '12px';
      warn.style.color = '#b33';
      warn.textContent = 'Could not load nearby concerts: ' + errMsg + ' (showing saved concerts)';
      concertsModal.list.appendChild(warn);
      // Add manual retry controls
      const controls = document.createElement('div');
      controls.style.margin = '8px 0 12px 0';

      const manualBtn = document.createElement('button');
      manualBtn.textContent = 'Enter coords manually';
      manualBtn.style.marginRight = '8px';
      manualBtn.className = 'btn';
      manualBtn.addEventListener('click', async () => {
        const val = prompt('Enter latitude,longitude (e.g. 40.7128,-74.0060)');
        if (!val) return;
        const parts = val.split(',').map(s => s.trim());
        if (parts.length < 2) return alert('Invalid input');
        const lat = parseFloat(parts[0]);
        const lng = parseFloat(parts[1]);
        concertsModal.list.innerHTML = "<div style='padding:12px;color:#666;'>Loading nearby concerts...</div>";
        const res = await fetchNearbyConcerts(lat, lng, 50);
        concertsModal.list.innerHTML = '';
        if (res && res.error) {
          const e = document.createElement('div'); e.style.color='#b33'; e.textContent = 'Error: ' + (res.error || JSON.stringify(res)); concertsModal.list.appendChild(e);
          return;
        }
        const evs = (res && res.events) ? res.events : [];
        if (evs.length === 0) {
          const e = document.createElement('div'); e.style.color='#666'; e.textContent = 'No events found for provided coordinates.'; concertsModal.list.appendChild(e);
          return;
        }
        evs.forEach((concert) => {
          const item = document.createElement("div");
          item.className = "concert-item";
          const img = (concert.images && concert.images[0] && concert.images[0].url) ? concert.images[0].url : './images/disfigure.jpg';
          const venue = concert.venue || '';
          const city = concert.city || '';
          const date = concert.date || '';
          const time = concert.time || '';
          const distLabel = concert.distance_miles ? ` — ${concert.distance_miles} mi` : '';
          const coordsLabel = concert.venue_location ? ` (${concert.venue_location.latitude.toFixed(4)}, ${concert.venue_location.longitude.toFixed(4)})` : '';
          item.innerHTML = `<img src='${img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
            <span style='font-weight:600;'>${concert.name}</span> <span style='color:#888;'>@ ${venue}${distLabel}</span><br>
            <span style='color:#666;font-size:12px;'>${city}${coordsLabel}</span><br>
            <span style='color:#555;'>${date} ${time}</span> <a href='${concert.url}' target='_blank' style='margin-left:8px;'>Tickets</a>`;
          concertsModal.list.appendChild(item);
        });
      });

      const tryNYC = document.createElement('button');
      tryNYC.textContent = 'Show NYC events';
      tryNYC.className = 'btn';
      tryNYC.addEventListener('click', async () => {
        concertsModal.list.innerHTML = "<div style='padding:12px;color:#666;'>Loading NYC concerts...</div>";
        const res = await fetchNearbyConcerts(40.7128, -74.0060, 50);
        concertsModal.list.innerHTML = '';
        if (res && res.error) {
          const e = document.createElement('div'); e.style.color='#b33'; e.textContent = 'Error: ' + (res.error || JSON.stringify(res)); concertsModal.list.appendChild(e); return;
        }
        const evs = (res && res.events) ? res.events : [];
        if (evs.length === 0) { const e = document.createElement('div'); e.style.color='#666'; e.textContent = 'No events found for NYC.'; concertsModal.list.appendChild(e); return; }
        evs.forEach((concert) => {
          const item = document.createElement("div");
          item.className = "concert-item";
          const img = (concert.images && concert.images[0] && concert.images[0].url) ? concert.images[0].url : './images/disfigure.jpg';
          const venue = concert.venue || '';
          const city = concert.city || '';
          const date = concert.date || '';
          const time = concert.time || '';
          const distLabel2 = concert.distance_miles ? ` — ${concert.distance_miles} mi` : '';
          const coordsLabel2 = concert.venue_location ? ` (${concert.venue_location.latitude.toFixed(4)}, ${concert.venue_location.longitude.toFixed(4)})` : '';
          item.innerHTML = `<img src='${img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
            <span style='font-weight:600;'>${concert.name}</span> <span style='color:#888;'>@ ${venue}${distLabel2}</span><br>
            <span style='color:#666;font-size:12px;'>${city}${coordsLabel2}</span><br>
            <span style='color:#555;'>${date} ${time}</span> <a href='${concert.url}' target='_blank' style='margin-left:8px;'>Tickets</a>`;
          concertsModal.list.appendChild(item);
        });
      });

      const tryDehradun = document.createElement('button');
      tryDehradun.textContent = 'Show Dehradun events';
      tryDehradun.className = 'btn';
      tryDehradun.style.marginLeft = '8px';
      tryDehradun.addEventListener('click', async () => {
        // Dehradun coords: 30.3165, 77.9970
        concertsModal.list.innerHTML = "<div style='padding:12px;color:#666;'>Loading Dehradun concerts...</div>";
        // pass country=IN to prefer India results
        const res = await fetchNearbyConcerts(30.3165, 77.9970, 100, 'IN');
        concertsModal.list.innerHTML = '';
        if (res && res.error) { const e = document.createElement('div'); e.style.color='#b33'; e.textContent = 'Error: ' + (res.error || JSON.stringify(res)); concertsModal.list.appendChild(e); return; }
        const evs = (res && res.events) ? res.events : [];
        if (evs.length === 0) { const e = document.createElement('div'); e.style.color='#666'; e.textContent = 'No events found for Dehradun.'; concertsModal.list.appendChild(e); return; }
        evs.forEach((concert) => {
          const item = document.createElement("div");
          item.className = "concert-item";
          const img = (concert.images && concert.images[0] && concert.images[0].url) ? concert.images[0].url : './images/disfigure.jpg';
          const venue = concert.venue || '';
          const city = concert.city || '';
          const date = concert.date || '';
          const time = concert.time || '';
          const distLabel = concert.distance_miles ? ` — ${concert.distance_miles} mi` : '';
          const coordsLabel = concert.venue_location ? ` (${concert.venue_location.latitude.toFixed(4)}, ${concert.venue_location.longitude.toFixed(4)})` : '';
          item.innerHTML = `<img src='${img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
            <span style='font-weight:600;'>${concert.name}</span> <span style='color:#888;'>@ ${venue}${distLabel}</span><br>
            <span style='color:#666;font-size:12px;'>${city}${coordsLabel}</span><br>
            <span style='color:#555;'>${date} ${time}</span> <a href='${concert.url}' target='_blank' style='margin-left:8px;'>Tickets</a>`;
          concertsModal.list.appendChild(item);
        });
      });

      controls.appendChild(tryDehradun);

      controls.appendChild(manualBtn);
      controls.appendChild(tryNYC);
      concertsModal.list.appendChild(controls);
      // fall back to static
      CONCERTS.forEach((concert) => {
        const item = document.createElement("div");
        item.className = "concert-item";
        item.innerHTML = `<img src='${concert.img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
          <span style='font-weight:600;'>${concert.artist}</span> <span style='color:#888;'>@ ${concert.venue}, ${concert.city}</span><br>
          <span style='color:#555;'>${concert.date} ${concert.time} | ${concert.price}</span>`;
        concertsModal.list.appendChild(item);
      });
      return;
    }

    const events = eventsResult && eventsResult.events ? eventsResult.events : [];
    if (events && events.length > 0) {
      events.forEach((concert) => {
        const item = document.createElement("div");
        item.className = "concert-item";
        const img = (concert.images && concert.images[0] && concert.images[0].url) ? concert.images[0].url : './images/disfigure.jpg';
        const venue = concert.venue || '';
        const city = concert.city || '';
        const date = concert.date || '';
        const time = concert.time || '';
        const distLabel3 = concert.distance_miles ? ` — ${concert.distance_miles} mi` : '';
        const coordsLabel3 = concert.venue_location ? ` (${concert.venue_location.latitude.toFixed(4)}, ${concert.venue_location.longitude.toFixed(4)})` : '';
        item.innerHTML = `<img src='${img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
          <span style='font-weight:600;'>${concert.name}</span> <span style='color:#888;'>@ ${venue}${distLabel3}</span><br>
          <span style='color:#666;font-size:12px;'>${city}${coordsLabel3}</span><br>
          <span style='color:#555;'>${date} ${time}</span> <a href='${concert.url}' target='_blank' style='margin-left:8px;'>Tickets</a>`;
        concertsModal.list.appendChild(item);
      });
    } else {
      // No events found. If user's coords are in India, suggest major-city fallbacks (Dehradun may have no TM events).
      const msg = document.createElement('div');
      msg.style.padding = '12px';
      msg.style.color = '#666';
      msg.textContent = 'No events found for your location.';
      concertsModal.list.appendChild(msg);

      // Helper to create city button
      function addCityButton(label, lat, lng, radius = 100) {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.style.marginRight = '8px';
        btn.textContent = label;
        btn.addEventListener('click', async () => {
          concertsModal.list.innerHTML = `<div style='padding:12px;color:#666;'>Loading ${label} concerts...</div>`;
          const res = await fetchNearbyConcerts(lat, lng, radius, 'IN');
          concertsModal.list.innerHTML = '';
          if (res && res.error) {
            const e = document.createElement('div'); e.style.color='#b33'; e.textContent = 'Error: ' + (res.error || JSON.stringify(res)); concertsModal.list.appendChild(e); return;
          }
          const evs = (res && res.events) ? res.events : [];
          if (evs.length === 0) { const e = document.createElement('div'); e.style.color='#666'; e.textContent = `No events found for ${label}.`; concertsModal.list.appendChild(e); return; }
          evs.forEach((concert) => {
            const item = document.createElement('div');
            item.className = 'concert-item';
            const img = (concert.images && concert.images[0] && concert.images[0].url) ? concert.images[0].url : './images/disfigure.jpg';
            const venue = concert.venue || '';
            const city = concert.city || '';
            const date = concert.date || '';
            const time = concert.time || '';
            const distLabel = concert.distance_miles ? ` — ${concert.distance_miles} mi` : '';
            const coordsLabel = concert.venue_location ? ` (${concert.venue_location.latitude.toFixed(4)}, ${concert.venue_location.longitude.toFixed(4)})` : '';
            item.innerHTML = `<img src='${img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
              <span style='font-weight:600;'>${concert.name}</span> <span style='color:#888;'>@ ${venue}${distLabel}</span><br>
              <span style='color:#666;font-size:12px;'>${city}${coordsLabel}</span><br>
              <span style='color:#555;'>${date} ${time}</span> <a href='${concert.url}' target='_blank' style='margin-left:8px;'>Tickets</a>`;
            concertsModal.list.appendChild(item);
          });
        });
        concertsModal.list.appendChild(btn);
      }

      // Suggest major Indian cities as fallbacks
      addCityButton('Show New Delhi', 28.6139, 77.2090, 100);
      addCityButton('Show Mumbai', 19.0760, 72.8777, 100);
      addCityButton('Show Bengaluru', 12.9716, 77.5946, 100);
    }
    } finally {
      concertsLoading = false;
    }
  });
}

if (concertsModal.closeBtn) {
  concertsModal.closeBtn.addEventListener("click", () => {
    concertsModal.modal.classList.remove("active");
  });
}

// Profile menu toggle (dashboard)
if (userMenus.dashboard.btn) {
  userMenus.dashboard.btn.addEventListener("click", () => {
    userMenus.dashboard.menu.classList.toggle("open");
    userMenus.playlist.menu.classList.remove("open");
  });
}

// Profile menu toggle (playlist)
if (userMenus.playlist.btn) {
  userMenus.playlist.btn.addEventListener("click", () => {
    userMenus.playlist.menu.classList.toggle("open");
    userMenus.dashboard.menu.classList.remove("open");
  });
}

// Logout handlers for both menus
async function performLogout() {
  try {
    const res = await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
    if (res.ok) {
      // Reset UI state and show login screen
      state.isLoggedIn = false;
      // Optionally reload to clear session state
      window.location.reload();
    } else {
      const body = await res.json().catch(() => null);
      alert('Logout failed: ' + (body && body.error ? body.error : res.statusText));
    }
  } catch (e) {
    console.warn('Logout error', e);
    alert('Logout failed. See console for details.');
  }
}


if (userMenus.dashboard.logoutBtn) {
  userMenus.dashboard.logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    userMenus.dashboard.menu.classList.remove('open');
    await performLogout();
  });
}

if (userMenus.playlist.logoutBtn) {
  userMenus.playlist.logoutBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    userMenus.playlist.menu.classList.remove('open');
    await performLogout();
  });
}

// Player controls - Dashboard
if (playerEl.playBtn) {
  playerEl.playBtn.addEventListener("click", () => {
    if (!playerEl.audio.src) {
      // If no song loaded, play first song
      if (SONGS.length > 0) playSong(SONGS[0].id);
      return;
    }
    if (playerEl.audio.paused) {
      playerEl.audio.play().then(() => {
        state.isPlaying = true;
        updatePlayButton();
      });
    } else {
      playerEl.audio.pause();
      state.isPlaying = false;
      updatePlayButton();
    }
  });
}

if (playerEl.nextBtn) {
  playerEl.nextBtn.addEventListener("click", () => {
    const nextId = getNextSong();
    if (nextId) playSong(nextId);
  });
}

if (playerEl.prevBtn) {
  playerEl.prevBtn.addEventListener("click", () => {
    if (playerEl.audio.currentTime > 3) {
      // If more than 3 seconds into song, restart it
      playerEl.audio.currentTime = 0;
    } else {
      // Otherwise go to previous song
      const prevId = getPrevSong();
      if (prevId) playSong(prevId);
    }
  });
}

if (playerEl.shuffleBtn) {
  playerEl.shuffleBtn.addEventListener("click", () => {
    state.isShuffle = !state.isShuffle;
    playerEl.shuffleBtn.classList.toggle("active", state.isShuffle);
    if (playerPl.shuffleBtn)
      playerPl.shuffleBtn.classList.toggle("active", state.isShuffle);
  });
}

if (playerEl.repeatBtn) {
  playerEl.repeatBtn.addEventListener("click", () => {
    state.isRepeat = !state.isRepeat;
    playerEl.repeatBtn.classList.toggle("active", state.isRepeat);
    if (playerPl.repeatBtn)
      playerPl.repeatBtn.classList.toggle("active", state.isRepeat);
  });
}

// -----------------------------------------------
//   LYRICA — Hybrid Search (Local + YouTube)
//   FINAL WORKING VERSION FOR app.js
// -----------------------------------------------

window.songSearch = window.songSearch || {};

(function () {

  const module = {
    _tracksCache: null,
    ytCache: {},        // NEW: YouTube caching
    inputEl: null,
    suggestionsEl: null,
    gridEl: null,

    // ---------------------------------------
    // INIT
    // ---------------------------------------
    init() {
      this.inputEl =
        document.getElementById("search-input") ||
        document.querySelector(".search-bar") ||
        document.querySelector("input[type='search']");

      this.suggestionsEl =
        document.getElementById("results-container") ||
        document.querySelector(".search-suggestions");

      this.gridEl =
        document.getElementById("trending-grid") ||
        document.querySelector(".trending-grid");

      if (!this.inputEl) return console.error("[songSearch] Search input not found!");

      if (!this.suggestionsEl) {
        const div = document.createElement("div");
        div.id = "results-container";
        div.className = "search-suggestions";
        div.style.position = "absolute";
        div.style.zIndex = "2000";
        this.inputEl.insertAdjacentElement("afterend", div);
        this.suggestionsEl = div;
      }

      if (!Array.isArray(window.SONGS)) window.SONGS = [];

      this.inputEl.addEventListener("input", this._debounce(this._handleInput.bind(this), 200));
      this.inputEl.addEventListener("keydown", this._handleKeyDown.bind(this));

      document.addEventListener("click", (e) => {
        if (!this.suggestionsEl.contains(e.target) && e.target !== this.inputEl) {
          this.hideSuggestions();
        }
      });

      console.log("[songSearch] Initialized");
    },

    // ---------------------------------------
    _debounce(fn, time) {
      let t;
      return (...a) => {
        clearTimeout(t);
        t = setTimeout(() => fn(...a), time);
      };
    },

    // ---------------------------------------
    async _fetchAllTracks() {
      if (this._tracksCache) return this._tracksCache;

      try {
        const res = await fetch("/api/music/tracks", { credentials: "include" });
        const data = await res.json();
        const arr = Array.isArray(data) ? data : data.tracks || [];

        arr.forEach(t => {
          if (!SONGS.some(s => s.id === t.id)) {
            SONGS.push({
              id: t.id,
              title: t.title || "",
              artist: t.artist || "",
              album: t.album || "",
              cover: t.cover || "./images/vinyl.png",
              file: t.file || null
            });
          }
        });

        this._tracksCache = SONGS.slice();
        return this._tracksCache;

      } catch (e) {
        console.error("Failed to fetch tracks:", e);
        return SONGS.slice();
      }
    },

    // ---------------------------------------
    hideSuggestions() {
      this.suggestionsEl.innerHTML = "";
      this.suggestionsEl.style.display = "none";
    },

    showSuggestions(list) {
      if (!list || list.length === 0) {
        this.hideSuggestions();
        return;
      }

      this.suggestionsEl.style.display = "block";
      this.suggestionsEl.innerHTML = "";

      list.forEach(song => {
        const btn = document.createElement("button");
        btn.className = "suggestion-item";
        btn.style.display = "flex";
        btn.style.alignItems = "center";
        btn.style.width = "100%";
        btn.style.padding = "10px";
        btn.style.border = "none";
        btn.style.background = "transparent";

        btn.innerHTML = `
          <img src="${song.cover}" style="width:56px;height:56px;border-radius:8px;">
          <div style="margin-left:12px;">
            <div class="s-title">${song.title}</div>
            <div class="s-sub">${song.artist}</div>
          </div>
        `;

        btn.onclick = () => {
          this.inputEl.value = song.title;
          this.hideSuggestions();
          this.performFullSearch(song.title);

          if (song.id.startsWith("yt_")) playYouTube(song.videoId);
        };

        this.suggestionsEl.appendChild(btn);
      });
    },

    // ---------------------------------------
    async _handleInput() {
      const q = this.inputEl.value.trim().toLowerCase();
      if (q.length < 2) return this.hideSuggestions();

      let tracks = await this._fetchAllTracks();

      let suggestions = tracks.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
      );

      // YOUTUBE FALLBACK
      if (suggestions.length === 0) {
        console.log("[YT] Fetching fallback suggestions…");

        if (this.ytCache[q]) {
          suggestions = this.ytCache[q];
        } else {
          const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const yt = await r.json();

          suggestions = yt.map(v => ({
            id: "yt_" + v.videoId,
            title: v.title,
            artist: v.artist,
            cover: v.thumbnail,
            videoId: v.videoId
          }));

          this.ytCache[q] = suggestions;
        }
      }

      this.showSuggestions(suggestions);
    },

    // ---------------------------------------
    async performFullSearch(query) {
      const q = query.toLowerCase().trim();
      if (!q) return;

      let tracks = await this._fetchAllTracks();

      let results = tracks.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.artist.toLowerCase().includes(q)
      );

      // YOUTUBE FALLBACK
      if (results.length === 0) {
        console.log("[YT] Fetching full results…");

        if (this.ytCache[q]) {
          results = this.ytCache[q];
        } else {
          const r = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          const yt = await r.json();

          results = yt.map(v => ({
            id: "yt_" + v.videoId,
            title: v.title,
            artist: v.artist,
            album: "YouTube",
            cover: v.thumbnail,
            file: null,
            videoId: v.videoId
          }));

          this.ytCache[q] = results;
        }
      }

      this.renderSearchTiles(results);
    },

    // ---------------------------------------
    renderSearchTiles(results) {
      if (!this.gridEl) return;
      this.gridEl.innerHTML = "";

      results.forEach(song => {
        const card = document.createElement("button");
        card.className = "album-card search-tile";
        card.innerHTML = `
          <img src="${song.cover}" class="album-cover">
          <div class="play-overlay">▶</div>
          <div class="album-title">${song.title}</div>
          <div class="album-artist">${song.artist}</div>
        `;

        card.onclick = () => {
          if (song.id.startsWith("yt_")) playYouTube(song.videoId);
          else playSong(song.id);
        };

        this.gridEl.appendChild(card);
      });
    },

    // ---------------------------------------
    _handleKeyDown(e) {
      if (e.key === "Enter") {
        this.performFullSearch(this.inputEl.value);
      }
    }
  };

  window.songSearch.init = module.init.bind(module);
  window.songSearch.performFullSearch = module.performFullSearch.bind(module);

  document.addEventListener("DOMContentLoaded", () => {
    try { window.songSearch.init(); } catch (e) {}
  });

})();


// --- 7. START THE APP ---
// This part remains the same.
document.addEventListener("DOMContentLoaded", () => {
  songSearch.init();
});

// --- 6. START THE APP ---
// When the page content is fully loaded, initialize the search functionality.
document.addEventListener("DOMContentLoaded", () => {
  songSearch.init();
});
// Player controls - Playlist page (sync with dashboard)
if (playerPl.playBtn) {
  playerPl.playBtn.addEventListener("click", () => {
    if (!playerEl.audio.src) {
      if (SONGS.length > 0) playSong(SONGS[0].id);
      return;
    }
    if (playerEl.audio.paused) {
      playerEl.audio.play().then(() => {
        state.isPlaying = true;
        updatePlayButton();
      });
    } else {
      playerEl.audio.pause();
      state.isPlaying = false;
      updatePlayButton();
    }
  });
}

if (playerPl.nextBtn) {
  playerPl.nextBtn.addEventListener("click", () => {
    const nextId = getNextSong();
    if (nextId) playSong(nextId);
  });
}

if (playerPl.prevBtn) {
  playerPl.prevBtn.addEventListener("click", () => {
    if (playerEl.audio.currentTime > 3) {
      playerEl.audio.currentTime = 0;
    } else {
      const prevId = getPrevSong();
      if (prevId) playSong(prevId);
    }
  });
}

if (playerPl.shuffleBtn) {
  playerPl.shuffleBtn.addEventListener("click", () => {
    state.isShuffle = !state.isShuffle;
    playerEl.shuffleBtn?.classList.toggle("active", state.isShuffle);
    playerPl.shuffleBtn.classList.toggle("active", state.isShuffle);
  });
}

if (playerPl.repeatBtn) {
  playerPl.repeatBtn.addEventListener("click", () => {
    state.isRepeat = !state.isRepeat;
    playerEl.repeatBtn?.classList.toggle("active", state.isRepeat);
    playerPl.repeatBtn.classList.toggle("active", state.isRepeat);
  });
}

// Initialize heart buttons and add to player controls
function initHeartButtons() {
  // Create heart button for dashboard player
  if (playerEl.shuffleBtn && !playerEl.heartBtn) {
    const heartBtn = document.createElement("button");
    heartBtn.className = "btn-control btn-heart";
    heartBtn.title = "Add to playlist";
    heartBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    heartBtn.style.marginRight = "8px";
    playerEl.shuffleBtn.parentNode.insertBefore(heartBtn, playerEl.shuffleBtn);
    playerEl.heartBtn = heartBtn;
    heartBtn.addEventListener("click", () => showHeartPopup(heartBtn));
  }

  // Create heart button for playlist page player
  if (playerPl.shuffleBtn && !playerPl.heartBtn) {
    const heartBtn = document.createElement("button");
    heartBtn.className = "btn-control btn-heart";
    heartBtn.title = "Add to playlist";
    heartBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
    heartBtn.style.marginRight = "8px";
    playerPl.shuffleBtn.parentNode.insertBefore(heartBtn, playerPl.shuffleBtn);
    playerPl.heartBtn = heartBtn;
    heartBtn.addEventListener("click", () => showHeartPopup(heartBtn));
  }

  updateHeartButton();
}

// Heart button popup
let heartPopup = null;
function showHeartPopup(button) {
  if (!state.currentSongId) {
    alert("No song is currently playing");
    return;
  }

  // Remove existing popup
  if (heartPopup) {
    heartPopup.remove();
  }

  const isLiked = state.liked.has(state.currentSongId);
  const song = getSongById(state.currentSongId);

  // Create popup
  heartPopup = document.createElement("div");
  heartPopup.className = "heart-popup";
  heartPopup.style.cssText = `
    position: fixed;
    background: white;
    border-radius: 12px;
    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
    padding: 16px;
    z-index: 10000;
    min-width: 250px;
    max-width: 300px;
  `;

  const rect = button.getBoundingClientRect();
  // Position popup above the button instead of below
  heartPopup.style.left = `${rect.left}px`;
  heartPopup.style.top = `${rect.top - 8}px`;
  heartPopup.style.transform = "translateY(-100%)";

  let html = `<div style="font-weight:600;margin-bottom:12px;font-size:14px;">Add "${song.title}" to:</div>`;

  // Liked Songs option
  html += `<button class="heart-popup-item" data-action="liked" style="width:100%;padding:10px;text-align:left;background:none;border:none;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="${
      isLiked ? "#e74c3c" : "none"
    }" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <span>${isLiked ? "Remove from" : "Add to"} Liked Songs</span>
  </button>`;

  // Playlist options
  PLAYLISTS.forEach((pl) => {
    const inPlaylist = pl.songs.includes(state.currentSongId);
    html += `<button class="heart-popup-item" data-action="playlist" data-playlist-id="${
      pl.id
    }" style="width:100%;padding:10px;text-align:left;background:none;border:none;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;margin-top:4px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${
        inPlaylist ? "#4a90e2" : "none"
      }" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6v6H9z"/>
      </svg>
      <span>${inPlaylist ? "Remove from" : "Add to"} ${pl.name}</span>
    </button>`;
  });

  // Create new playlist option
  html += `<div style="margin-top:12px;padding-top:12px;border-top:1px solid #eee;">
    <input type="text" id="new-playlist-name-heart" placeholder="Create new playlist" style="width:100%;padding:8px;border:1px solid #ddd;border-radius:6px;margin-bottom:8px;font-size:14px;">
    <button id="create-playlist-heart" style="width:100%;padding:8px;background:#4a90e2;color:white;border:none;border-radius:6px;cursor:pointer;font-size:14px;">Create & Add</button>
  </div>`;

  heartPopup.innerHTML = html;
  document.body.appendChild(heartPopup);

  // Event handlers
  heartPopup.querySelectorAll(".heart-popup-item").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const action = btn.dataset.action;
      try {
        if (action === "liked") {
          if (isLiked) {
            await updateLikedSong(state.currentSongId, 'remove');
          } else {
            await updateLikedSong(state.currentSongId, 'add');
          }
        } else if (action === "playlist") {
          const plId = btn.dataset.playlistId;
          // Persist add/remove via API and refresh playlists
          const pl = getPlaylistById(plId);
          if (pl) {
            const inPlaylist = pl.songs.includes(state.currentSongId);
            if (inPlaylist) {
              await updatePlaylistSong(plId, state.currentSongId, 'remove');
            } else {
              await updatePlaylistSong(plId, state.currentSongId, 'add');
            }
          }
        }
      } catch (e) {
        console.warn('Heart popup action failed:', e);
      }
      if (heartPopup) {
        heartPopup.remove();
        heartPopup = null;
      }
    });
  });

  const createBtn = heartPopup.querySelector("#create-playlist-heart");
  const nameInput = heartPopup.querySelector("#new-playlist-name-heart");
  if (createBtn && nameInput) {
    createBtn.addEventListener("click", async () => {
      const name = nameInput.value.trim();
      if (!name) return;
      try {
        const res = await fetch('/api/playlists/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name })
        });
        if (res.ok) {
          const data = await res.json();
          const newId = data.playlist && data.playlist.id;
          if (newId) {
            // Add the current song to the newly created playlist
            await updatePlaylistSong(newId, state.currentSongId, 'add');
            await fetchUserPlaylists();
          }
        } else {
          console.warn('Failed to create playlist', await res.text());
        }
      } catch (e) {
        console.warn('Create playlist failed:', e);
      }
      if (heartPopup) {
        heartPopup.remove();
        heartPopup = null;
      }
    });
  }

  // Close on outside click
  setTimeout(() => {
    document.addEventListener("click", function closePopup(e) {
      if (!heartPopup?.contains(e.target) && e.target !== button) {
        heartPopup?.remove();
        heartPopup = null;
        document.removeEventListener("click", closePopup);
      }
    });
  }, 0);
}

// Fix sidebar on playlist page
if (playlistEl.menuBtn) {
  playlistEl.menuBtn.addEventListener("click", () => {
    playlistEl.sidebar?.classList.toggle("open");
  });
}

if (playlistEl.closeSidebarBtn) {
  playlistEl.closeSidebarBtn.addEventListener("click", () => {
    playlistEl.sidebar?.classList.remove("open");
  });
}

// Navigation items on playlist page sidebar
const btnLikedPl = document.getElementById("btn-liked-pl");
const btnHomePl = document.getElementById("btn-home-pl");
const btnLibraryPl = document.getElementById("btn-library-pl");

if (btnLikedPl) {
  btnLikedPl.addEventListener("click", () => {
    // Directly open liked songs playlist view
    state.currentPlaylist = "liked";
    renderPlaylist("liked");
    renderPlaylistsSidebar();
    playlistEl.sidebar?.classList.remove("open");
  });
}

if (btnHomePl) {
  btnHomePl.addEventListener("click", () => {
    if (!state.isLoggedIn) {
      showScreen("login");
      return;
    }
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
    playlistEl.sidebar?.classList.remove("open");
  });
}

if (btnLibraryPl) {
  btnLibraryPl.addEventListener("click", () => {
    if (!state.isLoggedIn) {
      showScreen("login");
      return;
    }
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "none"));
    if (libraryContent) libraryContent.style.display = "block";
    if (likedContent) likedContent.style.display = "none";
    renderLibrary();
    playlistEl.sidebar?.classList.remove("open");
  });
}

// Fix edit button on playlist page
if (playlistEl.editBtn) {
  playlistEl.editBtn.addEventListener("click", () => {
    const playlist = getPlaylistById(state.currentPlaylist);
    if (playlist && !playlist.isSpecial) {
      const newName = prompt("Rename playlist:", playlist.name);
      if (newName && newName.trim()) {
        playlist.name = newName.trim();
        renderPlaylist();
        renderPlaylists();
      }
    }
  });
}

// Concerts button on playlist page
if (playlistEl.concertsBtn) {
  playlistEl.concertsBtn.addEventListener("click", () => {
    concertsModal.modal.classList.add("active");
    concertsModal.list.innerHTML = "";
    CONCERTS.forEach((concert) => {
      const item = document.createElement("div");
      item.className = "concert-item";
      item.innerHTML = `<img src='${concert.img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>${concert.artist}</span> <span style='color:#888;'>@ ${concert.venue}, ${concert.city}</span><br><span style='color:#555;'>${concert.date} ${concert.time} | ${concert.price}</span>`;
      concertsModal.list.appendChild(item);
    });
  });
}

function getSongById(id) {
  return SONGS.find((s) => s.id === id);
}

function getPlaylistById(id) {
  if (id === "liked") {
    return getLikedSongsPlaylist();
  }
  return PLAYLISTS.find((p) => p.id === id);
}

function getSongsInPlaylist(playlistId) {
  const pl = getPlaylistById(playlistId);
  return pl ? pl.songs.map((id) => getSongById(id)).filter(Boolean) : [];
}

function getAllPlaylists() {
  const liked = getLikedSongsPlaylist();
  return [liked, ...PLAYLISTS];
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

// ========== LOGIN ==========
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in)$/.test(email);
  if (!email || !password || !emailValid) {
    alert("Please enter a valid email and password.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = state.isSignUp ? "Creating..." : "Signing in...";
  try {
    if (state.isSignUp) {
      // Registration
      const username = document.getElementById("input-username")?.value?.trim() || email.split('@')[0];
      const first_name = document.getElementById("input-first-name")?.value?.trim() || "";
      const last_name = document.getElementById("input-last-name")?.value?.trim() || "";
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ username, email, password, first_name, last_name }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Clear demo playlists for new user, keep local songs
        PLAYLISTS.length = 0;
        state.recentlyPlayed = [];
        await fetchLikedSongs();
        await fetchUserPlaylists();
        alert("Registration successful! Please sign in.");
        setAuthMode(false);
      } else {
        alert((data && (data.error || data.message)) || "Registration failed.");
      }
    } else {
      // Login
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Clear demo playlists for logged-in user, keep local songs
        PLAYLISTS.length = 0;
        state.recentlyPlayed = [];
        await fetchLikedSongs();
        await fetchUserPlaylists();
        state.isLoggedIn = true;
        showScreen("dashboard");
        renderDashboard();
      } else {
        state.isLoggedIn = false;
        alert((data && (data.error || data.message)) || "Invalid credentials.");
        // Optionally, reset form or stay on login
        // showScreen("login");
      }
    }
  } catch (err) {
    alert("Network error. Please try again.");
  }
  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";
});

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach((pl) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "playlist-item-container";

    const btn = document.createElement("button");
    btn.className = "playlist-item";
    btn.textContent = pl.name;
    btn.addEventListener("click", () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist();
    });

    const moreBtn = document.createElement("button");
    moreBtn.className = "btn-playlist-more";
    moreBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlaylistContextMenu(pl.id, e.currentTarget);
    });

    itemContainer.appendChild(btn);
    itemContainer.appendChild(moreBtn);
    dashboardEl.playlistsList.appendChild(itemContainer);
  });
}

function renderTrending() {
  dashboardEl.trendingGrid.innerHTML = "";
  // In the active design, "Popular artists" uses artists-row, but let's map trending to it for now
  // Using the new 'artist-circle-wrap' structure
  SONGS.slice(0, 6).forEach((song) => {
    const tile = document.createElement("div");
    tile.className = "artist-circle-wrap";
    tile.innerHTML = `
      <div class="artist-circle">
        <img src="${song.cover}" alt="${song.title}" />
      </div>
      <span>${song.artist || song.title}</span>
    `;
    tile.addEventListener("click", () => playSong(song.id));
    dashboardEl.trendingGrid.appendChild(tile);
  });
}

function renderRecentlyPlayed() {
  dashboardEl.recentlyPlayed.innerHTML = "";
  
  // If no recently played items exist yet, populate with some mock data from SONGS for visual testing
  let displayItems = state.recentlyPlayed.length > 0 ? state.recentlyPlayed : SONGS.slice(0,3).map(s=>s.id);

  displayItems.forEach((id) => {
    const song = getSongById(id);
    if (!song) return;
    const item = document.createElement("div");
    item.className = "recent-track";
    item.innerHTML = `
      <img class="rt-img" src="${song.cover}" alt="${song.title}">
      <div class="rt-info">
        <div class="rt-title">${song.title}</div>
        <div class="rt-artist">${song.artist || 'Unknown Artist'}</div>
      </div>
      <div class="rt-album">${song.album || 'Single'}</div>
      <div class="rt-duration">${song.duration || '3:00'}</div>
      <button class="rt-add" title="Play">+</button>
    `;
    item.addEventListener("click", () => playSong(song.id));
    dashboardEl.recentlyPlayed.appendChild(item);
  });
}

function renderLibrary() {
  const libraryList = document.getElementById("library-list");
  if (!libraryList) return;
  libraryList.innerHTML = "";
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach((pl) => {
    let cover = pl.cover || "./images/vinyl.png";
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find((s) => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement("button");
    card.className = "playlist-card";
    card.style =
      "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
    card.innerHTML = `
      <img src="${cover}" alt="${
      pl.name
    }" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${
        pl.name
      }</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${
      pl.songs.length !== 1 ? "s" : ""
    }</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector(".liked-content");
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked)
    .map((id) => getSongById(id))
    .filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector(".liked-songs-list");
  if (!likedList) {
    likedList = document.createElement("div");
    likedList.className = "liked-songs-list";
    likedContent.innerHTML = "";
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = "";

  if (likedSongs.length === 0) {
    likedList.innerHTML =
      '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement("button");
  playlistCard.className = "playlist-card";
  playlistCard.style =
    "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${
    likedSongs.length !== 1 ? "s" : ""
  }</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = "liked";
    showScreen("playlist");
    renderPlaylist("liked");
    renderPlaylists();
  };
  likedList.appendChild(playlistCard);
}

// Dashboard sidebar
dashboardEl.menuBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.toggle("open");
});

dashboardEl.closeSidebarBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.remove("open");
});

// User menu toggle for dashboard
userMenus.dashboard.btn.addEventListener("click", () => {
  userMenus.dashboard.menu.classList.toggle("open");
  userMenus.playlist.menu.classList.remove("open");
});

// User menu toggle for playlist
userMenus.playlist.btn.addEventListener("click", () => {
  userMenus.playlist.menu.classList.toggle("open");
  userMenus.dashboard.menu.classList.remove("open");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu-wrapper")) {
    userMenus.dashboard.menu.classList.remove("open");
    userMenus.playlist.menu.classList.remove("open");
  }
});

// Logout handlers
userMenus.dashboard.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.dashboard.menu.classList.remove("open");
  showScreen("login");
});

userMenus.playlist.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.playlist.menu.classList.remove("open");
  showScreen("login");
});

dashboardEl.navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (!state.isLoggedIn) {
      showScreen("login");
      return;
    }
    dashboardEl.navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    
    // Fallbacks for views not fully implemented yet
    if (["songs", "albums", "artists", "radio", "recently-played"].includes(item.dataset.view)) {
       showScreen("dashboard");
       homeSections.forEach((s) => (s.style.display = "block"));
       if (libraryContent) libraryContent.style.display = "none";
       if (likedContent) likedContent.style.display = "none";
       return;
    }

    if (item.dataset.view === "home") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "block"));
      if (libraryContent) libraryContent.style.display = "none";
      if (likedContent) likedContent.style.display = "none";
    } else if (item.dataset.view === "library") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "none"));
      if (libraryContent) libraryContent.style.display = "block";
      if (likedContent) likedContent.style.display = "none";
      renderLibrary();
    } else if (item.dataset.view === "liked") {
      // Directly open liked songs playlist view instead of showing tile
      state.currentPlaylist = "liked";
      showScreen("playlist");
      renderPlaylist("liked");
      renderPlaylists();
    }
  });
});

// Only declare homeNavBtn once at the top
const homeNavBtn = Array.from(dashboardEl.navItems).find(
  (i) => i.dataset.view === "home"
);
if (homeNavBtn) {
  homeNavBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = "inline-flex";
  dashboardEl.addPlaylistBtn.style.alignItems = "center";
  dashboardEl.addPlaylistBtn.style.justifyContent = "center";
  dashboardEl.addPlaylistBtn.style.width = "32px";
  dashboardEl.addPlaylistBtn.style.height = "32px";
  dashboardEl.addPlaylistBtn.style.borderRadius = "50%";
  dashboardEl.addPlaylistBtn.style.background = "#fff";
  dashboardEl.addPlaylistBtn.style.boxShadow = "0 2px 8px #0001";
  dashboardEl.addPlaylistBtn.style.border = "none";
  dashboardEl.addPlaylistBtn.style.cursor = "pointer";
  dashboardEl.addPlaylistBtn.addEventListener('click', async () => {
    const name = prompt('Create playlist:');
    if (!name) return;
    if (state.isLoggedIn) {
      try {
        const res = await fetch('/api/playlists/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ name })
        });
        if (res.ok) {
          await fetchUserPlaylists();
        } else {
          console.warn('Failed to create playlist', await res.text());
        }
      } catch (e) {
        console.warn('Create playlist error:', e);
      }
    } else {
      // Fallback: local-only playlist
      const newId = 'pl_' + Date.now();
      PLAYLISTS.push({ id: newId, name, songs: [] });
      renderPlaylists();
    }
  });
}

// Initialize heart buttons when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== PLAYLIST PAGE RENDERING ==========
function renderPlaylist(playlistId) {
  // Use provided ID or fallback to state
  const plId = playlistId || state.currentPlaylist;
  const playlist = getPlaylistById(plId);
  if (!playlist) {
    playlistEl.title.textContent = "Playlist not found";
    playlistEl.count.textContent = "";
    playlistEl.cover.src = "./images/vinyl.png";
    playlistEl.tbody.innerHTML = "";
    return;
  }
  playlistEl.title.textContent = playlist.name;
  playlistEl.count.textContent = `${playlist.songs.length} song${
    playlist.songs.length !== 1 ? "s" : ""
  }`;

  // Use cover from playlist or first song, else default
  let cover = playlist.cover || "./images/vinyl.png";
  if (!playlist.cover && playlist.songs.length > 0) {
    const firstSong = getSongById(playlist.songs[0]);
    if (firstSong && firstSong.cover) cover = firstSong.cover;
  }
  playlistEl.cover.src = cover;

  // Hide edit button for liked songs
  if (playlistEl.editBtn) {
    playlistEl.editBtn.style.display = playlist.isSpecial
      ? "none"
      : "inline-flex";
  }

  // Render songs table
  playlistEl.tbody.innerHTML = "";
  const songs = getSongsInPlaylist(plId);
  if (songs.length === 0) {
    playlistEl.tbody.innerHTML = `<tr><td colspan='5' style='color:#888;text-align:center;'>No songs in this playlist.</td></tr>`;
    return;
  }

  // Set queue for playback
  state.currentQueue = playlist.songs;

  songs.forEach((song, idx) => {
    const tr = document.createElement("tr");
    const isLiked = state.liked.has(song.id);
    tr.innerHTML = `
      <td>${idx + 1}</td>
      <td><img src='${
        song.cover
      }' alt='' style='width:40px;height:40px;border-radius:6px;vertical-align:middle;margin-right:8px;'>${
      song.title
    }</td>
      <td>${song.artist}</td>
      <td>${song.duration}</td>
      <td>
        <button class="btn-song-delete" data-song-id="${
          song.id
        }" style="background:none;border:none;cursor:pointer;color:#888;padding:4px 8px;" title="Remove from playlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </td>
    `;
    tr.addEventListener("click", (e) => {
      if (!e.target.closest(".btn-song-delete")) {
        playSong(song.id, playlist.songs);
      }
    });

    // Delete button handler
    const deleteBtn = tr.querySelector(".btn-song-delete");
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (playlist.id === "liked") {
          // persist removal to backend
          updateLikedSong(song.id, 'remove');
        } else {
          const index = playlist.songs.indexOf(song.id);
          if (index > -1) playlist.songs.splice(index, 1);
        }
        renderPlaylist(plId);
        renderPlaylists();
      });
    }

    playlistEl.tbody.appendChild(tr);
  });
}

// ========== LOGIN ==========
// ====== DOM References ======
const emailInput = document.getElementById("input-email");
const passwordInput = document.getElementById("input-password");
const form = document.getElementById("auth-form");
const emailPopup = document.getElementById("email-popup");
const passwordPopup = document.getElementById("password-popup");

// ====== Real-Time Email Validation ======
emailInput.addEventListener("input", () => {
  const email = emailInput.value.trim();
  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in)$/.test(email);
  document.getElementById("email-format").className = emailValid
    ? "valid"
    : "invalid";
});

// ====== Real-Time Password Validation ======
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  document.getElementById("rule-length").className =
    password.length >= 8 ? "valid" : "invalid";
  document.getElementById("rule-uppercase").className = /[A-Z]/.test(password)
    ? "valid"
    : "invalid";
  document.getElementById("rule-lowercase").className = /[a-z]/.test(password)
    ? "valid"
    : "invalid";
  document.getElementById("rule-number").className = /\d/.test(password)
    ? "valid"
    : "invalid";
  document.getElementById("rule-special").className = /[@$!%*?&]/.test(password)
    ? "valid"
    : "invalid";
});

// ====== Show/Hide Popups on Focus/Blur ======
emailInput.addEventListener("focus", () => {
  emailPopup.style.display = "block";
});
emailInput.addEventListener("blur", () => {
  setTimeout(() => {
    emailPopup.style.display = "none";
  }, 100);
});

passwordInput.addEventListener("focus", () => {
  passwordPopup.style.display = "block";
});
passwordInput.addEventListener("blur", () => {
  setTimeout(() => {
    passwordPopup.style.display = "none";
  }, 100);
});

// ====== Submit Handler ======
function updateSubmitState() {
  const email = emailInput.value.trim();
  const password = passwordInput.value;

  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in)$/.test(email);
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  submitBtn.disabled = !(emailValid && passwordValid);
}

// Attach real-time validation
emailInput.addEventListener("input", updateSubmitState);
passwordInput.addEventListener("input", updateSubmitState);
window.addEventListener("DOMContentLoaded", updateSubmitState);

// ====== Submit Handler ======
// ====== Toggle Sign In / Sign Up ======
loginEl.toggleBtn.addEventListener("click", () => {
  setAuthMode(!state.isSignUp);
});
// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach((pl) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "playlist-item-container";

    const btn = document.createElement("button");
    btn.className = "playlist-item";
    btn.textContent = pl.name;
    btn.addEventListener("click", () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist();
    });

    const moreBtn = document.createElement("button");
    moreBtn.className = "btn-playlist-more";
    moreBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlaylistContextMenu(pl.id, e.currentTarget);
    });

    itemContainer.appendChild(btn);
    itemContainer.appendChild(moreBtn);
    dashboardEl.playlistsList.appendChild(itemContainer);
  });
}

function renderTrending() {
  dashboardEl.trendingGrid.innerHTML = "";
  // Map some songs to represent popular artists, keeping them playable
  const popularArtists = [
    { name: "SZA", cover: "https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1", songId: 1 },
    { name: "Kendrick Lamar", cover: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1", songId: 2 },
    { name: "Charli xcx", cover: "https://i.scdn.co/image/ab67616d0000b273e0a1745db747442302bef28c", songId: 3 },
    { name: "Frank Ocean", cover: "https://i.scdn.co/image/ab67616d0000b273c5649add07ed3720be9d5526", songId: 4 },
    { name: "Adele", cover: "https://i.scdn.co/image/ab67616d0000b2738bf64fb0032dfbc2feea2355", songId: 5 }
  ];

  popularArtists.forEach((artist) => {
    // Check if the song exists so it's playable
    const actualSong = getSongById(artist.songId);
    if (!actualSong) return;

    const displaySong = { ...actualSong, title: artist.name + " Radio", artist: artist.name, cover: artist.cover };

    const tile = document.createElement("div");
    tile.className = "artist-circle-wrap";
    tile.style.cursor = "pointer";
    tile.innerHTML = `
      <div class="artist-circle" style="background-image: url('${artist.cover}'); background-size: cover; background-position: center;"></div>
      <div class="artist-name">${artist.name}</div>
    `;
    tile.addEventListener("click", () => playSong(displaySong.id, null, displaySong));
    dashboardEl.trendingGrid.appendChild(tile);
  });
}

function renderRecentlyPlayed() {
  dashboardEl.recentlyPlayed.innerHTML = "";
  
  // We'll map the first 3 actual songs to the "Recently Played" UI
  // This ensures they are playable while keeping the spirit of the design.
  const recentTracks = [
    { title: "Kill Bill", artist: "SZA", album: "SOS", duration: "2:33", cover: "https://i.scdn.co/image/ab67616d0000b27370dbc9f47669d120ad874ec1", songId: 1 },
    { title: "Alright", artist: "Kendrick Lamar", album: "To Pimp A Butterfly", duration: "3:39", cover: "https://i.scdn.co/image/ab67616d0000b273cdb645498cd3d8a2db4d05e1", songId: 2 },
    { title: "Garden (Say It Like That)", artist: "SZA", album: "Ctrl", duration: "3:28", cover: "https://i.scdn.co/image/ab67616d0000b273c7c25c34511da2ccfce41004", songId: 3 }
  ];

  recentTracks.forEach((track) => {
    // Check if the song exists in our local array to ensure it's playable
    const actualSong = getSongById(track.songId);
    if (!actualSong) return;
    
    // Merge display properties with actual playable entity
    const displaySong = { ...actualSong, title: track.title, artist: track.artist, album: track.album, duration: track.duration, cover: track.cover };

    const item = document.createElement("div");
    item.className = "recent-track";
    item.innerHTML = `
      <div class="rt-left">
        <img class="rt-cover" src="${displaySong.cover}" alt="${displaySong.title}">
        <div class="rt-info">
          <div class="title">${displaySong.title}</div>
          <div class="artist">${displaySong.artist}</div>
        </div>
      </div>
      <div class="rt-album">${displaySong.album}</div>
      <div class="rt-time">${displaySong.duration}</div>
      <button class="rt-add" data-song-id="${displaySong.id}">+</button>
    `;
    
    // Clicking anywhere on the item plays the song (except the + button)
    item.addEventListener("click", (e) => {
      // Find out if the user clicked the add button
      const isAddClick = e.target.closest('.rt-add');
      if (!isAddClick) {
        playSong(displaySong.id, null, displaySong);
      }
    });

    // Handle add to liked songs
    const addBtn = item.querySelector('.rt-add');
    if (addBtn) {
      if (state.liked.has(displaySong.id)) {
        addBtn.textContent = '♥';
        addBtn.style.color = 'var(--color-primary)';
      }
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (state.liked.has(displaySong.id)) {
          updateLikedSong(displaySong.id, 'remove');
          addBtn.textContent = '+';
          addBtn.style.color = '';
        } else {
          updateLikedSong(displaySong.id, 'add');
          addBtn.textContent = '♥';
          addBtn.style.color = 'var(--color-primary)';
        }
      });
    }

    dashboardEl.recentlyPlayed.appendChild(item);
  });
}

function renderLibrary() {
  const libraryList = document.getElementById("library-list");
  if (!libraryList) return;
  libraryList.innerHTML = "";
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach((pl) => {
    let cover = pl.cover || "./images/vinyl.png";
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find((s) => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement("button");
    card.className = "playlist-card";
    card.style =
      "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
    card.innerHTML = `
      <img src="${cover}" alt="${
      pl.name
    }" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${
        pl.name
      }</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${
      pl.songs.length !== 1 ? "s" : ""
    }</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector(".liked-content");
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked)
    .map((id) => getSongById(id))
    .filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector(".liked-songs-list");
  if (!likedList) {
    likedList = document.createElement("div");
    likedList.className = "liked-songs-list";
    likedContent.innerHTML = "";
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = "";

  if (likedSongs.length === 0) {
    likedList.innerHTML =
      '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement("button");
  playlistCard.className = "playlist-card";
  playlistCard.style =
    "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${
    likedSongs.length !== 1 ? "s" : ""
  }</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = "liked";
    showScreen("playlist");
    renderPlaylist("liked");
    renderPlaylists();
  };
  likedList.appendChild(playlistCard);
}

// Dashboard sidebar
dashboardEl.menuBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.toggle("open");
});

dashboardEl.closeSidebarBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.remove("open");
});

// User menu toggle for dashboard
userMenus.dashboard.btn.addEventListener("click", () => {
  userMenus.dashboard.menu.classList.toggle("open");
  userMenus.playlist.menu.classList.remove("open");
});

// User menu toggle for playlist
userMenus.playlist.btn.addEventListener("click", () => {
  userMenus.playlist.menu.classList.toggle("open");
  userMenus.dashboard.menu.classList.remove("open");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu-wrapper")) {
    userMenus.dashboard.menu.classList.remove("open");
    userMenus.playlist.menu.classList.remove("open");
  }
});

// Logout handlers
userMenus.dashboard.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.dashboard.menu.classList.remove("open");
  showScreen("login");
});

userMenus.playlist.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.playlist.menu.classList.remove("open");
  showScreen("login");
});

dashboardEl.navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    if (item.dataset.view === "home") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "block"));
      if (libraryContent) libraryContent.style.display = "none";
      if (likedContent) likedContent.style.display = "none";
    } else if (item.dataset.view === "library") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "none"));
      if (libraryContent) libraryContent.style.display = "block";
      if (likedContent) likedContent.style.display = "none";
      renderLibrary();
    } else if (item.dataset.view === "liked") {
      // Directly open liked songs playlist view instead of showing tile
      state.currentPlaylist = "liked";
      showScreen("playlist");
      renderPlaylist("liked");
      renderPlaylists();
    }
  });
});

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = "inline-flex";
  dashboardEl.addPlaylistBtn.style.alignItems = "center";
  dashboardEl.addPlaylistBtn.style.justifyContent = "center";
  dashboardEl.addPlaylistBtn.style.width = "32px";
  dashboardEl.addPlaylistBtn.style.height = "32px";
  dashboardEl.addPlaylistBtn.style.borderRadius = "50%";
  dashboardEl.addPlaylistBtn.style.background = "#fff";
  dashboardEl.addPlaylistBtn.style.boxShadow = "0 2px 8px #0001";
  dashboardEl.addPlaylistBtn.style.border = "none";
  dashboardEl.addPlaylistBtn.style.cursor = "pointer";
}

// Initialize heart buttons when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// (Removed duplicate login handler. Only one correct login logic is kept above.)

// End duplicate function overrides

function renderLikedContent() {
  const likedContent = document.querySelector(".liked-content");
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked)
    .map((id) => getSongById(id))
    .filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector(".liked-songs-list");
  if (!likedList) {
    likedList = document.createElement("div");
    likedList.className = "liked-songs-list";
    likedContent.innerHTML = "";
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = "";

  if (likedSongs.length === 0) {
    likedList.innerHTML =
      '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement("button");
  playlistCard.className = "playlist-card";
  playlistCard.style =
    "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${
    likedSongs.length !== 1 ? "s" : ""
  }</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = "liked";
    showScreen("playlist");
    renderPlaylist("liked");
    renderPlaylists();
  };
  likedList.appendChild(playlistCard);
}

// Dashboard sidebar
dashboardEl.menuBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.toggle("open");
});

dashboardEl.closeSidebarBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.remove("open");
});

// User menu toggle for dashboard
userMenus.dashboard.btn.addEventListener("click", () => {
  userMenus.dashboard.menu.classList.toggle("open");
  userMenus.playlist.menu.classList.remove("open");
});

// User menu toggle for playlist
userMenus.playlist.btn.addEventListener("click", () => {
  userMenus.playlist.menu.classList.toggle("open");
  userMenus.dashboard.menu.classList.remove("open");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu-wrapper")) {
    userMenus.dashboard.menu.classList.remove("open");
    userMenus.playlist.menu.classList.remove("open");
  }
});

// Logout handlers
userMenus.dashboard.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.dashboard.menu.classList.remove("open");
  showScreen("login");
});

userMenus.playlist.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.playlist.menu.classList.remove("open");
  showScreen("login");
});

dashboardEl.navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    if (item.dataset.view === "home") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "block"));
      if (libraryContent) libraryContent.style.display = "none";
      if (likedContent) likedContent.style.display = "none";
    } else if (item.dataset.view === "library") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "none"));
      if (libraryContent) libraryContent.style.display = "block";
      if (likedContent) likedContent.style.display = "none";
      renderLibrary();
    } else if (item.dataset.view === "liked") {
      // Directly open liked songs playlist view instead of showing tile
      state.currentPlaylist = "liked";
      showScreen("playlist");
      renderPlaylist("liked");
      renderPlaylists();
    }
  });
});

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = "inline-flex";
  dashboardEl.addPlaylistBtn.style.alignItems = "center";
  dashboardEl.addPlaylistBtn.style.justifyContent = "center";
  dashboardEl.addPlaylistBtn.style.width = "32px";
  dashboardEl.addPlaylistBtn.style.height = "32px";
  dashboardEl.addPlaylistBtn.style.borderRadius = "50%";
  dashboardEl.addPlaylistBtn.style.background = "#fff";
  dashboardEl.addPlaylistBtn.style.boxShadow = "0 2px 8px #0001";
  dashboardEl.addPlaylistBtn.style.border = "none";
  dashboardEl.addPlaylistBtn.style.cursor = "pointer";
}

// Initialize heart buttons when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach((pl) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "playlist-item-container";

    const btn = document.createElement("button");
    btn.className = "playlist-item";
    btn.textContent = pl.name;
    btn.addEventListener("click", () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist();
    });

    const moreBtn = document.createElement("button");
    moreBtn.className = "btn-playlist-more";
    moreBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlaylistContextMenu(pl.id, e.currentTarget);
    });

    itemContainer.appendChild(btn);
    itemContainer.appendChild(moreBtn);
    dashboardEl.playlistsList.appendChild(itemContainer);
  });
}

function renderTrending() {
  dashboardEl.trendingGrid.innerHTML = "";
  SONGS.slice(0, 6).forEach((song) => {
    const tile = document.createElement("div");
    tile.className = "trending-tile";
    tile.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="trending-tile-img">
      <div class="trending-tile-info">
        <div class="trending-tile-title">${song.title}</div>
        <div class="trending-tile-artist">${song.artist}</div>
      </div>
    `;
    tile.addEventListener("click", () => playSong(song.id));
    dashboardEl.trendingGrid.appendChild(tile);
  });
}

function renderRecentlyPlayed() {
  dashboardEl.recentlyPlayed.innerHTML = "";
  state.recentlyPlayed.forEach((id) => {
    const song = getSongById(id);
    if (!song) return;
    const item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="recent-item-img">
      <div class="recent-item-info">
        <div class="recent-item-title">${song.title}</div>
        <div class="recent-item-artist">${song.artist}</div>
      </div>
      <div style="text-align:right; font-size:12px; color: var(--color-text-muted);">${song.album}</div>
      <div style="text-align:right; font-size:12px; color: var(--color-text-muted);">${song.duration}</div>
    `;
    item.addEventListener("click", () => playSong(song.id));
    dashboardEl.recentlyPlayed.appendChild(item);
  });
}

function renderLibrary() {
  const libraryList = document.getElementById("library-list");
  if (!libraryList) return;
  libraryList.innerHTML = "";
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach((pl) => {
    let cover = pl.cover || "./images/vinyl.png";
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find((s) => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement("button");
    card.className = "playlist-card";
    card.style =
      "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
    card.innerHTML = `
      <img src="${cover}" alt="${
      pl.name
    }" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${
        pl.name
      }</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${
      pl.songs.length !== 1 ? "s" : ""
    }</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector(".liked-content");
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked)
    .map((id) => getSongById(id))
    .filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector(".liked-songs-list");
  if (!likedList) {
    likedList = document.createElement("div");
    likedList.className = "liked-songs-list";
    likedContent.innerHTML = "";
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = "";

  if (likedSongs.length === 0) {
    likedList.innerHTML =
      '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement("button");
  playlistCard.className = "playlist-card";
  playlistCard.style =
    "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${
    likedSongs.length !== 1 ? "s" : ""
  }</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = "liked";
    showScreen("playlist");
    renderPlaylist("liked");
    renderPlaylists();
  };
  likedList.appendChild(playlistCard);
}

// Dashboard sidebar
dashboardEl.menuBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.toggle("open");
});

dashboardEl.closeSidebarBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.remove("open");
});

// User menu toggle for dashboard
userMenus.dashboard.btn.addEventListener("click", () => {
  userMenus.dashboard.menu.classList.toggle("open");
  userMenus.playlist.menu.classList.remove("open");
});

// User menu toggle for playlist
userMenus.playlist.btn.addEventListener("click", () => {
  userMenus.playlist.menu.classList.toggle("open");
  userMenus.dashboard.menu.classList.remove("open");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu-wrapper")) {
    userMenus.dashboard.menu.classList.remove("open");
    userMenus.playlist.menu.classList.remove("open");
  }
});

// Logout handlers
userMenus.dashboard.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.dashboard.menu.classList.remove("open");
  showScreen("login");
});

userMenus.playlist.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.playlist.menu.classList.remove("open");
  showScreen("login");
});

dashboardEl.navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    if (item.dataset.view === "home") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "block"));
      if (libraryContent) libraryContent.style.display = "none";
      if (likedContent) likedContent.style.display = "none";
    } else if (item.dataset.view === "library") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "none"));
      if (libraryContent) libraryContent.style.display = "block";
      if (likedContent) likedContent.style.display = "none";
      renderLibrary();
    } else if (item.dataset.view === "liked") {
      // Directly open liked songs playlist view instead of showing tile
      state.currentPlaylist = "liked";
      showScreen("playlist");
      renderPlaylist("liked");
      renderPlaylists();
    }
  });
});

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = "inline-flex";
  dashboardEl.addPlaylistBtn.style.alignItems = "center";
  dashboardEl.addPlaylistBtn.style.justifyContent = "center";
  dashboardEl.addPlaylistBtn.style.width = "32px";
  dashboardEl.addPlaylistBtn.style.height = "32px";
  dashboardEl.addPlaylistBtn.style.borderRadius = "50%";
  dashboardEl.addPlaylistBtn.style.background = "#fff";
  dashboardEl.addPlaylistBtn.style.boxShadow = "0 2px 8px #0001";
  dashboardEl.addPlaylistBtn.style.border = "none";
  dashboardEl.addPlaylistBtn.style.cursor = "pointer";
}

// Initialize heart buttons when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach((pl) => {
    const itemContainer = document.createElement("div");
    itemContainer.className = "playlist-item-container";

    const btn = document.createElement("button");
    btn.className = "playlist-item";
    btn.textContent = pl.name;
    btn.addEventListener("click", () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist();
    });

    const moreBtn = document.createElement("button");
    moreBtn.className = "btn-playlist-more";
    moreBtn.innerHTML =
      '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
    moreBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      openPlaylistContextMenu(pl.id, e.currentTarget);
    });

    itemContainer.appendChild(btn);
    itemContainer.appendChild(moreBtn);
    dashboardEl.playlistsList.appendChild(itemContainer);
  });
}

function renderTrending() {
  dashboardEl.trendingGrid.innerHTML = "";
  SONGS.slice(0, 6).forEach((song) => {
    const tile = document.createElement("div");
    tile.className = "trending-tile";
    tile.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="trending-tile-img">
      <div class="trending-tile-info">
        <div class="trending-tile-title">${song.title}</div>
        <div class="trending-tile-artist">${song.artist}</div>
      </div>
    `;
    tile.addEventListener("click", () => playSong(song.id));
    dashboardEl.trendingGrid.appendChild(tile);
  });
}

function renderRecentlyPlayed() {
  dashboardEl.recentlyPlayed.innerHTML = "";
  state.recentlyPlayed.forEach((id) => {
    const song = getSongById(id);
    if (!song) return;
    const item = document.createElement("div");
    item.className = "recent-item";
    item.innerHTML = `
      <img src="${song.cover}" alt="${song.title}" class="recent-item-img">
      <div class="recent-item-info">
        <div class="recent-item-title">${song.title}</div>
        <div class="recent-item-artist">${song.artist}</div>
      </div>
      <div style="text-align:right; font-size:12px; color: var(--color-text-muted);">${song.album}</div>
      <div style="text-align:right; font-size:12px; color: var(--color-text-muted);">${song.duration}</div>
    `;
    item.addEventListener("click", () => playSong(song.id));
    dashboardEl.recentlyPlayed.appendChild(item);
  });
}

function renderLibrary() {
  const libraryList = document.getElementById("library-list");
  if (!libraryList) return;
  libraryList.innerHTML = "";
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach((pl) => {
    let cover = pl.cover || "./images/vinyl.png";
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find((s) => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement("button");
    card.className = "playlist-card";
    card.style =
      "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
    card.innerHTML = `
      <img src="${cover}" alt="${
      pl.name
    }" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${
        pl.name
      }</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${
      pl.songs.length !== 1 ? "s" : ""
    }</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen("playlist");
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector(".liked-content");
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked)
    .map((id) => getSongById(id))
    .filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector(".liked-songs-list");
  if (!likedList) {
    likedList = document.createElement("div");
    likedList.className = "liked-songs-list";
    likedContent.innerHTML = "";
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = "";

  if (likedSongs.length === 0) {
    likedList.innerHTML =
      '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement("button");
  playlistCard.className = "playlist-card";
  playlistCard.style =
    "display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;";
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${
    likedSongs.length !== 1 ? "s" : ""
  }</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = "liked";
    showScreen("playlist");
    renderPlaylist("liked");
    renderPlaylists();
  };
  likedList.appendChild(playlistCard);
}

// Dashboard sidebar
dashboardEl.menuBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.toggle("open");
});

dashboardEl.closeSidebarBtn.addEventListener("click", () => {
  dashboardEl.sidebar.classList.remove("open");
});

// User menu toggle for dashboard
userMenus.dashboard.btn.addEventListener("click", () => {
  userMenus.dashboard.menu.classList.toggle("open");
  userMenus.playlist.menu.classList.remove("open");
});

// User menu toggle for playlist
userMenus.playlist.btn.addEventListener("click", () => {
  userMenus.playlist.menu.classList.toggle("open");
  userMenus.dashboard.menu.classList.remove("open");
});

// Close menus when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".user-menu-wrapper")) {
    userMenus.dashboard.menu.classList.remove("open");
    userMenus.playlist.menu.classList.remove("open");
  }
});

// Logout handlers
userMenus.dashboard.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.dashboard.menu.classList.remove("open");
  showScreen("login");
});

userMenus.playlist.logoutBtn.addEventListener("click", () => {
  state.isLoggedIn = false;
  state.currentScreen = null;
  userMenus.playlist.menu.classList.remove("open");
  showScreen("login");
});

dashboardEl.navItems.forEach((item) => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    if (item.dataset.view === "home") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "block"));
      if (libraryContent) libraryContent.style.display = "none";
      if (likedContent) likedContent.style.display = "none";
    } else if (item.dataset.view === "library") {
      showScreen("dashboard");
      homeSections.forEach((s) => (s.style.display = "none"));
      if (libraryContent) libraryContent.style.display = "block";
      if (likedContent) likedContent.style.display = "none";
      renderLibrary();
    } else if (item.dataset.view === "liked") {
      // Directly open liked songs playlist view instead of showing tile
      state.currentPlaylist = "liked";
      showScreen("playlist");
      renderPlaylist("liked");
      renderPlaylists();
    }
  });
});

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll(".home-content");
    const libraryContent = document.querySelector(".library-content");
    const likedContent = document.querySelector(".liked-content");
    homeSections.forEach((s) => (s.style.display = "block"));
    if (libraryContent) libraryContent.style.display = "none";
    if (likedContent) likedContent.style.display = "none";
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = "inline-flex";
  dashboardEl.addPlaylistBtn.style.alignItems = "center";
  dashboardEl.addPlaylistBtn.style.justifyContent = "center";
  dashboardEl.addPlaylistBtn.style.width = "32px";
  dashboardEl.addPlaylistBtn.style.height = "32px";
  dashboardEl.addPlaylistBtn.style.borderRadius = "50%";
  dashboardEl.addPlaylistBtn.style.background = "#fff";
  dashboardEl.addPlaylistBtn.style.boxShadow = "0 2px 8px #0001";
  dashboardEl.addPlaylistBtn.style.border = "none";
  dashboardEl.addPlaylistBtn.style.cursor = "pointer";
}

// Initialize heart buttons when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}
