// src/utils/bidValidation.js
const validateBid = async (db, auctionId, bidderId, amount) => {
    const [auctions] = await db.execute(
        'SELECT sellerId, currentPrice, highestBidderId, status, endTime FROM auctions WHERE id = ?',
        [auctionId]
    );
    
    if (!auctions.length) {
        return { valid: false, message: "Auction not found" };
    }
    
    const auction = auctions[0];
    
    if (auction.sellerId === bidderId) {
        return { valid: false, message: "You cannot bid on your own auction" };
    }
    
    if (auction.status !== 'active') {
        return { valid: false, message: "Auction is not active" };
    }
    
    if (new Date() >= new Date(auction.endTime)) {
        return { valid: false, message: "Auction has already ended" };
    }
    
    if (auction.highestBidderId === bidderId) {
        return { valid: false, message: "You are already the highest bidder" };
    }
    
    if (amount <= auction.currentPrice) {
        return { valid: false, message: "Bid must be higher than current price", currentPrice: auction.currentPrice };
    }
    
    return { valid: true, auction };
};

class RateLimiter {
    constructor(limit, interval) {
        this.limit = limit; 
        this.interval = interval; 
        this.tokens = new Map();
    }
    
    consume(userId) {
        const now = Date.now();

        if (!this.tokens.has(userId)) {
            this.tokens.set(userId, { count: this.limit - 1, lastRefill: now });
            return true;
        }

        const tokenData = this.tokens.get(userId);
        const elapsedTime = now - tokenData.lastRefill;
        const refillTokens = Math.floor(elapsedTime / (this.interval / this.limit));

        if (refillTokens > 0) {
            tokenData.count = Math.min(this.limit, tokenData.count + refillTokens);
            tokenData.lastRefill = now;
        }

        if (tokenData.count > 0) {
            tokenData.count--;
            return true;
        }

        return false;
    }
}

const rateLimiter = new RateLimiter(5, 10000); 

module.exports = { validateBid, rateLimiter };