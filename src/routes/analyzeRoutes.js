import express from "express";

import { analyzeText } from "../controllers/analyzeController.js";

const router = express.Router();
router.post("/text", analyzeText);
export default router;

