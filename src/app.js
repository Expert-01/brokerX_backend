import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import cors from "cors";
import depositRoutes from "./routes/depositRoutes.js"
import adminRoutes from "./routes/adminRoutes.js"
import investmentRoutes from "./routes/investmentRoutes.js";
import getUserRoutes from "./routes/getUserRoutes.js";
dotenv.config();

const app = express();

//middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get("/api/test", ( req, res ) => {
  console.log("Frontend just pinged me");
  
  res.json({message: "Backend just pinged me"});
  
});

app.use('/api/deposit', depositRoutes);
app.use('/api/investment', investmentRoutes);
app.use('/api/admin/deposits', depositRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/users', getUserRoutes);

app.use((req, res, next) => {
  console.log('Incoming request:', req.method, req.url);
  next();
})

export default app;