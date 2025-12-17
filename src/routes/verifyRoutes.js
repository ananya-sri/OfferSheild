// backend/src/routes/verifyRoutes.js
import express from "express";
import { verifyDomain } from "../utils/domainVerifier.js";

const router = express.Router();

router.get("/domain", async (req, res) => {
  try {
    const q = req.query.q;
    if (!q) return res.status(400).json({ error: "Missing q parameter" });

    const result = await verifyDomain(q);
    return res.json(result);
  } catch (err) {
    console.error("verify route error:", err);
    return res.status(500).json({ error: "Verification failed", details: err.message });
  }
});

export default router;
