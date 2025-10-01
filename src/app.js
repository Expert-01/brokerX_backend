import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import authRoutes from './routes/authRoutes.js';
import depositRoutes from './routes/depositRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import investmentRoutes from './routes/investmentRoutes.js';
import getUserRoutes from './routes/getUserRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import marketRoutes from './routes/marketRoutes.js';
dotenv.config();

const app = express();

// CORS middleware
app.use(cors({
  origin: [process.env.LOCAL_URL, process.env.PUBLIC_URL],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// JSON parsing middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/deposit', depositRoutes);
app.use('/api/investment', investmentRoutes);
//app.use('/api/admin/deposits', depositRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', getUserRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/market', marketRoutes);




import withdrawRoutes from './routes/withdrawRoutes.js';
import balanceHistoryRoutes from './routes/balanceHistoryRoutes.js';
import portfolioRoutes from './routes/portfolioRoutes.js';
app.use('/api/withdraw', withdrawRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/balance-history', balanceHistoryRoutes);

// Test route
app.get('/api/test', (req, res) => {
  console.log('Frontend just pinged me');
  res.json({ message: 'Backend just pinged me' });
});

// Logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
});

export default app;
