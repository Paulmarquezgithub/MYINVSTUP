-- Create the Users Table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,         -- Auto-incremented unique ID
    name VARCHAR(100) NOT NULL,    -- User's name
    email VARCHAR(100) UNIQUE NOT NULL, -- User's email, must be unique
    password VARCHAR(255) NOT NULL, -- Hashed password
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Timestamp of creation
);

-- Insert a Sample User (optional)
-- Hash the password first using bcrypt before inserting
INSERT INTO users (name, email, password)
VALUES 
('Paul Marquez', 'paul.marquez@ieseg.fr', '$2b$10$Kix5jF1xM0xFlkGuHqJQeOcYqQhKQKgf8v5bdf5e1Gfu5HJ3o4nSu'); -- Replace with an actual hashed password

-- Verify the table structure and data
SELECT * FROM users;
