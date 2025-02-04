const bcrypt = require('bcrypt');

// Function to hash a password
const hashPassword = async (password) => {
    const saltRounds = 10; // Number of salt rounds for hashing
    return await bcrypt.hash(password, saltRounds);
};

// Function to compare passwords
const comparePassword = async (plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
};

module.exports = { hashPassword, comparePassword };
