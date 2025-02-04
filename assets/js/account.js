document.getElementById('login-form').addEventListener('submit', function (e) {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  // Mock login process
  if (email && password) {
    // Save user data to localStorage (mock session)
    localStorage.setItem('user', JSON.stringify({ username: 'John Doe', email }));
    window.location.href = 'profile.html'; // Redirect to profile page
  }
});
