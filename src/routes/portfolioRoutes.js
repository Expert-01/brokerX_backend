import express from 'express';
import { getPortfolio } from '../controllers/portfolioController.js';

const router = express.Router();
router.get('/:userId', getPortfolio);

export default router;
