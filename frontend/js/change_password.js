// Change password page
document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('changePasswordForm');
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const current_password = document.getElementById('current_password').value;
    const new_password = document.getElementById('new_password').value;
    const new_password2 = document.getElementById('new_password2').value;
    if (new_password !== new_password2) {
      alert('New passwords do not match');
      return;
    }
    const res = await apiRequest('/auth/change_password', 'POST', { current_password, new_password, new_password2 });
    if (res && res.message) {
      alert(res.message);
      window.location.href = 'profile.html';
    } else {
      alert(res.error || 'Password change failed');
    }
  });
});
