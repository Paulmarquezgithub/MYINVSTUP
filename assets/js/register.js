document.getElementById('register-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(`Server responded with ${response.status}: ${data.message}`);
        }

        const data = await response.json();
        alert('Registration successful!');
        window.location.href = 'profile.html';
    } catch (error) {
        console.error('Error Details:', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });
        alert(`An error occurred during registration: ${error.message}`);
    }
});