import Order from '../models/orderModel.js';
import db from '../db.js';       // make sure you actually export db in db.js
import { io } from '../server.js'; // assuming you exported io from server.js

async function placeOrder(req, res) {
  const { userId, asset, side, quantity, price } = req.body;
  try {
    const order = await Order.create({ userId, asset, side, quantity, price });
    res.status(201).json(order);

    // Simulate fill
    setTimeout(() => {
      db.query('UPDATE orders SET status = $1 WHERE id = $2', ['filled', order.id]);
      io.emit('orderFilled', { orderId: order.id });
    }, 3000);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to place order' });
  }
}

async function getOrders(req, res) {
  const { userId } = req.params;
  try {
    const orders = await Order.getByUser(userId);
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export default {
  placeOrder,
  getOrders
};
