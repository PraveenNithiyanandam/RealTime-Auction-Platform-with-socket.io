//auctionContoller.js
const moment = require("moment");
const { 
    createAuctionDB, 
    getAllAuctions, 
    getAuctionById, 
    uploadProductImage,
    deleteAuctionDB
} = require('../services/auctionService');
const db = require('../config/database');

const createAuction = async (req, res) => {
    const { title, description, startingPrice, currentPrice, startTime, endTime } = req.body;

    const formattedStartTime = moment(startTime).format("YYYY-MM-DD HH:mm:ss");
    const formattedEndTime = moment(endTime).format("YYYY-MM-DD HH:mm:ss");

    try {
        let imageUrl = null;
        if (req.file) {
            imageUrl = await uploadProductImage(req.file);
        }

        const auction = await createAuctionDB(
            req.user.id, 
            title, 
            description, 
            startingPrice, 
            currentPrice, 
            formattedStartTime, 
            formattedEndTime,
            imageUrl
        );

        res.status(201).json({ 
            message: 'Auction created successfully', 
            auction 
        });
    } catch (error) {
        console.error('Auction creation error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getAuctions = async (req, res) => {
    try {
        const auctions = await getAllAuctions();
        res.status(200).json(auctions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAuctionDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const auction = await getAuctionById(id);
        if (!auction) return res.status(404).json({ message: 'Auction not found' });

        res.status(200).json(auction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getAuctionWinners = async (req, res) => {
    try {
        const [winners] = await db.execute(`
            SELECT w.id, w.auctionId, w.winnerId, w.finalAmount,
                   a.title as auctionTitle, a.endTime,
                   u.name as winnerName
            FROM winners w
            JOIN auctions a ON w.auctionId = a.id
            JOIN users u ON w.winnerId = u.id
            ORDER BY a.endTime DESC
        `);
        
        res.status(200).json(winners);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getUserWins = async (req, res) => {
    try {
        const userId = req.user.id; 
        
        const [userWins] = await db.execute(`
            SELECT w.id, w.auctionId, w.winnerId, w.finalAmount,
                   a.title as auctionTitle, a.endTime, a.description,
                   u.name as sellerName
            FROM winners w
            JOIN auctions a ON w.auctionId = a.id
            JOIN users u ON a.sellerId = u.id
            WHERE w.winnerId = ?
            ORDER BY a.endTime DESC
        `, [userId]);
        
        res.status(200).json(userWins);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteAuction = async (req, res) => {
    const { id } = req.params;
    
    try {
        await deleteAuctionDB(id, req.user.id);

        res.status(200).json({ 
            message: 'Auction deleted successfully' 
        });
    } catch (error) {
        console.error('Auction deletion error:', error);
        
        if (error.message.includes('not found or you do not have permission')) {
            return res.status(403).json({ message: error.message });
        }
        
        if (error.message.includes('existing bids')) {
            return res.status(400).json({ message: error.message });
        }
        
        res.status(500).json({ message: error.message });
    }
};

const getUserCreatedAuctions = async (req, res) => {
    try {
        const userId = req.user.id;
        
        const [auctions] = await db.execute(`
            SELECT * FROM auctions 
            WHERE sellerId = ? 
            ORDER BY createdAt DESC
        `, [userId]);
        
        res.status(200).json(auctions);
    } catch (error) {
        console.error('Error fetching user auctions:', error);
        res.status(500).json({ message: error.message });
    }
};


module.exports = { 
    createAuction, 
    getAuctions, 
    getAuctionDetails, 
    getAuctionWinners,
    getUserWins,
    deleteAuction,
    getUserCreatedAuctions
};
