//auctionRoutes.js
const express = require('express');
const { createAuction, getAuctions, getAuctionDetails, getAuctionWinners, getUserWins, deleteAuction, getUserCreatedAuctions } = require('../controllers/auctionController');
const { isAuthenticated } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');


const router = express.Router();

router.post('/', isAuthenticated, upload.single('productImage'), createAuction); 
router.get('/', getAuctions); 
router.get('/my-wins', isAuthenticated, getUserWins); 
router.get('/my-auctions', isAuthenticated, getUserCreatedAuctions);
router.get('/winners', getAuctionWinners);
router.get('/:id', getAuctionDetails); 
router.delete('/:id', isAuthenticated, deleteAuction);


module.exports = router;
