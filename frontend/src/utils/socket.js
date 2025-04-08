// src/utils/socket.js
import { io } from 'socket.io-client';

let socket = null;

export const connectSocket = () => {
    if (!socket) {
        socket = io('http://localhost:5000');
        socket.on('connect', () => {
            console.log('Connected to WebSocket server');
        });
        
        socket.on('error', (error) => {
            console.error('Socket error:', error);
        });
    }
    return socket;
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const joinAuctionRoom = (auctionId) => {
    if (socket) {
        socket.emit('joinAuction', { auctionId });
    }
};

export const getSocketInstance = () => {
    if (!socket) {
        return connectSocket();
    }
    return socket;
};