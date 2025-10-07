import express from "express";
import {
  getAllPaymentMethods,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
  getPublicPaymentMethods,
} from "../controllers/paymentMethodController.js";
import { protect } from "../middlewares/authMiddleware.js";
import { isAdmin } from "../middlewares/adminMiddleware.js";

const router = express.Router();

// User route (view only)
router.get("/public", getPublicPaymentMethods);

// Admin routes
router.get("/", protect, isAdmin, getAllPaymentMethods);
router.post("/", protect, isAdmin, createPaymentMethod);
router.put("/:id", protect, isAdmin, updatePaymentMethod);
router.delete("/:id", protect, isAdmin, deletePaymentMethod);

export default router;
