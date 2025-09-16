import pool from '../config/db.js';

export const getUserBalances = async (req, res) => {
  try {
    const userId = req.params.id;
    // Get wallet balance
    const userRes = await pool.query('SELECT balance FROM users WHERE id = $1', [userId]);
    const balance = userRes.rows[0]?.balance || 0;
    // Get investment balance
    const invRes = await pool.query('SELECT SUM(amount) as total FROM investments WHERE user_id = $1', [userId]);
    const investmentBalance = invRes.rows[0]?.total || 0;
    res.json({ balance, investmentBalance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
