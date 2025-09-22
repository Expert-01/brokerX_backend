import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
//import './roiCron.js';

dotenv.config();

// Create HTTP server from Express app
const server = http.createServer(app);

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  }
});

// Attach io to app so controllers can access it
app.set('io', io);

// WebSocket logic
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  setInterval(() => {
    const price = (Math.random() * 10000).toFixed(2);
    socket.emit('priceUpdate', { asset: 'BTC', price });
  }, 1000);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
