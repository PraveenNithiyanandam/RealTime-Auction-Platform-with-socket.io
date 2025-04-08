// services/bidService.js
const db = require('../config/database');

const placeBidDB = async (auctionId, bidderId, amount) => {
    try {
        const [result] = await db.execute(
            'INSERT INTO bids (auctionId, bidderId, amount) VALUES (?, ?, ?)',
            [auctionId, bidderId, amount]
        );
        
        return {
            id: result.insertId,
            auctionId,
            bidderId,
            amount
        };
    } catch (error) {
        throw error;
    }
};

const getBidsByAuctionId = async (auctionId) => {
    try {
      const [rows] = await db.query(
        `SELECT b.id, b.auctionId as auctionId, b.bidderId as bidderId, 
        b.amount, b.created_at as timestamp, u.name as bidderName
        FROM bids b
        JOIN users u ON b.bidderId = u.id
        WHERE b.auctionId = ?
        ORDER BY b.created_at DESC`,
        [auctionId]
      );
      return rows;
    } catch (error) {
      console.error("Database error:", error);
      throw new Error("Failed to fetch bids");
    }
  };

module.exports = { placeBidDB, getBidsByAuctionId };