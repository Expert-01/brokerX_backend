// models/Order.js
import db from '../config/db.js';

const Order = {
  create: async ({ userId, asset, side, quantity, price }) => {
    const result = await db.query(
      'INSERT INTO orders (user_id, asset, side, quantity, price, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [userId, asset, side, quantity, price, 'pending']
    );
    return result.rows[0];
  },

  getByUser: async (userId) => {
    const result = await db.query(
      'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC',
      [userId]
    );
    return result.rows;
  }
};
export default Order;
