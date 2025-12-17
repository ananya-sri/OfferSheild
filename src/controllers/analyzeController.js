// backend/src/controllers/analyzeController.js

import Report from "../models/Report.js";
import { groq } from "../utils/openaiClient.js";
import { extractEmail, extractCompany } from "../utils/textExtractors.js";
import { verifyCompany } from "../utils/companyVerifier.js";

// Helper: robust JSON parse from model text
function extractJsonFromModel(raw) {
  const start = raw.indexOf("{");
  const end = raw.lastIndexOf("}");
  if (start === -1 || end === -1) return null;
  try {
    return JSON.parse(raw.slice(start, end + 1));
  } catch (e) {
    return null;
  }
}

export const analyzeText = async (req, res) => {
  try {
    // 1) Validate input
    const { description, hrEmail: hrEmailInput, company: companyInput } = req.body;

    if (!description || typeof description !== "string" || description.trim().length < 3) {
      return res.status(400).json({ error: "description (text) is required" });
    }

    // small safety limit — avoid massive payloads
    const MAX_LEN = 20000;
    let text = description.slice(0, MAX_LEN);

    // 2) Extract potential email/company from text (optional - improves results)
    const parsedEmail = hrEmailInput || extractEmail(text) || "";
    const parsedCompany = companyInput || extractCompany(text) || "";

    // 3) Optionally verify company asynchronously (non-blocking) or synchronously
    // If you want synchronous facts for the AI prompt, call verifyCompany:
    let verificationData = {};
    try {
      // verifyCompany can handle email or domain - it extracts domain internally
      const inputForVerification = parsedEmail || parsedCompany || "";
      if (inputForVerification) {
        verificationData = await verifyCompany(inputForVerification); // returns trust score & details
      }
    } catch (err) {
      // ignore verifier errors (avoid failing analyze)
      console.warn("verifyCompany failed:", err?.message || err);
    }

    // 4) Build a strict prompt for the model (returns JSON only)
    const prompt = `
You are an expert at spotting fraudulent job offers, phishing, and recruitment scams.

Analyze the following text and return EXACTLY ONE valid JSON object (no markdown, no commentary) with these keys:

{
 "scam_probability": 0-100,
 "verdict": "safe" | "suspicious" | "scam",
 "red_flags": ["short phrases"],
 "suspicious_phrases": ["phrases found verbatim"],
 "summary": "one or two sentence explanation"
}

Text to analyze:
${text}

Contextual facts (do not invent): ${JSON.stringify({
      hrEmail: parsedEmail,
      company: parsedCompany,
      verification: verificationData ? {
        domain: verificationData.domain,
        score: verificationData.trust_score
      } : {}
    })}

Rules:
- If uncertain, set verdict to "suspicious".
- If the text asks for money/registration fees/bank details, treat as scam.
- Return ONLY JSON object.
`;

    // 5) Call the model (example with groq client - change to your client)
    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant", // change to model you use
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
      max_tokens: 600,
    });

    const raw = completion?.choices?.[0]?.message?.content || "";
    const parsed = extractJsonFromModel(raw);

    if (!parsed) {
      // helpful debug info in logs (do NOT leak to clients in prod)
      console.error("AI raw output:", raw);
      return res.status(500).json({ error: "AI output couldn't be parsed as JSON", raw });
    }

    // 6) Normalize response values (safety)
    parsed.scam_probability = Number(parsed.scam_probability || 0);
    if (Number.isNaN(parsed.scam_probability)) parsed.scam_probability = 0;
    parsed.verdict = parsed.verdict || (parsed.scam_probability > 70 ? "scam" : parsed.scam_probability > 40 ? "suspicious" : "safe");
    parsed.red_flags = parsed.red_flags || [];
    parsed.suspicious_phrases = parsed.suspicious_phrases || [];
    parsed.summary = parsed.summary || "";

    // 7) Save report to DB
    const report = await Report.create({
      source: "text",
      originalTextSnippet: text.slice(0, 1500),
      hrEmail: parsedEmail || "",
      company: parsedCompany || "",
      scam_probability: parsed.scam_probability,
      verdict: parsed.verdict,
      red_flags: parsed.red_flags,
      suspicious_phrases: parsed.suspicious_phrases,
      summary: parsed.summary,
    });

    // 8) Return response
    return res.json({
      ...parsed,
      reportId: report._id,
    });

  } catch (err) {
    console.error("analyzeText error:", err);
    return res.status(500).json({ error: "Text analysis failed", details: err.message || err });
  }
};
