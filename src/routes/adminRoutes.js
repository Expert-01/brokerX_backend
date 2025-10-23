import express from "express";
import {
  viewDeposits,
  approveDeposit,
  rejectDeposit,
  getAllDeposits,
  debugDeposits,
  manuallyIncreaseBalance,
  getAllRegisteredUsers,
  // 🟢 Withdrawal controllers
  getPendingWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
} from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

/* ===========================
   💰 DEPOSIT MANAGEMENT
=========================== */

// ✅ View all deposits
router.get("/deposits", authMiddleware, isAdmin, getAllDeposits);

// ✅ Approve deposit
router.put("/deposits/:depositId/approve", authMiddleware, isAdmin, approveDeposit);

// ✅ Reject deposit
router.post("/deposits/:depositId/reject", authMiddleware, isAdmin, rejectDeposit);

// ✅ Debug route (optional)
router.get("/debug/deposits", authMiddleware, isAdmin, debugDeposits);

// ✅ Manually increase user balance
router.patch("/users/increase-balance", authMiddleware, isAdmin, manuallyIncreaseBalance);

// ✅ Get all registered users
router.get("/users", authMiddleware, isAdmin, getAllRegisteredUsers);


/* ===========================
   💸 WITHDRAWAL MANAGEMENT
=========================== */

// ✅ Fetch all pending withdrawals
router.get("/withdrawals", authMiddleware, isAdmin, getPendingWithdrawals);

// ✅ Approve a withdrawal
router.put("/withdrawals/:id/approve", authMiddleware, isAdmin, approveWithdrawal);

// ✅ Reject a withdrawal
router.post("/withdrawals/:id/reject", authMiddleware, isAdmin, rejectWithdrawal);


export default router;
