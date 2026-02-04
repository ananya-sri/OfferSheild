
import express from "express";
import multer from "multer";
import { analyzePDF } from "../controllers/pdfController.js";
// import { v4 as uuidv4 } from "uuid"; // Uncomment if saving files to disk

const router = express.Router();

// multer configuration: memory storage (no temp files)
// Note: If you need to save PDFs to disk, use diskStorage with UUID sanitization:
// import path from "path";
// import fs from "fs";
// const uploadsDir = path.join(process.cwd(), "uploads");
// if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
// storage: multer.diskStorage({
//   destination: (req, file, cb) => cb(null, uploadsDir),
//   filename: (req, file, cb) => {
//     const filename = `${uuidv4()}.pdf`; // Sanitize filename with UUID
//     cb(null, filename);
//   }
// })
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 5 MB limit (adjust as needed)
  },
  fileFilter: (req, file, cb) => {
    // Accept PDFs only
    if (file.mimetype === "application/pdf") cb(null, true);
    else cb(new Error("Only PDF files are allowed"), false);
  },
});

router.post("/pdf", upload.single("file"), analyzePDF);

export default router;
