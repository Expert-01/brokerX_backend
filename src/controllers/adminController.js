import { getUserDeposits, getAllUsers } from "../models/depositModel.js";
import { updateBalance } from "../models/userModel.js";
import { updateDepositStatus } from "../controllers/depositController.js";
import pool from "../config/db.js";
import { recordBalanceHistory } from "../models/balanceHistoryModel.js";

// ✅ View deposits by user
export const viewDeposits = async (req, res) => {
  try {
    const { userId } = req.params;
    const deposits = await getUserDeposits(userId);
    res.json({ message: deposits });
  } catch (error) {
    console.error("Error fetching user deposits:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Approve deposit
export const approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    console.log("Deposit Id:", depositId);

    // Update deposit status to approved
    const deposit = await updateDepositStatus(depositId, "approved");
    if (!deposit || !deposit.user_id || !deposit.amount) {
      return res.status(400).json({ error: "Invalid deposit data" });
    }

    // Update user balance
    await updateBalance(deposit.user_id, deposit.amount);

    // Record history
    await recordBalanceHistory(deposit.user_id, deposit.amount, "Deposit approved");

    res.json({ message: "Deposit approved successfully", deposit });
  } catch (error) {
    console.error("Error approving deposit:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// ✅ Reject deposit
export const rejectDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await updateDepositStatus(depositId, "rejected");
    res.json({ message: "Deposit rejected", deposit });
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ✅ Get all deposits (admin)
export const getAllDeposits = async (req, res) => {
  try {
    const deposits = await getAllUsers(); // This seems like it's actually fetching all users; double-check your model naming.
    return res.status(200).json(deposits);
  } catch (error) {
    console.error("Error fetching deposits:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

// ✅ Debug route for deposits
export const debugDeposits = async (req, res) => {
  try {
    const result = await pool.query(`SELECT * FROM deposits`);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ✅ Manually increase user balance (NEW)
export const manuallyIncreaseBalance = async (req, res) => {
  const { userId } = req.params;
  const { amount } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({ error: "Invalid amount." });
  }

  try {
    // Update user balance
    const result = await pool.query(
      "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *",
      [amount, userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "User not found." });
    }

    // Record transaction in balance history
    await recordBalanceHistory(userId, amount, "Manual top-up by admin");

    res.status(200).json({
      message: "User balance increased successfully.",
      user: result.rows[0],
    });
  } catch (error) {
    console.error("Error manually increasing balance:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
