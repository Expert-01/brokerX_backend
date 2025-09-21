



// routes/tradeRoutes.js
import express from "express";
import { openTrade, closeTrade, getOpenTrades, getTradeHistory } from "../controllers/tradeController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/open", authMiddleware, openTrade);
router.post("/close/:id", authMiddleware, closeTrade);
router.get("/open", authMiddleware, getOpenTrades);
router.get("/history", authMiddleware, getTradeHistory);

export default router;



