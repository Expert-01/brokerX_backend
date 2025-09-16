import { PLAN_LIMITS, createInvestment, getUserInvestments } from '../models/investmentModel.js';
import pool from '../config/db.js';

export async function invest(req, res) {
  try {
    const userId = req.user.id;
    const { plan, amount } = req.body;
    const limits = PLAN_LIMITS[plan];
    if (!limits) return res.status(400).json({ message: 'Invalid plan' });
    if (amount < limits.min || amount > limits.max) {
      return res.status(400).json({ message: `Amount must be between $${limits.min} and $${limits.max} for ${plan} plan.` });
    }
    // Deduct investment amount from wallet
    const userRes = await pool.query(`SELECT balance FROM users WHERE id = $1`, [userId]);
    const currentBalance = userRes.rows[0]?.balance || 0;
    if (currentBalance < amount) {
      return res.status(400).json({ message: 'Insufficient wallet balance.' });
    }
    await pool.query(`UPDATE users SET balance = balance - $1 WHERE id = $2`, [amount, userId]);

    // Create investment
    const investment = await createInvestment(userId, plan, amount);

    // Example ROI logic: Starter +2%, Pro +5%, Premium +10%
    let roi = 0;
    if (plan === 'starter') roi = amount * 0.02;
    if (plan === 'pro') roi = amount * 0.05;
    if (plan === 'premium') roi = amount * 0.10;
    // ROI will be credited every 24h by cron job, not instantly
    res.json({ message: 'Investment successful', investment, roi });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}

export async function getInvestments(req, res) {
  try {
    const userId = req.user.id;
    const investments = await getUserInvestments(userId);
    res.json(investments);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
}
