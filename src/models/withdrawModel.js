import pool from "../config/db.js";
import { recordBalanceHistory } from "./balanceHistoryModel.js";

export async function createWithdrawal(userId, amount, method) {
  // 1. Get user’s current balance
  const userResult = await pool.query("SELECT balance FROM users WHERE id = $1", [userId]);
  const previousBalance = parseFloat(userResult.rows[0].balance);

  if (previousBalance < amount) {
    throw new Error("Insufficient balance");
  }

  // 2. Deduct amount
  const newBalance = previousBalance - amount;
  await pool.query("UPDATE users SET balance = $1 WHERE id = $2", [newBalance, userId]);

  // 3. Create withdrawal record
  const result = await pool.query(
    `INSERT INTO withdrawals (user_id, amount, method, status)
     VALUES ($1, $2, $3, 'pending') RETURNING *`,
    [userId, amount, method]
  );

  // 4. Record balance history
  await recordBalanceHistory(userId, "withdrawal", amount, previousBalance, newBalance);

  return result.rows[0];
}
