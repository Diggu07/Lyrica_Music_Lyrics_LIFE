document.addEventListener('DOMContentLoaded', async () => {
  const res = await apiRequest('/auth/profile');
  if (res && res.error) {
    alert('Please login to view profile.');
    window.location.href = 'login.html';
    return;
  }
  const user = res.user;
  document.getElementById('first_name').value = user.first_name || '';
  document.getElementById('last_name').value = user.last_name || '';
  document.getElementById('username').value = user.username || '';
  if (user.date_of_birth) {
    document.getElementById('date_of_birth').value = user.date_of_birth;
  }
  if (user.gender) {
    document.getElementById('gender').value = user.gender;
  }

  document.getElementById('profileForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
      first_name: document.getElementById('first_name').value.trim(),
      last_name: document.getElementById('last_name').value.trim(),
      username: document.getElementById('username').value.trim(),
      date_of_birth: document.getElementById('date_of_birth').value,
      gender: document.getElementById('gender').value
    };
    const r = await apiRequest('/auth/profile', 'POST', payload);
    if (r && r.message) {
      alert('Profile updated!');
      window.location.reload();
    } else {
      alert(r.error || 'Update failed');
    }
  });
});
