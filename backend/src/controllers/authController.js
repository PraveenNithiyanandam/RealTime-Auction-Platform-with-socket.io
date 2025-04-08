// src/controllers/authController.js
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../services/userService');
const generateToken = require('../utils/jwt');

const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const newUser = await createUser(name, email, hashedPassword);
        
        const token = generateToken({ id: newUser.insertId, email });
        
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error during registration' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = generateToken({ id: user.id, email: user.email });
        
        res.status(200).json({ message: 'Login successful', token });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = { register, login };