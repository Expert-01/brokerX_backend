
import pool from "../config/db.js";
import { recordBalanceHistory } from "./balanceHistoryModel.js";

// Create new deposit
async function createDeposit(userId, plan, amount, method) {
  const result = await pool.query(
    `INSERT INTO deposits (user_id, plan, amount, method, status)
     VALUES ($1, $2, $3, $4, 'pending')
     RETURNING *`,
    [userId, plan, amount, method]
  );
  // Save deposit record

  return result.rows[0];
}

// Get user deposits
async function getUserDeposits(userId) {
  const result = await pool.query(
    `SELECT * FROM deposits WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}

//Get all users
async function getAllUsers() {
  try {
    const result = await pool.query(`SELECT * FROM deposits WHERE status = 'pending' ORDER BY created_at DESC`);
    return result.rows;
  } catch (error) {
    throw error;
  }
}
async function updateDepositStatus(depositId, status) {
  const result = await pool.query(
    `UPDATE deposits SET status = $1 WHERE id = $2 RETURNING *`,
    [status, depositId]
  );
  return result.rows[0];
}
async function updateBalance(userId, amount) {
  // Get current balance
  const currentRes = await pool.query(`SELECT balance FROM users WHERE id = $1`, [userId]);
  const currentBalance = currentRes.rows[0]?.balance || 0;
  // Update balance
  const result = await pool.query(
    `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING *`,
    [amount, userId]
  );
  const newBalance = result.rows[0].balance;
  // Record balance history
  await recordBalanceHistory(userId, newBalance);
  return result.rows[0];
}

export { createDeposit, getUserDeposits, getAllUsers, updateDepositStatus, updateBalance };

