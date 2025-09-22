import pool from "../config/db.js";

// Create a new balance history record
export async function recordBalanceHistory(userId, balance) {
  const result = await pool.query(
    `INSERT INTO balance_history (user_id, balance) VALUES ($1, $2) RETURNING *`,
    [userId, balance]
  );
  return result.rows[0];
}

// Get balance history for a user
export async function getBalanceHistory(userId, limit = 30) {
  const result = await pool.query(
    `SELECT * FROM balance_history WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2`,
    [userId, limit]
  );
  return result.rows;
}
