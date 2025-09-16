import { getUserDeposits, getAllUsers } from "../models/depositModel.js";
import { updateBalance } from "../models/userModel.js";
import { depositFunds, updateDepositStatus } from "../controllers/depositController.js";
import pool from "../config/db.js";

export const viewDeposits = async (req, res) => {
    try{
  const { userId } = req.params;
  const deposits = await getUserDeposits(userId);
  res.json({message: deposits});
} catch (error) {
  //console.error("Error fetching user deposits:", error);
  res.status(500).json({ error: "Internal server error" });
}
};

export const approveDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    console.log("Deposit Id:", req.params.depositId);
    
    // Update deposit status to approved
    const deposit = await updateDepositStatus(depositId, "approved");
   // console.log("Deposit:", deposit);
    console.log("Deposit Id:", req.params.depositId);
    
    if (!deposit || !deposit.user_id || !deposit.amount) {
      return res.status(400).json({ error: "Invalid deposit data" });
    }

    console.log("Deposit Id:", req.params.depositId);

    // Update user balance
    await updateBalance(deposit.user_id, deposit.amount);
    console.log("Updated Deposit:", deposit);

    return res.json({ message: "Deposit approved", deposit });
    
  } catch (error) {
    //console.error("Error approving deposit:", error);
    if (!res.headersSent) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }
};

export const rejectDeposit = async (req, res) => {
  try {
    const { depositId } = req.params;
    const deposit = await updateDepositStatus(depositId, "rejected");
    res.json(deposit);
  } catch (error) {
    console.error("Error rejecting deposit:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};  

export const getAllDeposits = async (_unused, res) => {
    try {
        const result = await getAllUsers();
        result.status(200).json(result);

    } catch (error) {
       res.status(500).json({ error: "Internal server error" });
        //console.error("Error fetching all users:", error);
    }
}