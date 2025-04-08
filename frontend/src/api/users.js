// src/api/users.js
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getUserById = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/users/${userId}`);
        
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch user');
        }
        
        return await response.json();
    } catch (error) {
        console.error('Error in getUserById:', error);
        throw error;
    }
};