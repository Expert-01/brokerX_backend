import app from './src/app.js';
import dotenv from 'dotenv';
import express from 'express';

dotenv.config();

app.use(express.json());
import './roiCron.js';
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

