// routes/tradingBotRoutes.js
import express from "express";
import { getTradingBotStatus, linkBot, unlinkBot } from "../controllers/tradingBotController.js";

const router = express.Router();

router.get("/status/:id", getTradingBotStatus);
router.post("/link", linkBot);
router.post("/unlink", unlinkBot);

export default router; // ✅ Make sure this line exists
