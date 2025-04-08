// src/api/auctions.js
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const getAuctions = async () => {
    try {
        const response = await fetch(`${API_URL}/auctions`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch auctions');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const getAuctionById = async (auctionId) => {
    try {
        const response = await fetch(`${API_URL}/auctions/${auctionId}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch auction details');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const createAuction = async (auctionData, token) => {
    try {
        const formData = new FormData();
        
        formData.append('title', auctionData.title);
        formData.append('description', auctionData.description);
        formData.append('startingPrice', auctionData.startingPrice);
        formData.append('currentPrice', auctionData.startingPrice);
        formData.append('startTime', auctionData.startTime);
        formData.append('endTime', auctionData.endTime);
        
        if (auctionData.productImage) {
            formData.append('productImage', auctionData.productImage);
        }

        const response = await fetch(`${API_URL}/auctions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData, 
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to create auction');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const getAuctionWinners = async () => {
    try {
        const response = await fetch(`${API_URL}/auctions/winners`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch auction winners');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const getUserWins = async (token) => {
    try {
        const response = await fetch(`${API_URL}/auctions/my-wins`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch your wins');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const getUserCreatedAuctions = async (token) => {
    try {
        const response = await fetch(`${API_URL}/auctions/my-auctions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to fetch your auctions');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const deleteAuction = async (auctionId, token) => {
    try {
        const response = await fetch(`${API_URL}/auctions/${auctionId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to delete auction');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};