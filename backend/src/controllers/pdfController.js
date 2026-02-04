import { extractTextFromImage } from "../utils/ocr.js";
import { createRequire } from "module";
import { groq } from "../utils/openaiClient.js"; // or import openai if using OpenAI
import Report from "../models/Report.js";

const require = createRequire(import.meta.url);
const pdfParseModule = require("pdf-parse");
const { PDFParse } = pdfParseModule;

// Wrapper function 
const pdfParse = async (buffer, options = {}) => {
  const parser = new PDFParse({ data: buffer, ...options });
  try {
    const textResult = await parser.getText();
    // TextResult has a .text property that contains the actual text string
    const text = textResult.text || '';
    return { text };
  } finally {
    await parser.destroy();
  }
};

// Helper function to extract email from text
const extractEmail = (text) => {
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
  const matches = text.match(emailRegex);
  return matches ? matches[0] : null;
};

// Helper function to extract company name (looks for common patterns)
const extractCompany = (text) => {
  // Look for patterns like "Company:", "Organization:", "Employer:", etc.
  const companyPatterns = [
    /(?:company|organization|employer|corporation|firm)[\s:]+([A-Z][A-Za-z\s&]+?)(?:\n|\.|,|$)/i,
    /(?:at|from|with)\s+([A-Z][A-Za-z\s&]+?)(?:\s+(?:Inc|LLC|Ltd|Corp|Corporation))?/i
  ];
  
  for (const pattern of companyPatterns) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1].trim();
    }
  }
  return null;
};

export const analyzePDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded. Use 'file' form field." });
    }

    // 1) Extract text from PDF buffer with OCR fallback
    const pdfBuffer = req.file.buffer;
    let parsedText = "";

    // 1) Try normal PDF text extraction
    try {
      const parsed = await pdfParse(pdfBuffer);
      parsedText = parsed.text || "";
    } catch (err) {
      console.log("Normal PDF parse failed, using OCR...");
    }

    // 2) If parsedText is too short → use OCR
    if (!parsedText || parsedText.trim().length < 30) {
      console.log("Running OCR on scanned PDF...");

      // pdf-parse extracts images out of PDF too
      const parsed = await pdfParse(pdfBuffer);

      if (parsed && parsed.metadata && parsed.metadata.isScanned) {
        console.log("Detected scanned PDF");
      }

      // Tesseract needs a buffer of the first page image
      const ocrText = await extractTextFromImage(pdfBuffer);

      // If OCR got something, use it
      if (ocrText && ocrText.length > 20) {
        parsedText = ocrText;
      }
    }

    if (!parsedText || parsedText.trim().length < 10) {
      return res.status(400).json({
        error: "Could not extract text — PDF is too low quality",
      });
    }

    const text = parsedText; // final

    // Truncate extracted text before sending
    const MAX_CHARS = 15000; // adjust lower if model tokens are small
    let payloadText = text;
    if (payloadText.length > MAX_CHARS) {
      // keep beginning and ending which often contains key info
      payloadText = payloadText.slice(0, 10000) + "\n\n...[TRUNCATED]...\n\n" + payloadText.slice(-4000);
    }

    // 2) Build a strict prompt (instruct model to return JSON only)
    const prompt = `
You are an expert in detecting fraudulent job offer letters, fake recruitment letters, and phishing. 
Analyze the following OFFER LETTER and RETURN A SINGLE VALID JSON OBJECT (no extra text, no markdown) with keys:

{
  "scam_probability": 0-100,
  "verdict": "safe" | "suspicious" | "scam",
  "red_flags": ["short phrases"],
  "suspicious_phrases": ["phrases found verbatim in text"],
  "summary": "one or two sentence explanation"
}

OFFER LETTER TEXT:
${payloadText}

Important:
- If the model is not sure, set "verdict" to "suspicious".
- If any phrase asks for money, bank account, or fees, mark as red flag.
- If the letter uses generic email domains (gmail, yahoo) or personal phone WhatsApp-only recruitment, mark red flag.
- Return JSON only. Do not add commentary outside the JSON object.
`;


    // 3) Call the model (groq example; if using openai replace accordingly)
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // pick model you have access to
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 800, // 800 tokens is usually enough for JSON response
    });

    const raw = completion.choices?.[0]?.message?.content || "";

    // 4) Extract JSON substring (robust)
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      // Log raw for debugging
      return res.status(500).json({ error: "Model response not JSON", raw });
    }
    const jsonText = raw.slice(start, end + 1);
    const result = JSON.parse(jsonText);

    // Extract email and company from text
    const parsedEmail = extractEmail(text) || null;
    const parsedCompany = extractCompany(text) || null;

    // Save to database
    const saved = await Report.create({
      source: "pdf",
      originalTextSnippet: text.slice(0, 1500),
      hrEmail: parsedEmail || "",
      company: parsedCompany || "",
      scam_probability: result.scam_probability,
      verdict: result.verdict,
      red_flags: result.red_flags,
      suspicious_phrases: result.suspicious_phrases,
      summary: result.summary
    });

    return res.json(result);

  } catch (err) {
    console.error("analyzePDF error:", err);
    // return more useful message if model error contains .message
    return res.status(500).json({ error: "PDF analysis failed", details: err.message || err });
  }
};
