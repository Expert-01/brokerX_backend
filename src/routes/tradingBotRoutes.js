import express from "express";
import {
  linkBotToUser,
  unlinkBotFromUser,
  getBotStatus,
  simulateTrade,
} from "../controllers/tradingBotController.js";

const router = express.Router();

router.post("/link", linkBotToUser);
router.post("/unlink", unlinkBotFromUser);
router.get("/status/:userId", getBotStatus);
router.post("/simulate/:userId", simulateTrade);

export default router;
