import cron from 'node-cron';
import pool from './src/config/db.js';
import { PLAN_LIMITS } from './src/models/investmentModel.js';

// ROI rates
const ROI_RATES = {
  starter: 0.02,
  pro: 0.05,
  premium: 0.10
};

// Run every minute
cron.schedule('* * * * *', async () => {
  console.log('Running ROI payout job...');
  try {
    // Get all investments
    const investmentsRes = await pool.query('SELECT * FROM investments');
    for (const inv of investmentsRes.rows) {
      const roi = Number(inv.amount) * (ROI_RATES[inv.plan] || 0) / (24 * 60); // per minute
      if (roi > 0) {
        await pool.query(
          'UPDATE users SET balance = balance + $1 WHERE id = $2',
          [roi, inv.user_id]
        );
        console.log(`ROI: User ${inv.user_id} balance increased by $${roi.toFixed(2)}`);
      }
    }
    console.log('ROI payout completed.');
  } catch (err) {
    console.error('ROI payout error:', err);
  }
});