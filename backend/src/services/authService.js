// services/authService.js
const bcrypt = require('bcryptjs');
const { createUser, getUserByEmail } = require('../services/userService');
const generateToken = require('../utils/jwt');

const registerUser = async (name, email, password) => {
    const existingUser = await getUserByEmail(email);
    if (existingUser) throw new Error('Email already in use');

    const hashedPassword = await bcrypt.hash(password, 10);
    await createUser(name, email, hashedPassword);

    return generateToken({ name, email }); 
};

const loginUser = async (email, password) => {
    const user = await getUserByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return generateToken(user);
};

module.exports = { registerUser, loginUser };
