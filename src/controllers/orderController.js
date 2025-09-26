// controllers/orderController.js
import Order from '../models/orderModel.js';
import db from '../config/db.js'; // ✅ fixed path

async function placeOrder(req, res) {
  const { userId, asset, side, quantity, price } = req.body;
  try {
    const order = await Order.create({ userId, asset, side, quantity, price });
    res.status(201).json(order);

    // Simulate order fill
    setTimeout(async () => {
      try {
        await db.query(
          'UPDATE orders SET status = $1 WHERE id = $2',
          ['filled', order.id]
        );
        // io.emit('orderFilled', { orderId: order.id }); // only if socket.io is wired up
      } catch (err) {
        console.error('Failed to update order status:', err);
      }
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
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
}

export default {
  placeOrder,
  getOrders
};
