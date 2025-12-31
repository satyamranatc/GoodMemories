import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/dbConfig.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: ["http://localhost:5173", "https://goodmemories-frontend.onrender.com"],
  credentials: true
}));
app.use(express.json());

import gratitudeRoutes from './routes/gratitudeRoutes.js';
app.use('/api/pages', gratitudeRoutes);

connectDB();


app.get("/", (req, res) => {
  res.json({ message: "API is live" });
});


app.listen(PORT, () => {
  console.log('Server running ...')
});
