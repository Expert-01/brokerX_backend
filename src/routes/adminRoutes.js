import express from "express";
import {
  viewDeposits,
  approveDeposit,
  rejectDeposit,
  getAllDeposits,
  debugDeposits,
  manuallyIncreaseBalance, // ✅ New controller
} from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// ✅ View all deposits
router.get("/deposits", authMiddleware, isAdmin, getAllDeposits);

// ✅ Approve deposit
router.put("/deposits/:depositId/approve", authMiddleware, isAdmin, approveDeposit);

// ✅ Reject deposit
router.post("/deposits/:depositId/reject", authMiddleware, isAdmin, rejectDeposit);

// ✅ Debug route (optional)
router.get("/debug/deposits", authMiddleware, isAdmin, debugDeposits);

// ✅ Manually increase user balance
router.patch("/users/:userId/increase-balance", authMiddleware, isAdmin, manuallyIncreaseBalance);

export default router;
