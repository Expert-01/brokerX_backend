const Order = require('../models/orderModel.js');

async function placeOrder(req, res) {
  const { userId, asset, side, quantity, price } = req.body;
  try {
    const order = await Order.create({ userId, asset, side, quantity, price });
    res.status(201).json(order);

    setTimeout(() => {
  // Simulate order fill
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

module.exports = { placeOrder, getOrders };
