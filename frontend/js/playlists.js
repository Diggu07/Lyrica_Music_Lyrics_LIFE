document.addEventListener('DOMContentLoaded', async () => {
  const res = await apiRequest('/playlists');
  if (res && res.error) {
    alert('Please login to view playlists.');
    window.location.href = 'login.html';
    return;
  }
  const grid = document.getElementById('playlistsGrid');
  const lists = res.playlists || [];
  if (!lists.length) {
    grid.innerHTML = '<div class="card glass"><p class="muted">No playlists yet.</p></div>';
    return;
  }
  grid.innerHTML = '';
  lists.forEach(pl => {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `<h3>${pl.name || 'Untitled'}</h3>
                      <p class="muted">Songs: ${pl.songs ? pl.songs.length : 0}</p>`;
    grid.appendChild(card);
  });
});
