import express from 'express';
import { getUser } from '../controllers/getUserController.js';
import { getUserBalances } from '../controllers/userController.js';

const router = express.Router();


import { getUserBalance } from '../controllers/userController.js';

router.get('/:userId', getUser);
router.get('/:userId/balances', getUserBalances);
router.get('/:userId/balance', getUserBalance);

export default router;
