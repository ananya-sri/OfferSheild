import express from "express";
import Report from "../models/Report.js";

const router = express.Router();

// Get all reports
router.get("/", async (req, res) => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 }); // Most recent first
    res.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
});

// Get statistics
router.get("/stats", async (req, res) => {
  try {
    const scam = await Report.countDocuments({ verdict: "scam" });
    const suspicious = await Report.countDocuments({ verdict: "suspicious" });
    const safe = await Report.countDocuments({ verdict: "safe" });

    res.json({ scam, suspicious, safe });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ error: "Failed to fetch statistics" });
  }
});

export default router;
