import express from 'express';
import { signup, login } from "../controllers/authController.js";
import authMiddleware from '../middlewares/authMiddleware.js';
//import { message } from 'statuses';
const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

export default router;