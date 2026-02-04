import express from "express";
import { verifyCompany } from "../utils/companyVerifier.js";

const router = express.Router();

router.get("/", async (req, res) => {
  const q = req.query.q;
  if (!q) return res.status(400).json({ error: "Missing ?q=" });

  const result = await verifyCompany(q);
  res.json(result);
});

export default router;
