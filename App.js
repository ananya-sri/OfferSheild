import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import analyzeRoutes from "./src/routes/analyzeRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/analyze", analyzeRoutes);

app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

export default app;
