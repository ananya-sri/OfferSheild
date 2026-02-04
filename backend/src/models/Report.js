import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
  source: { type: String, default: "pdf" },
  originalTextSnippet: String,
  hrEmail: String,
  company: String,
  scam_probability: Number,
  verdict: String,
  red_flags: [String],
  suspicious_phrases: [String],
  summary: String
}, { timestamps: true });

export default mongoose.model("Report", ReportSchema);
