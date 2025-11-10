async function createPlaylist() {
  const name = document.getElementById('playlistName').value;
  const res = await fetch('/playlist/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  const data = await res.json();
  alert(data.message);
  loadPlaylists();
}

async function loadPlaylists() {
  const res = await fetch('/playlist/all');
  const playlists = await res.json();
  const list = document.getElementById('playlistList');
  list.innerHTML = '';
  playlists.forEach(p => {
    const li = document.createElement('li');
    li.textContent = p.name;
    list.appendChild(li);
  });
}

window.onload = loadPlaylists;
