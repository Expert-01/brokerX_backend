import express from "express";
import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPublicPaymentMethods,
} from "../controllers/paymentMethodController.js";
import authMiddleware from "../middlewares/authMiddleware.js"; // ✅ default import
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// User route (view only)
router.get("/public", getPublicPaymentMethods);

// Admin routes
router.get("/", authMiddleware, isAdmin, getAllPaymentMethods);
router.post("/", authMiddleware, isAdmin, createPaymentMethod);
router.put("/:id", authMiddleware, isAdmin, updatePaymentMethod);
router.delete("/:id", authMiddleware, isAdmin, deletePaymentMethod);

export default router;
