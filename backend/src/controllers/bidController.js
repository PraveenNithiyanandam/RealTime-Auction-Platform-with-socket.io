// controllers/bidController.js
const { placeBidDB, getBidsByAuctionId } = require('../services/bidService'); 
const { updateAuctionPriceAndBidder } = require('../services/auctionService');
const { getSocketInstance } = require('../config/socket');
const { validateBid } = require('../utils/bidValidation');
const { getUserById } = require('../services/userService');
const db = require('../config/database');

const placeBid = async (req, res) => {
    const { auctionId, amount } = req.body;
    const bidderId = req.user.id;

    try {
        const validation = await validateBid(db, auctionId, bidderId, amount);
        
        if (!validation.valid) {
            return res.status(400).json({ 
                message: validation.message,
                currentPrice: validation.currentPrice 
            });
        }

        const bid = await placeBidDB(auctionId, bidderId, amount);
        
        await updateAuctionPriceAndBidder(auctionId, amount, bidderId);

        const bidder = await getUserById(bidderId);

        try {
            const io = getSocketInstance();
            io.to(auctionId).emit("newBid", { 
                auctionId, 
                bidderId, 
                bidderName: bidder.name, 
                amount 
            });
        } catch (error) {
            console.error("Socket error when emitting bid:", error.message);
        }

        res.status(201).json({ 
            message: 'Bid placed successfully', 
            bid, 
            currentPrice: amount,
            bidderName: bidder.name 
        });
    } catch (error) {
        res.status(500).json({ message: 'Error placing bid', error: error.message });
    }
};

const getBidsByAuction = async (req, res) => {
    const { auctionId } = req.params;
  
    try {
      const bids = await getBidsByAuctionId(auctionId);
      res.status(200).json(bids);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching bids', error: error.message });
    }
};

module.exports = { placeBid, getBidsByAuction };