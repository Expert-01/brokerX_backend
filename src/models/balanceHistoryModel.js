import pool from "../config/db.js";

export async function recordBalanceHistory(userId, action, amount, previousBalance, newBalance) {
  await pool.query(
    `INSERT INTO balance_history (user_id, action, amount, previous_balance, new_balance)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, action, amount, previousBalance, newBalance]
  );
}

// Create a new balance history record

// Get balance history for a user
export async function getBalanceHistory(userId, limit = 30) {
  const result = await pool.query(
    `SELECT * FROM balance_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}
