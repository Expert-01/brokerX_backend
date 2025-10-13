import pool from '../config/db.js'; 

export const createUser = async (id, name, email, password) => {
  const result = await pool.query(
    `INSERT INTO users (id, name, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, email, created_at`,
    [id, name, email, password]
  );
  return result.rows[0];
};

export const findUserByEmail = async (email) => {
    const result = await pool.query(
        `SELECT id, name, email, password, is_admin, created_at, balance FROM users WHERE email = $1`, [email]
    );
    return result.rows[0];
};
export const updateBalance = async (userId, amount) => {
    const result = await pool.query(
        `UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id, name, email, created_at, balance`, [amount, userId]
    );
    return result.rows[0];
};
