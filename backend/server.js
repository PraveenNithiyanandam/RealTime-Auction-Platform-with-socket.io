//server.js
const http = require("http");
const app = require("./src/app");
const { initSocket } = require("./src/config/socket"); 
const { setupAuctionSockets } = require("./src/services/socketService");
const { startAuctionScheduler } = require("./src/services/auctionManager");

const PORT = process.env.PORT || 5000;
const server = http.createServer(app); 

const io = initSocket(server);

server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
  try {
    setupAuctionSockets(io);
    console.log(" Auction sockets initialized");
    
    startAuctionScheduler();
    console.log(" Auction scheduler initialized");

  } catch (error) {
    console.error(" Server initialization failed:", error.message);
  }
});
