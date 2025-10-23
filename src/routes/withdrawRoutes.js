import express from "express";
import { withdrawFunds, getMyWithdrawals } from "../controllers/withdrawController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, withdrawFunds);
router.get("/withdrawals", authMiddleware, getMyWithdrawals);

export default router;
