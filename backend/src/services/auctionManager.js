// services/auctionManager.js
const db = require('../config/database');
const { getSocketInstance } = require('../config/socket');

const startPendingAuctions = async () => {
    try {
        const [auctions] = await db.execute(
            "SELECT id FROM auctions WHERE status = 'pending' AND startTime <= NOW()"
        );

        if (auctions.length > 0) {
            console.log(`🚀 Starting ${auctions.length} pending auctions...`);
            
            const io = getSocketInstance();
            
            for (let auction of auctions) {
                await db.execute("UPDATE auctions SET status = 'active' WHERE id = ?", [auction.id]);
                io.to(auction.id.toString()).emit("auctionStarted", { auctionId: auction.id });
                console.log(`🚀 Auction ${auction.id} started`);
            }
        }
    } catch (error) {
        console.error("❌ Error starting auctions:", error);
    }
};

const endCompletedAuctions = async () => {
    try {
        const [auctions] = await db.execute(
            "SELECT id FROM auctions WHERE status = 'active' AND endTime <= NOW()"
        );

        if (auctions.length > 0) {
            console.log(`🏁 Ending ${auctions.length} completed auctions...`);
            
            const io = getSocketInstance();
            
            for (let auction of auctions) {
                const [bids] = await db.execute(
                    "SELECT bidderId, amount FROM bids WHERE auctionId = ? ORDER BY amount DESC LIMIT 1",
                    [auction.id]
                );
                
                let winnerId = null;
                let finalPrice = null;
                
                if (bids.length > 0) {
                    winnerId = bids[0].bidderId;
                    finalPrice = bids[0].amount;
                    
                    await db.execute(
                        "INSERT INTO winners (auctionId, winnerId, finalAmount) VALUES (?, ?, ?)",
                        [auction.id, winnerId, finalPrice]
                    );

                    await db.execute(
                        "UPDATE auctions SET winnerId = ?, finalPrice = ? WHERE id = ?",
                        [winnerId, finalPrice, auction.id]
                    );
                }
                
                await db.execute("UPDATE auctions SET status = 'ended' WHERE id = ?", [auction.id]);
                
                io.to(auction.id.toString()).emit("auctionEnded", { 
                    auctionId: auction.id,
                    winnerId,
                    finalPrice
                });
                
                console.log(`🏁 Auction ${auction.id} ended. Winner: ${winnerId || 'None'}`);
            }
        }
    } catch (error) {
        console.error("❌ Error ending auctions:", error);
    }
};

const startAuctionScheduler = () => {
    console.log("📅 Starting auction scheduler...");
    
    startPendingAuctions();
    endCompletedAuctions();
    
    return setInterval(() => {
        startPendingAuctions();
        endCompletedAuctions();
    }, 1000); 
};

const stopAuctionScheduler = (schedulerInterval) => {
    if (schedulerInterval) {
        clearInterval(schedulerInterval);
        console.log("📅 Auction scheduler stopped");
    }
};

module.exports = { 
    startAuctionScheduler,
    stopAuctionScheduler 
};