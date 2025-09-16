import express from "express";
import { depositFunds, getMyDeposits } from "../controllers/depositController.js";
import { approveDeposit } from "../controllers/adminController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, depositFunds);
router.get("/", authMiddleware, getMyDeposits);

export default router;
