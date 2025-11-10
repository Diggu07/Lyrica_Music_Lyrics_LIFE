// Handles login and register actions (used by login.html and register.html)
document.addEventListener('DOMContentLoaded', () => {

  async function apiRequest(endpoint, method = 'GET', data = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include'
      };

      if (data) options.body = JSON.stringify(data);

      const response = await fetch(endpoint, options);
      const result = await response.json();
      return result;
    } catch (error) {
      console.error('API request failed:', error);
      return { error: 'Network error: Failed to connect to server' };
    }
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value;

      if (!email || !password) {
        alert('Please enter both email and password.');
        return;
      }

      const res = await apiRequest('/auth/login', 'POST', { email, password });

      if (res && res.success) {
        alert('✅ Login successful!');
        window.location.href = 'dashboard.html';
      } else {
        alert(`❌ ${res.error || 'Login failed. Check your credentials.'}`);
      }
    });
  }

  const regForm = document.getElementById('registerForm');
  if (regForm) {
    regForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const payload = {
        username: document.getElementById('username').value.trim(),
        email: document.getElementById('email').value.trim(),
        password: document.getElementById('password').value,
        first_name: document.getElementById('first_name')?.value.trim() || '',
        last_name: document.getElementById('last_name')?.value.trim() || ''
      };

      if (!payload.username || !payload.email || !payload.password) {
        alert('Please fill in all required fields.');
        return;
      }

      const res = await apiRequest('/auth/register', 'POST', payload);

      if (res && res.success) {
        alert('🎉 Registered successfully! You can now log in.');
        window.location.href = 'login.html';
      } else {
        alert(`⚠️ ${res.error || 'Registration failed. Please try again.'}`);
      }
    });
  }

});
