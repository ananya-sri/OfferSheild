// backend/src/controllers/analyzeController.js

import { groq } from "../utils/openaiClient.js";



export const analyzeText = async (req, res) => {

  try {

    const { description, hrEmail, company } = req.body;



    // If no data given

    if (!description && !hrEmail) {

      return res.status(400).json({

        error: "Please provide job description or HR email",

      });

    }



    // Build a clear prompt for OpenAI

    const prompt = `
    You are an AI trained to detect fake job offers, scam recruitment messages, phishing emails, fraud HR communication, and unrealistic job offers.
    
    IMPORTANT RULES:
    1. Do NOT classify a job as scam unless there is clear evidence.
    2. If the job description comes from a well-known company (TCS, Infosys, Wipro, Google, etc) with an official domain, reduce scam probability drastically.
    3. If HR email domain is official (example: @tcs.com, @wipro.com, @accenture.com), treat it as legitimate unless there are major red flags.
    4. If job description is short or generic, do NOT assume scam unless there is payment demand, interview skipping, Gmail address, WhatsApp-only communication, etc.
    5. Only classify as scam if there is evidence like:
       - payment/registration fee
       - no interview process
       - Gmail/Yahoo/Outlook email
       - WhatsApp interview
       - unrealistic salary
       - urgent joining + payment
       - no company details
    6. If unsure, verdict should be "suspicious", NOT "scam".
    
    Analyze the following job details and return ONLY valid JSON.
    
    Job Description: ${description || ""}
    HR Email: ${hrEmail || ""}
    Company: ${company || ""}
    
    Return EXACT JSON:
    
    {
      "scam_probability": number (0-100),
      "verdict": "safe" | "suspicious" | "scam",
      "red_flags": ["red flag 1", "red flag 2"],
      "suspicious_phrases": ["phrase1","phrase2"],
      "summary": "short explanation"
    }
    `;
    



    // Call the OpenAI API

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [{ role: "user", content: prompt }],
      temperature: 0,
    });

    let raw = completion.choices[0].message.content;



    // Extract JSON (sometimes model adds messages)

    const firstBrace = raw.indexOf("{");

    const lastBrace = raw.lastIndexOf("}");

    const jsonText = raw.slice(firstBrace, lastBrace + 1);



    const result = JSON.parse(jsonText);



    return res.json(result);



  } catch (error) {

    console.error("❌ ERROR:", error);

    return res.status(500).json({

      error: "OpenAI analysis failed",

      details: error.message,

    });

  }

};
