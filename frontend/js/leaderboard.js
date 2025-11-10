async function loadLeaderboard() {
  const res = await fetch('/songs/leaderboard');
  const songs = await res.json();
  const div = document.getElementById('leaderboard');
  div.innerHTML = songs.map((s, i) => `
    <p>${i + 1}. ${s.song_title} <small>(${s.play_count} plays)</small></p>
  `).join('');
}

async function loadRecent() {
  const res = await fetch('/songs/recent');
  const recent = await res.json();
  const div = document.getElementById('recent');
  div.innerHTML = recent.map(r => `
    <p>${r.song_title} <small>${new Date(r.played_at).toLocaleString()}</small></p>
  `).join('');
}

window.onload = () => {
  loadLeaderboard();
  loadRecent();
};
