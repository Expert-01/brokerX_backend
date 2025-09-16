
import pool from "../config/db.js";
import { createDeposit, getUserDeposits, updateBalance } from "../models/depositModel.js";

async function depositFunds(req, res) {
  try {
    const userId = req.user.id; // from auth middleware
    const { plan, amount, method } = req.body;

    if (!plan || !amount || !method) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const deposit = await createDeposit(userId, plan, amount, method);
    res.status(201).json({ message: "Deposit created successfully", deposit });


    //Update user's wallet balance (pseudo-code, implement as needed)
    //const balance = await updateBalance(userId, amount);

    res.json({ message: "Deposit successful", newBalance: balance.rows[0].balance });
  } catch (err) {
   // console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function getMyDeposits(req, res) {
  try {
    const userId = req.user.id;
    const deposits = await getUserDeposits(userId);
    res.json(deposits);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

async function updateDepositStatus(depositId, status) {
  // Get deposit info first
  const depositRes = await pool.query(
    `SELECT user_id, amount, status FROM deposits WHERE id = $1`,
    [depositId]
  );
  const deposit = depositRes.rows[0];
  if (!deposit) throw new Error('Deposit not found');

  // Update status
  const result = await pool.query(
    `UPDATE deposits SET status = $1 WHERE id = $2 RETURNING *`,
    [status, depositId]
  );

  // If approving, update balance
  if (status === 'approved' && deposit.status !== 'approved') {
    await updateBalance(deposit.user_id, deposit.amount);
  }
  return result.rows[0];
};

export { depositFunds, getMyDeposits, updateDepositStatus };


