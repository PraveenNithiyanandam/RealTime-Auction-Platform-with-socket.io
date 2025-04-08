//auctionService.js
const db = require('../config/database');
const cloudinary = require('../config/cloudinary');


const createAuctionDB = async (sellerId, title, description, startingPrice, currentPrice, startTime, endTime, imageUrl) => {
    const sql = `INSERT INTO auctions (sellerId, title, description, startingPrice, currentPrice, status, startTime, endTime, productImage) 
                 VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`;
    const values = [sellerId, title, description, startingPrice, currentPrice, startTime, endTime, imageUrl];

    const [result] = await db.execute(sql, values);
    return { 
        id: result.insertId, 
        sellerId, 
        title, 
        description, 
        startingPrice, 
        currentPrice, 
        startTime, 
        endTime, 
        productImage: imageUrl 
    };
};

const getAllAuctions = async () => {
    const [rows] = await db.execute('SELECT * FROM auctions ORDER BY createdAt DESC');
    return rows;
};

const getAuctionById = async (auctionId) => {
    const [rows] = await db.execute('SELECT * FROM auctions WHERE id = ?', [auctionId]);
    return rows[0] || null;
};

const updateAuctionPriceAndBidder = async (auctionId, amount, bidderId) => {
    const sql = 'UPDATE auctions SET currentPrice = ?, highestBidderId = ? WHERE id = ?';
    const values = [amount, bidderId, auctionId];
    
    const [result] = await db.execute(sql, values);
    return result;
};

const uploadProductImage = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { 
                folder: 'auction_products',
                allowed_formats: ['jpg', 'png', 'jpeg', 'gif', 'webp'],
                transformation: [
                    { width: 800, height: 600, crop: "limit" }
                ]
            }, 
            (error, result) => {
                if (error) reject(error);
                else resolve(result.secure_url);
            }
        ).end(file.buffer);
    });
};

const deleteAuctionDB = async (auctionId, sellerId) => {
    const [checkResult] = await db.execute(
        'SELECT * FROM auctions WHERE id = ? AND sellerId = ?', 
        [auctionId, sellerId]
    );

    if (checkResult.length === 0) {
        throw new Error('Auction not found or you do not have permission to delete');
    }

    const [bidCheck] = await db.execute(
        'SELECT COUNT(*) as bidCount FROM bids WHERE auctionId = ?', 
        [auctionId]
    );

    if (bidCheck[0].bidCount > 0) {
        throw new Error('Cannot delete auction with existing bids');
    }

    const [result] = await db.execute(
        'DELETE FROM auctions WHERE id = ?', 
        [auctionId]
    );

    return result;
};

module.exports = { 
    createAuctionDB, 
    getAllAuctions, 
    getAuctionById,
    updateAuctionPriceAndBidder,
    uploadProductImage,
    deleteAuctionDB
};