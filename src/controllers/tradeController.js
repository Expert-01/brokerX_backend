// tradeController.js
import pool from "../config/db.js";
import axios from "axios";

export const openTrade = async (req, res) => {
  try {
    const { asset, type, amount } = req.body;
    const userId = req.user.id; // from JWT middleware

    // Get current market price (CoinGecko)
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${asset}&vs_currencies=usd`
    );

    const entryPrice = data[asset].usd;

    const result = await pool.query(
      `INSERT INTO trades (user_id, asset, type, amount, entry_price)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, asset, type, amount, entryPrice]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const closeTrade = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Get trade details
    const tradeRes = await pool.query(
      `SELECT * FROM trades WHERE id=$1 AND user_id=$2 AND status='open'`,
      [id, userId]
    );

    if (tradeRes.rows.length === 0)
      return res.status(404).json({ error: "Trade not found" });

    const trade = tradeRes.rows[0];

    // Get current price
    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${trade.asset}&vs_currencies=usd`
    );
    const currentPrice = data[trade.asset].usd;

    // Calculate P/L
    let profitLoss = 0;
    if (trade.type === "buy") {
      profitLoss = (currentPrice - trade.entry_price) * (trade.amount / trade.entry_price);
    } else {
      profitLoss = (trade.entry_price - currentPrice) * (trade.amount / trade.entry_price);
    }

    const updateRes = await pool.query(
      `UPDATE trades SET status='closed', current_price=$1, profit_loss=$2, closed_at=NOW()
       WHERE id=$3 RETURNING *`,
      [currentPrice, profitLoss, id]
    );

    res.json(updateRes.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};





export const getOpenTrades = async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    `SELECT * FROM trades WHERE user_id=$1 AND status='open'`,
    [userId]
  );
  res.json(result.rows);
};






export const getTradeHistory = async (req, res) => {
  const userId = req.user.id;
  const result = await pool.query(
    `SELECT * FROM trades WHERE user_id=$1 AND status='closed' ORDER BY closed_at DESC`,
    [userId]
  );
  res.json(result.rows);
};







