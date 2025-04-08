// controllers/userController.js

const { getUserById } = require('../services/userService');

const getUser = async (req, res) => {
    try {
        const userId = req.params.id;
        
        const user = await getUserById(userId);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        res.status(200).json({
            id: user.id,
            name: user.name,
            email: user.email
        });
    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { getUser };