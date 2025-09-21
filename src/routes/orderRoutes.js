// routes/orderRoutes.js
import express from 'express';
const router = express.Router();
import orderController from '../controllers/orderController.js';


router.post('/', orderController.placeOrder);
router.get('/:userId', orderController.getOrders);

export default router;
