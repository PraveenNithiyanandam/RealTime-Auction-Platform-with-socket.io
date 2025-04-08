// src/config/socket.js
const { Server } = require("socket.io");

let io = null; 

const initSocket = (server) => {
  if (!server) {
    throw new Error("Server instance is required to initialize WebSocket!");
  }

  io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"]
    }
  });

  console.log(" WebSocket initialized");
  
  return io;
};

const getSocketInstance = () => {
  if (!io) {
    console.error(" Attempted to access Socket.IO before initialization!");
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

module.exports = { initSocket, getSocketInstance };