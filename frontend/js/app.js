/* ============================================
   LYRICA - VANILLA JS APP
   ============================================ */

// ========== DATA ==========
const SONGS = [
  { id: 1, title: "Blank", artist: "Disfigure", album: "NCS Release", duration: "", cover: "./images/disfigure.jpg", file: "./songs/disfigure.mp3" },
  { id: 2, title: "Fade", artist: "", album: "", duration: "", cover: "./images/fade.jpg", file: "./songs/fade.mp3" },
  { id: 3, title: "Fearless", artist: "", album: "", duration: "", cover: "./images/fearless.jpg", file: "./songs/fearless.mp3" },
  { id: 4, title: "For A Reason", artist: "Karan Aujla", album: "P-POP CULTURE", duration: "", cover: "./images/for-a-reason.jpg", file: "./songs/for%20a%20reason.mp3" },
  { id: 5, title: "Laembadgini", artist: "Diljit Dosanjh", album: "Laembadgini", duration: "", cover: "./images/Laembadgini.jpg", file: "./songs/laembadgini.mp3" },
  { id: 6, title: "Lover Ft. Intense", artist: "Diljit Dosanjh", album: "Lover", duration: "", cover: "./images/lover.jpg", file: "./songs/lover.mp3" },
  { id: 7, title: "Sky High", artist: "", album: "", duration: "", cover: "./images/skyhigh.jpg", file: "./songs/sky%20high.mp3" },
  { id: 8, title: "Shine", artist: "Spektrem", album: "NCS Release", duration: "", cover: "./images/spektrem.jpg", file: "./songs/spektrem.mp3" },
  { id: 9, title: "Wavy", artist: "Karan Aujla, Jay Trak", album: "Wavy", duration: "", cover: "./images/wavy.jpg", file: "./songs/wavy.mp3" },
  { id: 10, title: "Winning Speech", artist: "", album: "", duration: "", cover: "./images/winning-speech.jpg", file: "./songs/winning%20speech.mp3" }
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
    cover: "./images/liked.png"
  };
}

const CONCERTS = [
  { id: 1, artist: "Luna Eclipse", venue: "The Grand Theater", city: "New York, NY", date: "Dec 15, 2025", time: "8:00 PM", img: "./images/disfigure.jpg", price: "$45" },
  { id: 2, artist: "Neon Waves", venue: "Electric Arena", city: "Los Angeles, CA", date: "Dec 20, 2025", time: "7:30 PM", img: "./images/fade.jpg", price: "$55" },
  { id: 3, artist: "Coastal Sounds", venue: "Beachside Pavilion", city: "Miami, FL", date: "Dec 22, 2025", time: "9:00 PM", img: "./images/fearless.jpg", price: "$40" },
  { id: 4, artist: "City Beats", venue: "Metropolitan Hall", city: "Chicago, IL", date: "Dec 28, 2025", time: "8:30 PM", img: "./images/skyhigh.jpg", price: "$50" },
];

// ========== STATE ==========
let state = {
  isLoggedIn: false,
  isSignUp: false,
  currentScreen: "login",
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

const dashboardEl = {
  sidebar: document.getElementById("sidebar"),
  menuBtn: document.getElementById("menu-btn"),
  closeSidebarBtn: document.getElementById("close-sidebar-btn"),
  navItems: document.querySelectorAll(".nav-item"),
  playlistsList: document.getElementById("playlists-list"),
  addPlaylistBtn: document.getElementById("add-playlist-btn"),
  searchInput: document.getElementById("search-input"),
  resultsContainer: document.getElementById('results-container'),
  trendingGrid: document.getElementById("trending-grid"),
  recentlyPlayed: document.getElementById("recently-played"),
  concertsBtn: document.getElementById("concerts-btn"),
};

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
  cover: document.getElementById("player-cover"),
  title: document.getElementById("player-title"),
  artist: document.getElementById("player-artist"),
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
  heartBtn: null, // Will be created dynamically
};

const concertsModal = {
  modal: document.getElementById("concerts-modal"),
  closeBtn: document.getElementById("close-modal-btn"),
  list: document.getElementById("concerts-list"),
};

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

// ========== UTILITY FUNCTIONS ==========
function showScreen(screenName) {
  Object.values(screens).forEach(s => s.classList.remove("active"));
  screens[screenName]?.classList.add("active");
  state.currentScreen = screenName;
  // Close any open modals when switching screens
  concertsModal.modal.classList.remove("active");
}

// ========== INTERACTION HANDLERS ==========
function playSong(songId, queue = null) {
  const song = getSongById(songId);
  if (!song) return;

  // Update queue if provided, otherwise use all songs
  if (queue) {
    state.currentQueue = queue;
  } else if (state.currentQueue.length === 0) {
    state.currentQueue = SONGS.map(s => s.id);
  }

  state.currentSongId = songId;
  state.currentTrackIndex = state.currentQueue.findIndex(id => id === songId);

  playerEl.audio.src = song.file;
  playerEl.cover.src = song.cover;
  playerEl.title.textContent = song.title;
  playerEl.artist.textContent = song.artist;

  // Sync playlist page player
  if (playerPl.cover) {
    playerPl.cover.src = song.cover;
    playerPl.title.textContent = song.title;
    playerPl.artist.textContent = song.artist;
  }

  playerEl.audio.play().then(() => {
    state.isPlaying = true;
    updatePlayButton();
  }).catch(err => console.warn("Play error:", err));

  // Reset progress bar and timer
  playerEl.progressSlider.value = 0;
  if (playerPl.progressSlider) playerPl.progressSlider.value = 0;
  updatePlayerTimer(0, playerEl.audio.duration || 0);

  // Update heart button state
  updateHeartButton();

  // Add to recently played
  if (!state.recentlyPlayed.includes(songId)) {
    state.recentlyPlayed.unshift(songId);
    if (state.recentlyPlayed.length > 10) state.recentlyPlayed.pop();
  }
}

function updatePlayButton() {
  const playIcon = playerEl.playIcon || playerEl.playBtn?.querySelector('.icon');
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
  heartBtns.forEach(btn => {
    if (btn) {
      btn.classList.toggle('liked', isLiked);
      btn.style.color = isLiked ? '#e74c3c' : 'currentColor';
    }
  });
}

function getNextSong() {
  if (state.currentQueue.length === 0) return null;

  if (state.isShuffle) {
    let nextIndex;
    do {
      nextIndex = Math.floor(Math.random() * state.currentQueue.length);
    } while (state.currentQueue.length > 1 && state.currentQueue[nextIndex] === state.currentSongId);
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
    } while (state.currentQueue.length > 1 && state.currentQueue[prevIndex] === state.currentSongId);
    return state.currentQueue[prevIndex];
  } else {
    const prevIndex = (state.currentTrackIndex - 1 + state.currentQueue.length) % state.currentQueue.length;
    return state.currentQueue[prevIndex];
  }
}

// Update progress bar and timer as song plays
if (playerEl.audio) {
  playerEl.audio.addEventListener('timeupdate', () => {
    const current = playerEl.audio.currentTime;
    const total = playerEl.audio.duration || 0;
    playerEl.progressSlider.value = total ? (current / total) * 100 : 0;
    if (playerPl.progressSlider) playerPl.progressSlider.value = total ? (current / total) * 100 : 0;
    updatePlayerTimer(current, total);
  });

  // Auto-play next song when current song ends
  playerEl.audio.addEventListener('ended', () => {
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

  playerEl.progressSlider.addEventListener('input', () => {
    const total = playerEl.audio.duration || 0;
    playerEl.audio.currentTime = (playerEl.progressSlider.value / 100) * total;
  });

  if (playerPl.progressSlider) {
    playerPl.progressSlider.addEventListener('input', () => {
      const total = playerEl.audio.duration || 0;
      playerEl.audio.currentTime = (playerPl.progressSlider.value / 100) * total;
    });
  }

  playerEl.volumeSlider.addEventListener('input', () => {
    playerEl.audio.volume = playerEl.volumeSlider.value / 100;
  });
}

function updatePlayerTimer(current, total) {
  // Find timer element near progress bar (assume id 'player-timer')
  let timerEl = document.getElementById('player-timer');
  if (!timerEl) return;
  timerEl.textContent = `${formatDuration(current)} / ${formatDuration(total)}`;
}

// Playlist page controls (play/shuffle)
if (playlistEl.playBtn) {
  playlistEl.playBtn.addEventListener('click', () => {
    const songs = getSongsInPlaylist(state.currentPlaylist);
    if (songs.length > 0) playSong(songs[0].id);
  });
}
if (playlistEl.shuffleBtn) {
  playlistEl.shuffleBtn.addEventListener('click', () => {
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
  dashboardEl.concertsBtn.addEventListener("click", () => {
    concertsModal.modal.classList.add("active");
    concertsModal.list.innerHTML = "";
    CONCERTS.forEach(concert => {
      const item = document.createElement("div");
      item.className = "concert-item";
      item.innerHTML = `<img src='${concert.img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>
        <span style='font-weight:600;'>${concert.artist}</span> <span style='color:#888;'>@ ${concert.venue}, ${concert.city}</span><br>
        <span style='color:#555;'>${concert.date} ${concert.time} | ${concert.price}</span>`;
      concertsModal.list.appendChild(item);
    });
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
    if (playerPl.shuffleBtn) playerPl.shuffleBtn.classList.toggle("active", state.isShuffle);
  });
}

if (playerEl.repeatBtn) {
  playerEl.repeatBtn.addEventListener("click", () => {
    state.isRepeat = !state.isRepeat;
    playerEl.repeatBtn.classList.toggle("active", state.isRepeat);
    if (playerPl.repeatBtn) playerPl.repeatBtn.classList.toggle("active", state.isRepeat);
  });
}

// ============================
// Unified search module (single block)
// ============================
(function() {
  // expose as global so other code can call init() if needed
  window.songSearch = window.songSearch || {};

  const module = {
    _tracksCache: null,
    inputEl: null,
    suggestionsEl: null,
    gridEl: null,
    init() {
      // wire dashboardEl (fallbacks)
      window.dashboardEl = window.dashboardEl || {};
      this.inputEl = dashboardEl.searchInput
        || document.getElementById("search-input")
        || document.querySelector(".search-bar")
        || document.querySelector('input[type="search"]')
        || document.querySelector('input[placeholder*="Search"]');

      this.suggestionsEl = dashboardEl.resultsContainer
        || document.getElementById("results-container")
        || document.querySelector(".search-suggestions")
        || document.querySelector("#search-results")
        || document.querySelector(".results-container");

      this.gridEl = dashboardEl.trendingGrid
        || document.getElementById("trending-grid")
        || document.querySelector(".trending-grid")
        || document.getElementById("albums-container");

      if (!this.inputEl) {
        console.error("[songSearch] search input not found. Add id='search-input' or class='search-bar' (and wire dashboardEl.searchInput).");
        return;
      }
      if (!this.suggestionsEl) {
        // try to create one next to input for convenience (will be inserted after input)
        const container = document.createElement("div");
        container.id = "results-container";
        container.className = "search-suggestions";
        container.style.position = "absolute";
        container.style.top = "calc(100% + 8px)";
        container.style.left = "0";
        container.style.zIndex = "1400";
        // ensure parent is positioned
        const parent = this.inputEl.parentNode;
        if (parent && window.getComputedStyle(parent).position === "static") parent.style.position = "relative";
        this.inputEl.insertAdjacentElement("afterend", container);
        this.suggestionsEl = container;
        console.log("[songSearch] auto-created results container.");
      }

      // ensure SONGS exists
      if (!Array.isArray(window.SONGS)) window.SONGS = [];

      // attach handlers
      this._onInput = this._debounce(this._handleInput.bind(this), 160);
      this._onKeyDown = this._handleKeyDown.bind(this);
      this._onDocClick = (e) => {
        if (!this.suggestionsEl.contains(e.target) && e.target !== this.inputEl) this.hideSuggestions();
      };

      this.inputEl.addEventListener("input", this._onInput);
      this.inputEl.addEventListener("keydown", this._onKeyDown);
      document.addEventListener("click", this._onDocClick);

      console.debug("[songSearch] initialized");
    },

    // --- utils ---
    _debounce(fn, wait=180) {
      let t;
      return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), wait); };
    },

    _escape(s) { return String(s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); },

    async _fetchAllTracks() {
      if (this._tracksCache) return this._tracksCache;
      try {
        const res = await fetch("/api/music/tracks", { credentials: "include" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const arr = Array.isArray(data) ? data : (data.tracks || []);
        // normalize and merge into SONGS for playSong mapping
        arr.forEach(t => {
          const id = t.id ?? ('srv_' + Math.random().toString(36).slice(2,9));
          if (!SONGS.find(s => s.id === id)) {
            SONGS.push({
              id,
              title: t.title || t.name || "",
              artist: t.artist || "",
              album: t.album || "",
              cover: t.cover || "./images/vinyl.png",
              file: t.file || t.path || "./songs/placeholder.mp3"
            });
          }
        });
        this._tracksCache = SONGS.slice(); // store a snapshot
        return this._tracksCache;
      } catch (err) {
        console.warn("[songSearch] fetchAllTracks failed, falling back to local SONGS:", err);
        this._tracksCache = SONGS.slice();
        return this._tracksCache;
      }
    },

    // --- suggestions ---
    hideSuggestions() {
      if (!this.suggestionsEl) return;
      this.suggestionsEl.innerHTML = "";
      this.suggestionsEl.classList.remove("search-suggestions");
    },

    showSuggestions(list) {
      if (!this.suggestionsEl || !this.inputEl) return;
      this.suggestionsEl.innerHTML = "";
      this.suggestionsEl.classList.add("search-suggestions");

      // align width to input (if parent positioned)
      try {
        const rect = this.inputEl.getBoundingClientRect();
        const width = Math.min(Math.max(rect.width, 320), 840);
        this.suggestionsEl.style.width = width + "px";
        // ensure dropdown left aligns to input within its parent
        if (this.inputEl.offsetParent) {
          const offsetLeft = this.inputEl.offsetLeft;
          this.suggestionsEl.style.left = offsetLeft + "px";
        }
      } catch(e){}

      if (!list || list.length === 0) {
        const noDiv = document.createElement("div");
        noDiv.className = "suggestion-item";
        noDiv.textContent = "No results";
        this.suggestionsEl.appendChild(noDiv);
        return;
      }

      // create card-style suggestions (cover + title + artist)
      list.slice(0,6).forEach(song => {
        const div = document.createElement("button");
        div.type = "button";
        div.className = "suggestion-item";
        div.style.display = "flex";
        div.style.alignItems = "center";
        div.style.gap = "12px";
        div.style.border = "none";
        div.style.background = "transparent";
        div.style.width = "100%";
        div.style.textAlign = "left";
        div.style.padding = "12px";

        // cover
        const img = document.createElement("img");
        img.className = "suggestion-cover";
        img.src = song.cover || "./images/vinyl.png";
        img.alt = song.title || "cover";
        img.style.width = "64px";
        img.style.height = "64px";
        img.style.borderRadius = "8px";
        img.style.objectFit = "cover";
        img.style.flex = "0 0 64px";

        const txt = document.createElement("div");
        txt.style.minWidth = "0";
        txt.innerHTML = `<div class="s-title">${this._escape(song.title || "Untitled")}</div>
                         <div class="s-sub">${this._escape(song.artist || "")}</div>`;

        div.appendChild(img);
        div.appendChild(txt);

        div.addEventListener("click", () => {
          // clicking fills input and performs full search (scoped to current screen)
          this.inputEl.value = song.title || "";
          this.hideSuggestions();
          this.performFullSearch(this.inputEl.value);
        });

        this.suggestionsEl.appendChild(div);
      });
    },

    // --- full search and rendering ---
    // render search results as tiles (reuses album-card/search-tile style)
    renderSearchTiles(results) {
      if (!this.gridEl) {
        console.warn("[songSearch] gridEl not found, cannot render tiles.");
        return;
      }
      this.gridEl.innerHTML = "";
      if (!results || results.length === 0) {
        this.gridEl.innerHTML = `<div class="no-results">No songs found</div>`;
        return;
      }
      results.forEach(song => {
        // ensure SONGS contains the song for playSong lookup
        if (!SONGS.find(s => s.id === song.id)) {
          SONGS.push(song);
        }

        const card = document.createElement("button");
        card.className = "album-card search-tile";
        card.style.position = "relative";
        card.style.border = "none";
        card.style.background = "transparent";
        card.innerHTML = `
          <img class="album-cover" src="${this._escape(song.cover || "./images/vinyl.png")}" alt="${this._escape(song.title || "")}" style="width:100%;aspect-ratio:1/1;object-fit:cover;border-radius:6px;">
          <div class="play-overlay">▶</div>
          <div class="album-title" style="margin-top:8px;font-weight:600;color:#fff;">${this._escape(song.title || "Untitled")}</div>
          <div class="album-artist" style="font-size:13px;color:#bdbdbd;">${this._escape(song.artist || "")}</div>
        `;
        card.addEventListener("click", () => {
          try { playSong(song.id); } catch (e) { console.error("playSong failed:", e); }
        });
        this.gridEl.appendChild(card);
      });
    },

    // returns array of song objects for current scope (dashboard = all, playlist = playlist songs, liked = liked set)
    async _getScopeTracks() {
      // if on playlist screen, get songs from current playlist
      if (window.state && state.currentScreen === "playlist") {
        const plId = state.currentPlaylist || "fav";
        const inPl = getSongsInPlaylist ? getSongsInPlaylist(plId) : [];
        return inPl.filter(Boolean);
      }

      // if searching liked songs view
      if (window.state && state.currentPlaylist === "liked") {
        // get liked IDs from state.liked and map to SONGS
        const likedIds = Array.isArray(state.liked) ? state.liked : Array.from(state.liked || []);
        return likedIds.map(id => SONGS.find(s => s.id === id)).filter(Boolean);
      }

      // otherwise global scope: fetch all tracks from backend or SONGS fallback
      const all = await this._fetchAllTracks();
      return all.slice();
    },

    // full search action (Enter or suggestion click)
    async performFullSearch(query) {
      const q = String(query || "").trim().toLowerCase();
      if (!q) {
        // clear -> restore appropriate view
        this.hideSuggestions();
        if (window.state && state.currentScreen === "playlist" && typeof renderPlaylist === "function") {
          renderPlaylist(state.currentPlaylist);
        } else if (typeof renderTrending === "function") {
          renderTrending();
        } else if (typeof renderLikedContent === "function" && state.currentPlaylist === "liked") {
          renderLikedContent();
        }
        const status = document.getElementById("search-status"); if (status) status.style.display = "none";
        return;
      }

      const scopeTracks = await this._getScopeTracks();
      const results = scopeTracks.filter(s => {
        const title = String(s.title || "").toLowerCase();
        const artist = String(s.artist || "").toLowerCase();
        const album = String(s.album || "").toLowerCase();
        return title.includes(q) || artist.includes(q) || album.includes(q);
      });

      // Render tiles for results (works across dashboard/playlist/liked)
      this.renderSearchTiles(results);

      // update status count if present
      const status = document.getElementById("search-status");
      const rc = document.getElementById("results-count");
      if (status) { status.style.display = "flex"; if (rc) rc.textContent = results.length; }
      this.hideSuggestions();
    },

    // --- event handlers ---
    async _handleInput() {
      const val = String(this.inputEl.value || "").trim();
      if (val.length >= 3) {
        // suggestions from current scope
        const scopeTracks = await this._getScopeTracks();
        const q = val.toLowerCase();
        const suggestions = scopeTracks.filter(s => {
          const title = String(s.title || "").toLowerCase();
          const artist = String(s.artist || "").toLowerCase();
          return title.includes(q) || artist.includes(q);
        });
        this.showSuggestions(suggestions);
      } else {
        this.hideSuggestions();
        if (val.length === 0) {
          // restore original page view for current screen
          if (window.state && state.currentScreen === "playlist" && typeof renderPlaylist === "function") {
            renderPlaylist(state.currentPlaylist);
          } else if (typeof renderTrending === "function") {
            renderTrending();
          }
          const status = document.getElementById("search-status"); if (status) status.style.display = "none";
        }
      }
    },

    _handleKeyDown(e) {
      if (e.key === "Enter") {
        e.preventDefault();
        this.performFullSearch(this.inputEl.value);
      } else if (e.key === "Escape") {
        this.hideSuggestions();
      }
    }
  };

  // expose public init and performFullSearch for external calls
  window.songSearch.init = module.init.bind(module);
  window.songSearch.performFullSearch = module.performFullSearch.bind(module);
  // initialize automatically on DOMContentLoaded if not already
  document.addEventListener("DOMContentLoaded", () => { try { window.songSearch.init(); } catch(e){} });
})();



// --- 7. START THE APP ---
// This part remains the same.
document.addEventListener('DOMContentLoaded', () => {
    songSearch.init();
});

// --- 6. START THE APP ---
// When the page content is fully loaded, initialize the search functionality.
document.addEventListener('DOMContentLoaded', () => {
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
    heartBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
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
    heartBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
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
  heartPopup.style.transform = 'translateY(-100%)';

  let html = `<div style="font-weight:600;margin-bottom:12px;font-size:14px;">Add "${song.title}" to:</div>`;

  // Liked Songs option
  html += `<button class="heart-popup-item" data-action="liked" style="width:100%;padding:10px;text-align:left;background:none;border:none;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="${isLiked ? '#e74c3c' : 'none'}" stroke="currentColor" stroke-width="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
    <span>${isLiked ? 'Remove from' : 'Add to'} Liked Songs</span>
  </button>`;

  // Playlist options
  PLAYLISTS.forEach(pl => {
    const inPlaylist = pl.songs.includes(state.currentSongId);
    html += `<button class="heart-popup-item" data-action="playlist" data-playlist-id="${pl.id}" style="width:100%;padding:10px;text-align:left;background:none;border:none;cursor:pointer;border-radius:6px;display:flex;align-items:center;gap:8px;margin-top:4px;">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="${inPlaylist ? '#4a90e2' : 'none'}" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
        <path d="M9 9h6v6H9z"/>
      </svg>
      <span>${inPlaylist ? 'Remove from' : 'Add to'} ${pl.name}</span>
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
  heartPopup.querySelectorAll('.heart-popup-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.dataset.action;
      if (action === 'liked') {
        if (isLiked) {
          state.liked.delete(state.currentSongId);
        } else {
          state.liked.add(state.currentSongId);
        }
        updateHeartButton();
        renderPlaylists();
        if (state.currentPlaylist === "liked") renderPlaylist("liked");
      } else if (action === 'playlist') {
        const plId = btn.dataset.playlistId;
        const pl = getPlaylistById(plId);
        if (pl) {
          const index = pl.songs.indexOf(state.currentSongId);
          if (index > -1) {
            pl.songs.splice(index, 1);
          } else {
            pl.songs.push(state.currentSongId);
          }
          renderPlaylists();
          if (state.currentPlaylist === plId) renderPlaylist(plId);
        }
      }
      heartPopup.remove();
      heartPopup = null;
    });
  });

  const createBtn = heartPopup.querySelector('#create-playlist-heart');
  const nameInput = heartPopup.querySelector('#new-playlist-name-heart');
  if (createBtn && nameInput) {
    createBtn.addEventListener('click', () => {
      const name = nameInput.value.trim();
      if (name) {
        const newId = 'pl_' + Date.now();
        const newPl = { id: newId, name: name, songs: [state.currentSongId] };
        PLAYLISTS.push(newPl);
        renderPlaylists();
        heartPopup.remove();
        heartPopup = null;
      }
    });
  }

  // Close on outside click
  setTimeout(() => {
    document.addEventListener('click', function closePopup(e) {
      if (!heartPopup?.contains(e.target) && e.target !== button) {
        heartPopup?.remove();
        heartPopup = null;
        document.removeEventListener('click', closePopup);
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
    showScreen("dashboard");
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
    playlistEl.sidebar?.classList.remove("open");
  });
}

if (btnLibraryPl) {
  btnLibraryPl.addEventListener("click", () => {
    showScreen("dashboard");
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'none');
    if (libraryContent) libraryContent.style.display = 'block';
    if (likedContent) likedContent.style.display = 'none';
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
    CONCERTS.forEach(concert => {
      const item = document.createElement("div");
      item.className = "concert-item";
      item.innerHTML = `<img src='${concert.img}' style='width:60px;height:60px;border-radius:8px;margin-right:12px;vertical-align:middle;'>${concert.artist}</span> <span style='color:#888;'>@ ${concert.venue}, ${concert.city}</span><br><span style='color:#555;'>${concert.date} ${concert.time} | ${concert.price}</span>`;
      concertsModal.list.appendChild(item);
    });
  });
}

function getSongById(id) {
  return SONGS.find(s => s.id === id);
}

function getPlaylistById(id) {
  if (id === "liked") {
    return getLikedSongsPlaylist();
  }
  return PLAYLISTS.find(p => p.id === id);
}

function getSongsInPlaylist(playlistId) {
  const pl = getPlaylistById(playlistId);
  return pl ? pl.songs.map(id => getSongById(id)).filter(Boolean) : [];
}

function getAllPlaylists() {
  const liked = getLikedSongsPlaylist();
  return [liked, ...PLAYLISTS];
}

function formatDuration(sec) {
  if (!sec) return "0:00";
  const mins = Math.floor(sec / 60);
  const secs = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

// ========== LOGIN ==========
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Basic validation for demo: require email and password
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";
  let loginSuccess = false;
  let errorMsg = "";
  try {
    // TODO: Replace with real backend call
    // Example:
    // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' }});
    // const data = await res.json();
    // loginSuccess = data.success;
    // errorMsg = data.message;
    // Simulate success for demo
    await new Promise(r => setTimeout(r, 600));
    loginSuccess = true;
  } catch (err) {
    errorMsg = "Network error. Please try again.";
  }
  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";
  if (loginSuccess) {
    state.isLoggedIn = true;
    showScreen("dashboard");
    renderDashboard();
  } else {
    alert(errorMsg || "Invalid credentials.");
  }
});

loginEl.toggleBtn.addEventListener("click", () => {
  state.isSignUp = !state.isSignUp;
  if (state.isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Create Account";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Sign In";
  }
});

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
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
    moreBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
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
  SONGS.slice(0, 6).forEach(song => {
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
  state.recentlyPlayed.forEach(id => {
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
  const libraryList = document.getElementById('library-list');
  if (!libraryList) return;
  libraryList.innerHTML = '';
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach(pl => {
    let cover = pl.cover || './images/vinyl.png';
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find(s => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
    card.innerHTML = `
      <img src="${cover}" alt="${pl.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${pl.name}</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen('playlist');
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector('.liked-content');
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked).map(id => getSongById(id)).filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector('.liked-songs-list');
  if (!likedList) {
    likedList = document.createElement('div');
    likedList.className = 'liked-songs-list';
    likedContent.innerHTML = '';
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = '';

  if (likedSongs.length === 0) {
    likedList.innerHTML = '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement('button');
  playlistCard.className = 'playlist-card';
  playlistCard.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = 'liked';
    showScreen('playlist');
    renderPlaylist('liked');
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

dashboardEl.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    if (item.dataset.view === "home") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'block');
      if (libraryContent) libraryContent.style.display = 'none';
      if (likedContent) likedContent.style.display = 'none';
    } else if (item.dataset.view === "library") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'none');
      if (libraryContent) libraryContent.style.display = 'block';
      if (likedContent) likedContent.style.display = 'none';
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
const homeNavBtn = Array.from(dashboardEl.navItems).find(i => i.dataset.view === 'home');
if (homeNavBtn) {
  homeNavBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Make Back button on playlist page return to dashboard/home
if (playlistEl.backBtn) {
  playlistEl.backBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = 'inline-flex';
  dashboardEl.addPlaylistBtn.style.alignItems = 'center';
  dashboardEl.addPlaylistBtn.style.justifyContent = 'center';
  dashboardEl.addPlaylistBtn.style.width = '32px';
  dashboardEl.addPlaylistBtn.style.height = '32px';
  dashboardEl.addPlaylistBtn.style.borderRadius = '50%';
  dashboardEl.addPlaylistBtn.style.background = '#fff';
  dashboardEl.addPlaylistBtn.style.boxShadow = '0 2px 8px #0001';
  dashboardEl.addPlaylistBtn.style.border = 'none';
  dashboardEl.addPlaylistBtn.style.cursor = 'pointer';
}

// Initialize heart buttons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
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
  playlistEl.count.textContent = `${playlist.songs.length} song${playlist.songs.length !== 1 ? 's' : ''}`;

  // Use cover from playlist or first song, else default
  let cover = playlist.cover || "./images/vinyl.png";
  if (!playlist.cover && playlist.songs.length > 0) {
    const firstSong = getSongById(playlist.songs[0]);
    if (firstSong && firstSong.cover) cover = firstSong.cover;
  }
  playlistEl.cover.src = cover;

  // Hide edit button for liked songs
  if (playlistEl.editBtn) {
    playlistEl.editBtn.style.display = playlist.isSpecial ? "none" : "inline-flex";
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
      <td><img src='${song.cover}' alt='' style='width:40px;height:40px;border-radius:6px;vertical-align:middle;margin-right:8px;'>${song.title}</td>
      <td>${song.artist}</td>
      <td>${song.duration}</td>
      <td>
        <button class="btn-song-delete" data-song-id="${song.id}" style="background:none;border:none;cursor:pointer;color:#888;padding:4px 8px;" title="Remove from playlist">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </td>
    `;
    tr.addEventListener("click", (e) => {
      if (!e.target.closest('.btn-song-delete')) {
        playSong(song.id, playlist.songs);
      }
    });

    // Delete button handler
    const deleteBtn = tr.querySelector('.btn-song-delete');
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        if (playlist.id === "liked") {
          state.liked.delete(song.id);
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
  document.getElementById("email-format").className = emailValid ? "valid" : "invalid";
});

// ====== Real-Time Password Validation ======
passwordInput.addEventListener("input", () => {
  const password = passwordInput.value;

  document.getElementById("rule-length").className = password.length >= 8 ? "valid" : "invalid";
  document.getElementById("rule-uppercase").className = /[A-Z]/.test(password) ? "valid" : "invalid";
  document.getElementById("rule-lowercase").className = /[a-z]/.test(password) ? "valid" : "invalid";
  document.getElementById("rule-number").className = /\d/.test(password) ? "valid" : "invalid";
  document.getElementById("rule-special").className = /[@$!%*?&]/.test(password) ? "valid" : "invalid";
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
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");

  const emailValid = /^[^\s@]+@[^\s@]+\.(com|in)$/.test(email);
  const passwordValid =
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password) &&
    /[@$!%*?&]/.test(password);

  if (!email || !password || !emailValid || !passwordValid) {
    alert("Please fix the highlighted issues before submitting.");
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = state.isSignUp ? "Creating account..." : "Signing in...";
  let loginSuccess = false;
  let errorMsg = "";

  try {
    await new Promise(r => setTimeout(r, 600)); // Simulated backend call
    loginSuccess = true;
  } catch (err) {
    errorMsg = "Network error. Please try again.";
  }

  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";

  if (loginSuccess) {
    state.isLoggedIn = true;
    showScreen("dashboard");
    renderDashboard();
  } else {
    alert(errorMsg || "Invalid credentials.");
  }
});
// ====== Toggle Sign In / Sign Up ======
loginEl.toggleBtn.addEventListener("click", () => {
  state.isSignUp = !state.isSignUp;

  if (state.isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Create Account";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Sign In";
  }
});
// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
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
    moreBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
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
  SONGS.slice(0, 6).forEach(song => {
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
  state.recentlyPlayed.forEach(id => {
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
  const libraryList = document.getElementById('library-list');
  if (!libraryList) return;
  libraryList.innerHTML = '';
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach(pl => {
    let cover = pl.cover || './images/vinyl.png';
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find(s => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
    card.innerHTML = `
      <img src="${cover}" alt="${pl.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${pl.name}</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen('playlist');
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector('.liked-content');
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked).map(id => getSongById(id)).filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector('.liked-songs-list');
  if (!likedList) {
    likedList = document.createElement('div');
    likedList.className = 'liked-songs-list';
    likedContent.innerHTML = '';
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = '';

  if (likedSongs.length === 0) {
    likedList.innerHTML = '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement('button');
  playlistCard.className = 'playlist-card';
  playlistCard.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = 'liked';
    showScreen('playlist');
    renderPlaylist('liked');
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

dashboardEl.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    if (item.dataset.view === "home") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'block');
      if (libraryContent) libraryContent.style.display = 'none';
      if (likedContent) likedContent.style.display = 'none';
    } else if (item.dataset.view === "library") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'none');
      if (libraryContent) libraryContent.style.display = 'block';
      if (likedContent) likedContent.style.display = 'none';
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
  playlistEl.backBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = 'inline-flex';
  dashboardEl.addPlaylistBtn.style.alignItems = 'center';
  dashboardEl.addPlaylistBtn.style.justifyContent = 'center';
  dashboardEl.addPlaylistBtn.style.width = '32px';
  dashboardEl.addPlaylistBtn.style.height = '32px';
  dashboardEl.addPlaylistBtn.style.borderRadius = '50%';
  dashboardEl.addPlaylistBtn.style.background = '#fff';
  dashboardEl.addPlaylistBtn.style.boxShadow = '0 2px 8px #0001';
  dashboardEl.addPlaylistBtn.style.border = 'none';
  dashboardEl.addPlaylistBtn.style.cursor = 'pointer';
}

// Initialize heart buttons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== LOGIN ==========
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Basic validation for demo: require email and password
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";
  let loginSuccess = false;
  let errorMsg = "";
  try {
    // TODO: Replace with real backend call
    // Example:
    // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' }});
    // const data = await res.json();
    // loginSuccess = data.success;
    // errorMsg = data.message;
    // Simulate success for demo
    await new Promise(r => setTimeout(r, 600));
    loginSuccess = true;
  } catch (err) {
    errorMsg = "Network error. Please try again.";
  }
  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";
  if (loginSuccess) {
    state.isLoggedIn = true;
    showScreen("dashboard");
    renderDashboard();
  } else {
    alert(errorMsg || "Invalid credentials.");
  }
});

loginEl.toggleBtn.addEventListener("click", () => {
  state.isSignUp = !state.isSignUp;
  if (state.isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Create Account";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Sign In";
  }
});

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
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
    moreBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
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
  SONGS.slice(0, 6).forEach(song => {
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
  state.recentlyPlayed.forEach(id => {
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
  const libraryList = document.getElementById('library-list');
  if (!libraryList) return;
  libraryList.innerHTML = '';
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach(pl => {
    let cover = pl.cover || './images/vinyl.png';
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find(s => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
    card.innerHTML = `
      <img src="${cover}" alt="${pl.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${pl.name}</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen('playlist');
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector('.liked-content');
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked).map(id => getSongById(id)).filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector('.liked-songs-list');
  if (!likedList) {
    likedList = document.createElement('div');
    likedList.className = 'liked-songs-list';
    likedContent.innerHTML = '';
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = '';

  if (likedSongs.length === 0) {
    likedList.innerHTML = '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement('button');
  playlistCard.className = 'playlist-card';
  playlistCard.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = 'liked';
    showScreen('playlist');
    renderPlaylist('liked');
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

dashboardEl.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    if (item.dataset.view === "home") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'block');
      if (libraryContent) libraryContent.style.display = 'none';
      if (likedContent) likedContent.style.display = 'none';
    } else if (item.dataset.view === "library") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'none');
      if (libraryContent) libraryContent.style.display = 'block';
      if (likedContent) likedContent.style.display = 'none';
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
  playlistEl.backBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = 'inline-flex';
  dashboardEl.addPlaylistBtn.style.alignItems = 'center';
  dashboardEl.addPlaylistBtn.style.justifyContent = 'center';
  dashboardEl.addPlaylistBtn.style.width = '32px';
  dashboardEl.addPlaylistBtn.style.height = '32px';
  dashboardEl.addPlaylistBtn.style.borderRadius = '50%';
  dashboardEl.addPlaylistBtn.style.background = '#fff';
  dashboardEl.addPlaylistBtn.style.boxShadow = '0 2px 8px #0001';
  dashboardEl.addPlaylistBtn.style.border = 'none';
  dashboardEl.addPlaylistBtn.style.cursor = 'pointer';
}

// Initialize heart buttons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== LOGIN ==========
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Basic validation for demo: require email and password
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";
  let loginSuccess = false;
  let errorMsg = "";
  try {
    // TODO: Replace with real backend call
    // Example:
    // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' }});
    // const data = await res.json();
    // loginSuccess = data.success;
    // errorMsg = data.message;
    // Simulate success for demo
    await new Promise(r => setTimeout(r, 600));
    loginSuccess = true;
  } catch (err) {
    errorMsg = "Network error. Please try again.";
  }
  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";
  if (loginSuccess) {
    state.isLoggedIn = true;
    showScreen("dashboard");
    renderDashboard();
  } else {
    alert(errorMsg || "Invalid credentials.");
  }
});

loginEl.toggleBtn.addEventListener("click", () => {
  state.isSignUp = !state.isSignUp;
  if (state.isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Create Account";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Sign In";
  }
});

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
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
    moreBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
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
  SONGS.slice(0, 6).forEach(song => {
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
  state.recentlyPlayed.forEach(id => {
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
  const libraryList = document.getElementById('library-list');
  if (!libraryList) return;
  libraryList.innerHTML = '';
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach(pl => {
    let cover = pl.cover || './images/vinyl.png';
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find(s => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
    card.innerHTML = `
      <img src="${cover}" alt="${pl.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${pl.name}</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen('playlist');
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector('.liked-content');
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked).map(id => getSongById(id)).filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector('.liked-songs-list');
  if (!likedList) {
    likedList = document.createElement('div');
    likedList.className = 'liked-songs-list';
    likedContent.innerHTML = '';
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = '';

  if (likedSongs.length === 0) {
    likedList.innerHTML = '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement('button');
  playlistCard.className = 'playlist-card';
  playlistCard.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = 'liked';
    showScreen('playlist');
    renderPlaylist('liked');
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

dashboardEl.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    if (item.dataset.view === "home") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'block');
      if (libraryContent) libraryContent.style.display = 'none';
      if (likedContent) likedContent.style.display = 'none';
    } else if (item.dataset.view === "library") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'none');
      if (libraryContent) libraryContent.style.display = 'block';
      if (likedContent) likedContent.style.display = 'none';
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
  playlistEl.backBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = 'inline-flex';
  dashboardEl.addPlaylistBtn.style.alignItems = 'center';
  dashboardEl.addPlaylistBtn.style.justifyContent = 'center';
  dashboardEl.addPlaylistBtn.style.width = '32px';
  dashboardEl.addPlaylistBtn.style.height = '32px';
  dashboardEl.addPlaylistBtn.style.borderRadius = '50%';
  dashboardEl.addPlaylistBtn.style.background = '#fff';
  dashboardEl.addPlaylistBtn.style.boxShadow = '0 2px 8px #0001';
  dashboardEl.addPlaylistBtn.style.border = 'none';
  dashboardEl.addPlaylistBtn.style.cursor = 'pointer';
}

// Initialize heart buttons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}

// ========== LOGIN ==========
loginEl.form.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Basic validation for demo: require email and password
  const email = document.getElementById("input-email").value.trim();
  const password = document.getElementById("input-password").value.trim();
  const submitBtn = loginEl.form.querySelector("button[type='submit']");
  if (!email || !password) {
    alert("Please enter both email and password.");
    return;
  }
  submitBtn.disabled = true;
  submitBtn.textContent = "Signing in...";
  let loginSuccess = false;
  let errorMsg = "";
  try {
    // TODO: Replace with real backend call
    // Example:
    // const res = await fetch('/api/login', { method: 'POST', body: JSON.stringify({ email, password }), headers: { 'Content-Type': 'application/json' }});
    // const data = await res.json();
    // loginSuccess = data.success;
    // errorMsg = data.message;
    // Simulate success for demo
    await new Promise(r => setTimeout(r, 600));
    loginSuccess = true;
  } catch (err) {
    errorMsg = "Network error. Please try again.";
  }
  submitBtn.disabled = false;
  submitBtn.textContent = state.isSignUp ? "Create Account" : "Sign In";
  if (loginSuccess) {
    state.isLoggedIn = true;
    showScreen("dashboard");
    renderDashboard();
  } else {
    alert(errorMsg || "Invalid credentials.");
  }
});

loginEl.toggleBtn.addEventListener("click", () => {
  state.isSignUp = !state.isSignUp;
  if (state.isSignUp) {
    loginEl.title.textContent = "Create Account";
    loginEl.subtitle.textContent = "Join Lyrica today";
    loginEl.nameGroup.style.display = "block";
    loginEl.forgotLink.style.display = "none";
    loginEl.toggleBtn.textContent = "Sign In";
    loginEl.toggleText.textContent = "Already have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Create Account";
  } else {
    loginEl.title.textContent = "Welcome Back";
    loginEl.subtitle.textContent = "Sign in to continue";
    loginEl.nameGroup.style.display = "none";
    loginEl.forgotLink.style.display = "block";
    loginEl.toggleBtn.textContent = "Sign Up";
    loginEl.toggleText.textContent = "Don't have an account? ";
    loginEl.form.querySelector("button[type='submit']").textContent = "Sign In";
  }
});

// ========== DASHBOARD ==========
function renderDashboard() {
  renderPlaylists();
  renderTrending();
  renderRecentlyPlayed();
}

function renderPlaylists() {
  dashboardEl.playlistsList.innerHTML = "";
  PLAYLISTS.forEach(pl => {
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
    moreBtn.innerHTML = '<svg class="icon" viewBox="0 0 24 24"><circle cx="12" cy="5" r="1.5" fill="currentColor"/><circle cx="12" cy="12" r="1.5" fill="currentColor"/><circle cx="12" cy="19" r="1.5" fill="currentColor"/></svg>';
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
  SONGS.slice(0, 6).forEach(song => {
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
  state.recentlyPlayed.forEach(id => {
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
  const libraryList = document.getElementById('library-list');
  if (!libraryList) return;
  libraryList.innerHTML = '';
  const allPlaylists = getAllPlaylists();
  if (allPlaylists.length === 0) {
    libraryList.innerHTML = '<p style="color:#888;">Nothing is here.</p>';
    return;
  }
  allPlaylists.forEach(pl => {
    let cover = pl.cover || './images/vinyl.png';
    if (!pl.cover && pl.songs.length > 0) {
      const song = SONGS.find(s => s.id === pl.songs[0]);
      if (song && song.cover) cover = song.cover;
    }
    const card = document.createElement('button');
    card.className = 'playlist-card';
    card.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
    card.innerHTML = `
      <img src="${cover}" alt="${pl.name}" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
      <div style="margin-top:12px;font-weight:600;font-size:1.1em;">${pl.name}</div>
      <div style="color:#888;font-size:0.95em;">${pl.songs.length} song${pl.songs.length !== 1 ? 's' : ''}</div>
    `;
    card.onclick = () => {
      state.currentPlaylist = pl.id;
      showScreen('playlist');
      renderPlaylist(pl.id);
      renderPlaylists(); // Ensure sidebar playlists are always visible
    };
    libraryList.appendChild(card);
  });
}

function renderLikedContent() {
  const likedContent = document.querySelector('.liked-content');
  if (!likedContent) return;

  const likedSongs = Array.from(state.liked).map(id => getSongById(id)).filter(Boolean);

  // Create or update liked songs list
  let likedList = likedContent.querySelector('.liked-songs-list');
  if (!likedList) {
    likedList = document.createElement('div');
    likedList.className = 'liked-songs-list';
    likedContent.innerHTML = '';
    likedContent.appendChild(likedList);
  }

  likedList.innerHTML = '';

  if (likedSongs.length === 0) {
    likedList.innerHTML = '<p style="color:#888;padding:20px;">No liked songs yet. Click the heart button on any song to add it here.</p>';
    return;
  }

  // Render as playlist-like view
  const playlistCard = document.createElement('button');
  playlistCard.className = 'playlist-card';
  playlistCard.style = 'display:inline-block;margin:16px 16px 0 0;padding:16px;background:#fff;border-radius:18px;box-shadow:0 2px 8px #0001;width:200px;text-align:center;vertical-align:top;cursor:pointer;border:none;outline:none;';
  playlistCard.innerHTML = `
    <img src="./images/liked.png" alt="Liked Songs" style="width:100%;height:120px;object-fit:cover;border-radius:12px;">
    <div style="margin-top:12px;font-weight:600;font-size:1.1em;">Liked Songs</div>
    <div style="color:#888;font-size:0.95em;">${likedSongs.length} song${likedSongs.length !== 1 ? 's' : ''}</div>
  `;
  playlistCard.onclick = () => {
    state.currentPlaylist = 'liked';
    showScreen('playlist');
    renderPlaylist('liked');
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

dashboardEl.navItems.forEach(item => {
  item.addEventListener("click", (e) => {
    dashboardEl.navItems.forEach(i => i.classList.remove("active"));
    item.classList.add("active");
    // Show only the relevant content section
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    if (item.dataset.view === "home") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'block');
      if (libraryContent) libraryContent.style.display = 'none';
      if (likedContent) likedContent.style.display = 'none';
    } else if (item.dataset.view === "library") {
      showScreen('dashboard');
      homeSections.forEach(s => s.style.display = 'none');
      if (libraryContent) libraryContent.style.display = 'block';
      if (likedContent) likedContent.style.display = 'none';
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
  playlistEl.backBtn.addEventListener('click', () => {
    showScreen('dashboard');
    const homeSections = document.querySelectorAll('.home-content');
    const libraryContent = document.querySelector('.library-content');
    const likedContent = document.querySelector('.liked-content');
    homeSections.forEach(s => s.style.display = 'block');
    if (libraryContent) libraryContent.style.display = 'none';
    if (likedContent) likedContent.style.display = 'none';
  });
}

// Sidebar + icon button for creating playlist
if (dashboardEl.addPlaylistBtn) {
  dashboardEl.addPlaylistBtn.style.display = 'inline-flex';
  dashboardEl.addPlaylistBtn.style.alignItems = 'center';
  dashboardEl.addPlaylistBtn.style.justifyContent = 'center';
  dashboardEl.addPlaylistBtn.style.width = '32px';
  dashboardEl.addPlaylistBtn.style.height = '32px';
  dashboardEl.addPlaylistBtn.style.borderRadius = '50%';
  dashboardEl.addPlaylistBtn.style.background = '#fff';
  dashboardEl.addPlaylistBtn.style.boxShadow = '0 2px 8px #0001';
  dashboardEl.addPlaylistBtn.style.border = 'none';
  dashboardEl.addPlaylistBtn.style.cursor = 'pointer';
}

// Initialize heart buttons when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initHeartButtons, 100);
  });
} else {
  setTimeout(initHeartButtons, 100);
}