import express from 'express';
import { getUser } from '../controllers/getUserController.js';
import { getUserBalances } from '../controllers/userController.js';

const router = express.Router();

router.get('/:userId', getUser);
router.get('/:userId/balances', getUserBalances);

export default router;
