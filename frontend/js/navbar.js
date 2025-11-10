(function injectNavbar(){
  const navbar = document.createElement('div');
  navbar.className = 'navbar';
  navbar.innerHTML = `
    <div style="display:flex;align-items:center;gap:12px">
      <a href="index.html" style="text-decoration:none"><div class="brand">Lyrica</div></a>
    </div>
    <div class="nav-actions" id="navActions">
      <a class="btn-ghost" href="index.html">Home</a>
      <a class="btn-ghost" href="dashboard.html">Dashboard</a>
      <a class="btn-ghost" href="playlists.html">Playlists</a>
      <a class="btn-ghost" href="profile.html">Profile</a>
      <button class="btn-ghost" id="logoutBtn">Logout</button>
    </div>
  `;
  document.body.insertBefore(navbar, document.body.firstChild);

  document.getElementById('logoutBtn').addEventListener('click', async () => {
    const res = await apiRequest('/auth/logout', 'POST');
    if (res && (res.message || res.success)) {
      alert(res.message || 'Logged out');
      window.location.href = 'login.html';
    } else {
      alert(res.error || 'Logout failed');
    }
  });

})();
