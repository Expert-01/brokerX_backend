import pool from '../config/db.js';

export const PLAN_LIMITS = {
  starter: { min: 10, max: 500 },
  pro: { min: 501, max: 5000 },
  premium: { min: 5001, max: 50000 }
};

export async function createInvestment(userId, plan, amount) {
  const result = await pool.query(
    `INSERT INTO investments (user_id, plan, amount) VALUES ($1, $2, $3) RETURNING *`,
    [userId, plan, amount]
  );
  return result.rows[0];
}

export async function getUserInvestments(userId) {
  const result = await pool.query(
    `SELECT * FROM investments WHERE user_id = $1 ORDER BY created_at DESC`,
    [userId]
  );
  return result.rows;
}
