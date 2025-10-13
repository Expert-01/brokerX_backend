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
  try {
    const { userId, amount, adminId, reason } = req.body;

    // Validate input
    if (!userId || !amount || !adminId) {
      return res.status(400).json({ error: "userId, amount, and adminId are required" });
    }

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      return res.status(400).json({ error: "Amount must be a positive number" });
    }

    // Get current user balance
    const userResult = await pool.query(
      "SELECT balance FROM users WHERE id = $1",
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const previousBalance = parseFloat(userResult.rows[0].balance);

    // Calculate new balance and round to 2 decimals
    const newBalance = parseFloat((previousBalance + amountNum).toFixed(2));

    // Update user balance in DB
    await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [
      newBalance,
      userId,
    ]);

    // Log the adjustment
    await pool.query(
      `INSERT INTO admin_balance_adjustments 
       (user_id, amount, action, previous_balance, new_balance, reason, admin_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, amountNum, "increase", previousBalance, newBalance, reason || "", adminId]
    );

    // Respond with clean, rounded JSON
    res.json({
      message: "User balance increased successfully",
      previousBalance: previousBalance.toFixed(2),
      newBalance: newBalance.toFixed(2),
    });
  } catch (err) {
    console.error("Error manually increasing balance:", err);
    res.status(500).json({ error: "Server error" });
  }
};



// ✅ Get all registered users (for admin)
export const getAllRegisteredUsers = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, name, email, password, balance, created_at
       FROM users
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      message: "Users fetched successfully",
      users: result.rows,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error" });
    }
  }
};

