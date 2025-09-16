import express from "express";
import { viewDeposits, approveDeposit, rejectDeposit, getAllDeposits } from "../controllers/adminController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();
//router.get("/deposits", authMiddleware, isAdmin, getAllUsers);
///router.get("/admin/users", authMiddleware, isAdmin, viewUsers);

router.get("/deposits", authMiddleware, isAdmin, getAllDeposits);
router.put("/deposits/:depositId/approve", approveDeposit);
router.post("/deposits/:depositId/reject", authMiddleware, isAdmin, rejectDeposit);

export default router;
