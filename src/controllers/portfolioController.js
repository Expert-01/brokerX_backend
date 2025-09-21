import db from '../config/db.js';

export async function getPortfolio(req, res) {
  const { userId } = req.params;
  try {
    const result = await db.query(`
      SELECT asset, SUM(CASE WHEN side = 'buy' THEN quantity ELSE -quantity END) AS net_quantity
      FROM orders
      WHERE user_id = $1 AND status = 'filled'
      GROUP BY asset
    `, [userId]);

    res.status(200).json(result.rows); // ✅ returns an array
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch portfolio' });
  }
}
