import pool from "../config/db.js";

// 🟢 Get all payment methods (Admin only)
export const getAllPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM payment_methods ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching payment methods:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Get public payment methods (for users)
export const getPublicPaymentMethods = async (req, res) => {
  try {
    const result = await pool.query("SELECT method, details FROM payment_methods ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching public payment methods:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Add new payment method (Admin only)
export const createPaymentMethod = async (req, res) => {
  try {
    const { method, details } = req.body;

    if (!method || !details) {
      return res.status(400).json({ message: "Method and details are required" });
    }

    const result = await pool.query(
      "INSERT INTO payment_methods (method, details) VALUES ($1, $2) RETURNING *",
      [method, details]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error creating payment method:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Update payment method (Admin only)
export const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { method, details } = req.body;

    const result = await pool.query(
      "UPDATE payment_methods SET method=$1, details=$2, updated_at=NOW() WHERE id=$3 RETURNING *",
      [method, details, id]
    );

    if (result.rowCount === 0) return res.status(404).json({ message: "Payment method not found" });

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error updating payment method:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// 🟢 Delete payment method (Admin only)
export const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM payment_methods WHERE id=$1", [id]);

    if (result.rowCount === 0) return res.status(404).json({ message: "Payment method not found" });

    res.json({ message: "Payment method deleted successfully" });
  } catch (error) {
    console.error("Error deleting payment method:", error);
    res.status(500).json({ message: "Server error" });
  }
};
