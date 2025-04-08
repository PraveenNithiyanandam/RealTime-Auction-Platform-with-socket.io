// src/routes/bidRoutes.js
const express = require('express');
const { placeBid, getBidsByAuction } = require('../controllers/bidController');
const { isAuthenticated } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/place-bid', isAuthenticated, placeBid);
router.get('/auction/:auctionId', getBidsByAuction); 


module.exports = router;
