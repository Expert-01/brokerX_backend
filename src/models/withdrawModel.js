import pool from "../config/db.js";
import { recordBalanceHistory } from "./balanceHistoryModel.js";

// Create a new withdrawal
export async function createWithdrawal(userId, amount, method) {
  // Subtract from user balance
  const userRes = await pool.query(
    `UPDATE users SET balance = balance - $1 WHERE id = $2 RETURNING balance`,
    [amount, userId]
  );
  const newBalance = userRes.rows[0]?.balance;
  // Record balance history
  await recordBalanceHistory(userId, newBalance);
  // Save withdrawal record
  const result = await pool.query(
    `INSERT INTO withdrawals (user_id, amount, method, status) VALUES ($1, $2, $3, 'pending') RETURNING *`,
    [userId, amount, method]
  );
  return result.rows[0];
}

// Get user withdrawals
export async function getUserWithdrawals(userId) {
  const result = await pool.query(
    `SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}
