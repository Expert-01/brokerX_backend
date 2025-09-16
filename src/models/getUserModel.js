import pool from '../config/db.js';

export const getUserById = async (userId) => {
    const result = await pool.query(
        `SELECT id, name, email, is_admin, created_at, balance FROM users WHERE id = $1`, [userId]
    );
    return result.rows[0];
};
