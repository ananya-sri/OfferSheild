import express from "express";
import { verifyDomain } from "../controllers/whoisController.js";

const router = express.Router();

router.get("/verify", verifyDomain);

export default router;
