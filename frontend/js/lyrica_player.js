// ========== LYRICA — Unified Player Script ==========
// Handles UI, playback, shuffle, repeat, and backend logging

document.addEventListener("DOMContentLoaded", () => {
  console.log("✅ Lyrica unified player initialized");

  // ===== SONG DATA =====
  const songs = [
    {
      title: "Disfigure",
      artist: "NCS Release",
      file: "/songs/disfigure.mp3",
      cover: "images/disfigure.jpg",
    },
    {
      title: "Fade",
      artist: "Alan Walker",
      file: "/songs/fade.mp3",
      cover: "images/fade.jpg",
    },
    {
      title: "Fearless",
      artist: "Lost Sky",
      file: "/songs/fearless.mp3",
      cover: "images/fearless.jpg",
    },
    {
      title: "Sky High",
      artist: "Elektronomia",
      file: "/songs/sky high.mp3",
      cover: "images/skyhigh.jpg",
    },
    {
      title: "Spektrem",
      artist: "NCS Release",
      file: "/songs/spektrem.mp3",
      cover: "images/spektrem.jpg",
    },
  ];

  // ===== ELEMENT REFERENCES =====
  const audio = document.getElementById("audio");
  const titleEl = document.getElementById("title");
  const artistEl = document.getElementById("artist");
  const coverEl = document.getElementById("cover");
  const playPauseBtn = document.getElementById("playPause");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");
  const shuffleBtn = document.getElementById("shuffle");
  const repeatBtn = document.getElementById("repeat");
  const progress = document.getElementById("progress");
  const volume = document.getElementById("volume");
  const currentTimeEl = document.getElementById("currentTime");
  const durationEl = document.getElementById("duration");
  const queueToggle = document.getElementById("queueToggle");
  const queue = document.getElementById("queue");
  const queueList = document.getElementById("queueList");
  const songList = document.getElementById("song-list");

  // ❤️ Like button and local storage
  const likeBtn = document.getElementById("likeBtn");
  let likedSongs = JSON.parse(localStorage.getItem("likedSongs") || "[]");

  // ===== PLAYER STATE =====
  let currentIndex = 0;
  let isPlaying = false;
  let isShuffle = false;
  let repeatMode = 0; // 0 = off, 1 = repeat all, 2 = repeat one

  // ===== INITIALIZE UI =====
  function loadSongs() {
    songList.innerHTML = "";
    queueList.innerHTML = "";
    songs.forEach((song, index) => {
      // Song list on left
      const li = document.createElement("li");
      li.textContent = `${song.title} — ${song.artist}`;
      li.classList.add("song-item");
      li.addEventListener("click", () => playSong(index));
      songList.appendChild(li);

      // Queue list on right
      const qli = document.createElement("li");
      qli.textContent = song.title;
      qli.dataset.index = index;
      qli.addEventListener("click", () => playSong(index));
      queueList.appendChild(qli);
    });
  }

  // ===== PLAY SONG =====
  function playSong(index) {
    const s = songs[index];
    if (!s) return;

    currentIndex = index;
    audio.src = s.file;
    coverEl.src = s.cover;
    titleEl.textContent = s.title;
    artistEl.textContent = s.artist;

    // update like state on load
    updateLikeButton();

    audio
      .play()
      .then(() => {
        isPlaying = true;
        playPauseBtn.textContent = "⏸";
      })
      .catch((err) => console.warn("⚠️ play() interrupted:", err.message));

    highlightPlaying(index);
    updateQueueHighlight();

    // ---- Log song play to backend ----
    fetch("/song/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_id: index + 1,
        song_title: s.title,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log("✅ Song play logged:", data))
      .catch((err) => console.error("⚠️ Failed to log play:", err));
  }

  // ===== TOGGLE PLAY/PAUSE =====
  playPauseBtn.addEventListener("click", () => {
    if (!audio.src) playSong(0);
    else if (isPlaying) {
      audio.pause();
      playPauseBtn.textContent = "▶";
      isPlaying = false;
    } else {
      audio
        .play()
        .catch((err) => console.warn("⚠️ play() interrupted:", err.message));
      playPauseBtn.textContent = "⏸";
      isPlaying = true;
    }
  });

  // ===== PREV / NEXT =====
  nextBtn.addEventListener("click", () => {
    if (isShuffle) playRandom();
    else playSong((currentIndex + 1) % songs.length);
  });

  prevBtn.addEventListener("click", () => {
    if (audio.currentTime > 3) {
      audio.currentTime = 0;
    } else if (isShuffle) {
      playRandom();
    } else {
      playSong((currentIndex - 1 + songs.length) % songs.length);
    }
  });

  // ===== SHUFFLE / REPEAT =====
  shuffleBtn.addEventListener("click", () => {
    isShuffle = !isShuffle;
    shuffleBtn.style.opacity = isShuffle ? 1 : 0.6;
    console.log(`🔀 Shuffle ${isShuffle ? "enabled" : "disabled"}`);
  });

  repeatBtn.addEventListener("click", () => {
    repeatMode = (repeatMode + 1) % 3;
    repeatBtn.style.opacity = repeatMode ? 1 : 0.6;
    const modes = ["off", "all", "one"];
    console.log(`🔁 Repeat mode: ${modes[repeatMode]}`);
  });
  // ===== LIKE / UNLIKE =====
  likeBtn.addEventListener("click", () => {
    const song = songs[currentIndex];
    if (!song) return;

    const isLiked = likedSongs.some((s) => s.file === song.file);

    if (isLiked) {
      likedSongs = likedSongs.filter((s) => s.file !== song.file);
      likeBtn.textContent = "♡"; // unfilled
      console.log(`💔 Removed from liked: ${song.title}`);
    } else {
      likedSongs.push(song);
      likeBtn.textContent = "❤️"; // filled
      console.log(`❤️ Liked: ${song.title}`);
    }

    // persist in localStorage
    localStorage.setItem("likedSongs", JSON.stringify(likedSongs));

    // optional backend logging
    fetch("/song/like", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        song_title: song.title,
        liked: !isLiked,
      }),
    }).catch((err) => console.warn("⚠️ Like log failed:", err));
  });

  // helper to refresh button icon
  function updateLikeButton() {
    const song = songs[currentIndex];
    if (!song) return;
    const isLiked = likedSongs.some((s) => s.file === song.file);
    likeBtn.textContent = isLiked ? "❤️" : "♡";
  }

  // ===== AUDIO EVENTS =====
  audio.addEventListener("loadedmetadata", () => {
    durationEl.textContent = formatTime(audio.duration);
    progress.max = Math.floor(audio.duration);
  });

  audio.addEventListener("timeupdate", () => {
    progress.value = Math.floor(audio.currentTime);
    currentTimeEl.textContent = formatTime(audio.currentTime);
  });

  progress.addEventListener("input", () => {
    audio.currentTime = progress.value;
  });

  volume.addEventListener("input", () => {
    audio.volume = volume.value;
  });

  audio.addEventListener("ended", () => {
    if (repeatMode === 2) {
      // repeat one
      audio.currentTime = 0;
      audio.play();
    } else if (isShuffle) {
      playRandom();
    } else if (currentIndex < songs.length - 1) {
      playSong(currentIndex + 1);
    } else if (repeatMode === 1) {
      playSong(0);
    } else {
      isPlaying = false;
      playPauseBtn.textContent = "▶";
    }
  });

  // ===== QUEUE TOGGLE =====
  queueToggle.addEventListener("click", () => {
    queue.classList.toggle("hidden");
  });

  // ===== HELPERS =====
  function highlightPlaying(index) {
    document.querySelectorAll(".song-item").forEach((li, i) => {
      li.classList.toggle("playing", i === index);
    });
  }

  function updateQueueHighlight() {
    queueList.querySelectorAll("li").forEach((li) => {
      li.classList.toggle("playing", Number(li.dataset.index) === currentIndex);
    });
  }

  function playRandom() {
    let next = Math.floor(Math.random() * songs.length);
    if (next === currentIndex) next = (next + 1) % songs.length;
    playSong(next);
  }

  function formatTime(sec) {
    sec = Math.floor(sec);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // ===== INIT =====
  loadSongs();
  console.log(`🎵 Loaded ${songs.length} songs`);
});
