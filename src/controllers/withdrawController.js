import { createWithdrawal, getUserWithdrawals } from "../models/withdrawModel.js";

export async function withdrawFunds(req, res) {
  try {
    const userId = req.user.id;
    const { amount, method } = req.body;
    if (!amount || !method) {
      return res.status(400).json({ message: "Amount and method are required" });
    }
    const withdrawal = await createWithdrawal(userId, amount, method);
    res.status(201).json({ message: "Withdrawal request submitted", withdrawal });
  } catch (err) {
    console.log("Withdraw error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getMyWithdrawals(req, res) {
  try {
    const userId = req.user.id;
    const withdrawals = await getUserWithdrawals(userId);
    res.json(withdrawals);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
// controllers/withdrawController.js
export const getUserWithdrawals = async (req, res) => {
  try {
    const withdrawals = await pool.query(
      "SELECT * FROM withdrawals WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.id]
    );
    res.json(withdrawals.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
