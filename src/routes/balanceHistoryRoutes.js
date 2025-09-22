import express from "express";
import { getBalanceHistory } from "../controllers/balanceHistoryController.js";

const router = express.Router();

// GET /api/balance-history/:userId?range=1D|1W|1M|3M|1Y
router.get("/:userId", getBalanceHistory);

export default router;
