import pool from "../config/db.js";

// 1️⃣ Link bot
export const linkBotToUser = async (req, res) => {
  const { userId } = req.body;

  try {
    const existing = await pool.query("SELECT * FROM trading_bots WHERE user_id = $1", [userId]);

    if (existing.rows.length > 0) {
      await pool.query("UPDATE trading_bots SET is_linked = true, bot_status = 'running' WHERE user_id = $1", [userId]);
    } else {
      await pool.query("INSERT INTO trading_bots (user_id, is_linked, bot_status) VALUES ($1, true, 'running')", [userId]);
    }

    res.json({ message: "Bot linked successfully and started." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error linking bot." });
  }
};

// 2️⃣ Unlink bot
export const unlinkBotFromUser = async (req, res) => {
  const { userId } = req.body;
  try {
    await pool.query("UPDATE trading_bots SET is_linked = false, bot_status = 'inactive' WHERE user_id = $1", [userId]);
    res.json({ message: "Bot unlinked successfully." });
  } catch (error) {
    res.status(500).json({ error: "Error unlinking bot." });
  }
};

// 3️⃣ Get bot status
export const getBotStatus = async (req, res) => {
  const { userId } = req.params;
  try {
    const result = await pool.query("SELECT * FROM trading_bots WHERE user_id = $1", [userId]);
    if (result.rows.length === 0) return res.json({ bot: null });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error fetching bot status." });
  }
};

// 4️⃣ Simulate bot trade (for testing AI logic later)
export const simulateTrade = async (req, res) => {
  const { userId } = req.params;
  const { asset, action, amount, price, profitLoss } = req.body;

  try {
    const botRes = await pool.query("SELECT id FROM trading_bots WHERE user_id = $1", [userId]);
    if (botRes.rows.length === 0) return res.status(404).json({ error: "Bot not found." });

    const botId = botRes.rows[0].id;

    await pool.query(
      "INSERT INTO bot_trades (bot_id, asset_symbol, trade_type, amount, price, profit_loss) VALUES ($1, $2, $3, $4, $5, $6)",
      [botId, asset, action, amount, price, profitLoss]
    );

    await pool.query(
      "UPDATE trading_bots SET total_profit = total_profit + $1, total_trades = total_trades + 1 WHERE id = $2",
      [profitLoss, botId]
    );

    res.json({ message: "Trade simulated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error simulating trade." });
  }
};
