import express from 'express';
import { invest, getInvestments } from '../controllers/investmentController.js';
import  authMiddleware  from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, invest);
router.get('/', authMiddleware, getInvestments);

export default router;
