// services/socketService.js
const db = require("../config/database");
const { validateBid } = require("../utils/bidValidation");

const setupAuctionSockets = (io) => {
  if (!io) {
    console.error("❌ WebSocket setup failed: io is undefined!");
    return;
  }

  io.on("connection", (socket) => {
    console.log(`🔌 New client connected: ${socket.id}`);

    socket.on("joinAuction", async ({ auctionId }) => {
      if (!auctionId) {
        console.error("❌ joinAuction error: Missing auctionId");
        socket.emit("error", { message: "Invalid auction data!" });
        return;
      }

      try {
        const [auctions] = await db.execute(
          "SELECT status, endTime FROM auctions WHERE id = ?",
          [auctionId]
        );

        if (!auctions.length) {
          socket.emit("error", { message: "Auction does not exist." });
          return;
        }

        const auction = auctions[0];
        const currentTime = new Date();

        socket.join(auctionId.toString());
        socket.emit("joinedAuction", {
          auctionId,
          active:
            auction.status === "active" &&
            currentTime < new Date(auction.endTime),
          message: "Successfully joined auction room.",
        });
      } catch (error) {
        console.error("❌ joinAuction database error:", error);
        socket.emit("error", {
          message: "Database error. Please try again later.",
        });
      }
    });

    socket.on("placeBid", async ({ auctionId, bidderId, amount }) => {
      console.log("🔄 Received bid:", { auctionId, bidderId, amount });

      if (!auctionId || !bidderId || !amount) {
        socket.emit("bidRejected", { message: "Invalid bid data.", auctionId });
        return;
      }

      try {
        const [auctions] = await db.execute(
          "SELECT sellerId FROM auctions WHERE id = ?",
          [auctionId]
        );

        if (auctions.length && auctions[0].sellerId === bidderId) {
          socket.emit("bidRejected", {
            message: "You cannot bid on your own auction",
            auctionId,
          });
          return;
        }

        const [bidders] = await db.execute(
          "SELECT name, email FROM users WHERE id = ?",
          [bidderId]
        );

        const bidder = bidders[0];
        const bidderName =
          bidder?.name ||
          (bidder?.email ? bidder.email.split("@")[0] : "Anonymous");

        const validation = await validateBid(db, auctionId, bidderId, amount);

        if (!validation.valid) {
          socket.emit("bidRejected", {
            message: validation.message,
            auctionId,
            currentPrice: validation.currentPrice,
          });
          return;
        }

        await db.execute(
          "INSERT INTO bids (auctionId, bidderId, amount) VALUES (?, ?, ?)",
          [auctionId, bidderId, amount]
        );

        await db.execute(
          "UPDATE auctions SET currentPrice = ?, highestBidderId = ? WHERE id = ?",
          [amount, bidderId, auctionId]
        );

        console.log(
          `💰 New highest bid: ₹${amount} by User ${bidderId} in Auction ${auctionId}`
        );

        io.to(auctionId.toString()).emit("newBid", {
          auctionId,
          bidderId,
          amount,
          bidderName,
        });
      } catch (error) {
        console.error("❌ Error processing bid:", error);
        socket.emit("bidRejected", {
          message: "Error processing bid. Try again later.",
          auctionId,
        });
      }
    });

    socket.on("disconnect", () => {
      console.log(`🔴 Client disconnected: ${socket.id}`);
    });
  });
};

module.exports = { setupAuctionSockets };
