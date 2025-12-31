import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import compression from "compression";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import connectDB from "./config/dbConfig.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Security & Performance Middleware
app.use(helmet());
app.use(compression());

// Rate limiting - 100 requests per 15 minutes per IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests, please try again later.'
});
app.use(limiter);

// CORS
app.use(cors({
  origin: ["http://localhost:5173", "https://goodmemories-frontend.onrender.com"],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));

import gratitudeRoutes from './routes/gratitudeRoutes.js';
app.use('/api/pages', gratitudeRoutes);

connectDB();


app.get("/", (req, res) => {
  res.json({ message: "API is live" });
});

// Health check for Render
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy", timestamp: new Date().toISOString() });
});


app.listen(PORT, () => {
  console.log('Server running ...')
});
