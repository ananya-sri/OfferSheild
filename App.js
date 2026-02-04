import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import analyzeRoutes from "./src/routes/analyzeRoutes.js";
import pdfRoutes from "./src/routes/pdfRoutes.js";
import reportRoutes from "./src/routes/reportRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";
import verifyRoutes from "./src/routes/verifyRoutes.js";
import { connectRedis } from "./src/utils/redisClient.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

// Connect to Redis
connectRedis().catch(err => console.error("Redis connect failed:", err));

// Rate limiting for analyze endpoints (protects against abuse and controls AI costs)
const analyzeLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute per IP (tune as needed)
  message: { error: "Too many requests, please slow down. Maximum 10 requests per minute." },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Rate limiting for verify endpoints
const verifyLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // 30 requests per minute per IP
  message: { error: "Too many verify requests, please try later." },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to all analyze endpoints
app.use("/api/analyze", analyzeLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/analyze", analyzeRoutes);
app.use("/api/analyze", pdfRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/verify", verifyLimiter, verifyRoutes);


app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;
