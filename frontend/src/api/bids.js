// src/api/bids.js
const API_URL = `${import.meta.env.VITE_API_URL}/api`;

export const placeBid = async (bidData, token) => {
    try {
        const response = await fetch(`${API_URL}/bids/place-bid`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(bidData),
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Failed to place bid');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const getBidsByAuctionId = async (auctionId) => {
    try {
      const response = await fetch(`${API_URL}/bids/auction/${auctionId}`);
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch bids');
      }
      
      return data;
    } catch (error) {
      throw error;
    }
  };