// src/services/userService.js
const db = require('../config/database');

const createUser = async (name, email, hashedPassword) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
            [name, email, hashedPassword]
        );
        return result;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

const getUserByEmail = async (email) => {
    try {
        const [rows] = await db.execute(
            'SELECT * FROM users WHERE email = ?',
            [email]
        );
        return rows[0];
    } catch (error) {
        console.error('Error getting user:', error);
        throw error;
    }
};

const getUserById = async (id) => {
    try {
        const [rows] = await db.execute(
            'SELECT id, name, email FROM users WHERE id = ?',
            [id]
        );
        return rows[0];
    } catch (error) {
        console.error('Error getting user by ID:', error);
        throw error;
    }
};

module.exports = { createUser, getUserByEmail, getUserById };