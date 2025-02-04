function validateRegistration(data) {
    const { name, email, password } = data;
    if (!name || !email || !password) return 'All fields are required.';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format.';
    if (password.length < 8) return 'Password must be at least 8 characters long.';
    return null;
}

module.exports = { validateRegistration };
