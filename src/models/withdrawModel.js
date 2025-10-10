// withdrawModel.js
import pool from "../config/db.js";
import { recordBalanceHistory } from "./balanceHistoryModel.js";

export async function createWithdrawal(userId, amount, method) {
  const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
  const previousBalance = parseFloat(userResult.rows[0].balance);

  if (previousBalance < amount) {
    throw new Error("Insufficient balance");
  }

  const newBalance = previousBalance - amount;
  await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, userId]);

  const result = await pool.query(
    `INSERT INTO withdrawals (user_id, amount, method, status)
     VALUES ($1, $2, $3, 'pending') RETURNING *`,
    [userId, amount, method]
  );

  await recordBalanceHistory(userId, "withdrawal", amount, previousBalance, newBalance);

  return result.rows[0];
}

// ✅ Add this function
export async function getUserWithdrawals(userId) {
  const result = await pool.query(
    "SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
}
