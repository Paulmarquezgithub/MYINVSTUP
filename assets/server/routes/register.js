const express = require('express');
const bcrypt = require('bcrypt'); // To hash passwords
const pool = require('../config/database'); // Import database connection
const { validateRegistration } = require('../helpers/validation'); // Validation helper
const router = express.Router();

// Registration Endpoint
router.post('/', async (req, res) => {
    const { name, email, password } = req.body;

    // Validate input
    const validationError = validateRegistration(req.body);
    if (validationError) {
        return res.status(400).json({ message: validationError });
    }

    try {
        // Check if the email already exists
        const userExists = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        const result = await pool.query(
            'INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING id, name, email',
            [name, email, hashedPassword]
        );

        // Log successful registration
        console.log('User registered:', result.rows[0]);

        // Send a success response
        res.status(201).json({
            message: 'User registered successfully.',
            user: result.rows[0],
        });
    } catch (error) {
        console.error('Error during registration:', error);

        // Handle unique constraint violation (duplicate email)
        if (error.code === '23505') {
            return res.status(400).json({ message: 'Email already exists.' });
        }

        // General server error
        res.status(500).json({ message: 'Internal server error.' });
    }
});

module.exports = router;