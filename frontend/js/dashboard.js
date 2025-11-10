document.addEventListener('DOMContentLoaded', async () => {
  const res = await apiRequest('/dashboard');
  if (res && res.error) {
    alert('Please login to access the dashboard.');
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('welcome').innerText = `Welcome, ${res.user.username || 'user'}`;
  document.getElementById('playlistsCount').innerText = res.stats.playlists ?? 0;
  document.getElementById('likedCount').innerText = res.stats.liked_songs ?? 0;
  document.getElementById('historyCount').innerText = res.stats.listening_history ?? 0;

  const user = res.user;
  const userInfo = document.getElementById('userInfo');
  
  userInfo.innerHTML = `
  <div class="info-grid">
    <div><strong>Username:</strong> ${user.username || '—'}</div>
    <div><strong>Email:</strong> ${user.email || '—'}</div>
    <div><strong>Full Name:</strong> ${
  user.full_name ||
  user.name ||
  user.fullname ||
  (user.first_name && user.last_name ? `${user.first_name} ${user.last_name}` : user.first_name || user.last_name || '—')
}</div>
    <div><strong>Joined:</strong> ${user.created_at ? new Date(user.created_at).toLocaleDateString() : '—'}</div>
    <div><strong>Subscription:</strong> ${user.plan || 'Free'}</div>
    <div><strong>Status:</strong> <span class="ok">${user.is_active ? 'Active' : 'Inactive'}</span></div>

  </div>
`;

  document.getElementById('rawUser').innerText = JSON.stringify(user, null, 2);
});

// ===== Dashboard Counters =====
document.addEventListener("DOMContentLoaded", async () => {
  const likedCountEl = document.getElementById("likedCount");
  const historyCountEl = document.getElementById("historyCount");

  // ❤️ Liked Songs
  try {
    const likedRes = await fetch("/songs/liked");
    const likedData = await likedRes.json();
    likedCountEl.textContent = Array.isArray(likedData) ? likedData.length : 0;
  } catch (e) {
    const localLiked = JSON.parse(localStorage.getItem("likedSongs") || "[]");
    likedCountEl.textContent = localLiked.length;
  }

  // 🎧 Listening History
  try {
    const historyRes = await fetch("/songs/recent");
    const historyData = await historyRes.json();
    console.log("🎧 Recent data:", historyData); // debug
    historyCountEl.textContent = Array.isArray(historyData) ? historyData.length : 0;
  } catch (e) {
    console.warn("⚠️ Could not fetch /songs/recent:", e);
    historyCountEl.textContent = "0";
  }
});
