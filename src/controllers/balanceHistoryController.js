
import pool from "../config/db.js";
import { getBalanceHistory as getHistoryModel } from "../models/balanceHistoryModel.js";

// GET /api/balance-history/:userId?range=1D|1W|1M|3M|1Y
export async function getBalanceHistory(req, res) {
  const { userId } = req.params;
  const { range } = req.query;
  let limit = 30;
  let interval = 'day';
  switch (range) {
    case '1D': limit = 24; interval = 'hour'; break;
    case '1W': limit = 7; interval = 'day'; break;
    case '1M': limit = 30; interval = 'day'; break;
    case '3M': limit = 12; interval = 'week'; break;
    case '1Y': limit = 12; interval = 'month'; break;
    default: interval = 'day'; break;
  }
  try {
    // Group by interval for charting
    const result = await pool.query(
      `SELECT date_trunc($1, created_at) as x, MAX(balance) as y
       FROM balance_history
       WHERE user_id = $2
       GROUP BY x
       ORDER BY x ASC
       LIMIT $3`,
      [interval, userId, limit]
    );
    let rows = result.rows;
    // For 1D, fill missing hours with previous balance for a continuous line
    if (range === '1D') {
      const now = new Date();
      const hours = Array.from({ length: 24 }, (_, i) => {
        const d = new Date(now);
        d.setHours(i, 0, 0, 0);
        return d;
      });
      let filled = [];
      let lastY = rows.length > 0 ? rows[0].y : 0;
      let rowIdx = 0;
      for (let i = 0; i < hours.length; i++) {
        const hour = hours[i];
        let x = rowIdx < rows.length ? new Date(rows[rowIdx].x) : null;
        if (x && x.getHours() === hour.getHours()) {
          lastY = rows[rowIdx].y;
          filled.push({ x: hour, y: lastY });
          rowIdx++;
        } else {
          filled.push({ x: hour, y: lastY });
        }
      }
      rows = filled;
    }
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
