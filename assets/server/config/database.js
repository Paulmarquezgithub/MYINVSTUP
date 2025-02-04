const { Pool } = require('pg'); 

const pool = new Pool({
    user: 'postgres',               // Your PostgreSQL username
    host: 'localhost',              // Your database host
    database: 'my_app_db',          // The database name you created
    password: 'Petitchat15$',   // Replace with your actual PostgreSQL password
    port: 5432,                     // Default PostgreSQL port
});

// Log successful connections
pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database.');
});

// Handle connection errors
pool.on('error', (err) => {
    console.error('Unexpected error on idle client:', err);
    process.exit(-1);
});

// Test the database connection by querying the current time
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Database connected at:', res.rows[0].now);
    }
});

module.exports = pool;

