// frontend/src/components/TextAnalyzer.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function TextAnalyzer({ apiBase = "http://localhost:5000" }) {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [hrEmail, setHrEmail] = useState("");
  const [company, setCompany] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const analyze = async () => {
    setError("");
    if (!text || text.trim().length < 3) {
      setError("Please provide at least 3 characters of text to analyze.");
      return;
    }

    setLoading(true);
    try {
      const payload = { description: text, hrEmail: hrEmail || undefined, company: company || undefined };
      const token = localStorage.getItem("token");
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const res = await axios.post(`${apiBase}/api/analyze/text`, payload, { headers });
      setResult(res.data);
      // Navigate to results page with the result data
      navigate("/results", { state: { result: res.data } });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Unable to complete analysis. Please verify your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const copySummary = async () => {
    if (result?.summary) {
      try {
        await navigator.clipboard.writeText(result.summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy:", err);
      }
    }
  };

  const downloadReport = () => {
    if (!result) return;
    const data = JSON.stringify(result, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `scam-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getVerdictColor = (verdict) => {
    switch (verdict) {
      case "scam":
        return "bg-red-900/30 text-red-300 border-red-600";
      case "suspicious":
        return "bg-yellow-900/30 text-yellow-300 border-yellow-600";
      case "safe":
        return "bg-green-900/30 text-green-300 border-green-600";
      default:
        return "bg-gray-800 text-gray-300 border-gray-600";
    }
  };

  const getVerdictIcon = (verdict) => {
    switch (verdict) {
      case "scam":
        return "🚨";
      case "suspicious":
        return "⚠️";
      case "safe":
        return "✅";
      default:
        return "❓";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
      analyze();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <span className="text-3xl">📧</span>
          Email & Message Analyzer
        </h3>
        <p className="text-gray-400 text-sm">
          Instantly verify job offer emails, recruitment messages, and suspicious communications using advanced AI detection
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded-lg">
          <p className="font-medium flex items-center gap-2">
            <span>⚠️</span> {error}
          </p>
        </div>
      )}

      {/* Text Input */}
      <div>
        <label className="block text-sm font-semibold text-gray-200 mb-2">
          Content to Analyze
        </label>
        <p className="text-xs text-gray-400 mb-3">
          Paste job descriptions, recruitment emails, WhatsApp messages, or any suspicious communication
        </p>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            setError("");
          }}
          onKeyDown={handleKeyPress}
          placeholder="Example: 'Congratulations! You've been selected for a remote position at our company. To proceed, please send your bank details and a processing fee of $500...'"
          rows={10}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-500 resize-none leading-relaxed"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-xs text-gray-500">
            <span className="font-medium">Quick tip:</span> Press <kbd className="px-1.5 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs">Ctrl</kbd> + <kbd className="px-1.5 py-0.5 bg-gray-700 border border-gray-600 rounded text-xs">Enter</kbd> to analyze instantly
          </p>
          <p className="text-xs text-gray-500">
            {text.length > 0 && `${text.length} characters`}
          </p>
        </div>
      </div>

      {/* Optional Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Contact Email
            <span className="text-gray-500 text-xs font-normal ml-1">(Optional - helps improve accuracy)</span>
          </label>
          <input
            type="email"
            placeholder="e.g., recruiter@company.com"
            value={hrEmail}
            onChange={(e) => setHrEmail(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Email address from the job offer or recruiter</p>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-200 mb-2">
            Company Name
            <span className="text-gray-500 text-xs font-normal ml-1">(Optional - helps improve accuracy)</span>
          </label>
          <input
            type="text"
            placeholder="e.g., Tech Solutions Inc."
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all placeholder-gray-500"
          />
          <p className="text-xs text-gray-500 mt-1">Name of the company mentioned in the offer</p>
        </div>
      </div>

      {/* Analyze Button */}
      <div className="flex justify-center pt-2">
        <button
          onClick={analyze}
          disabled={loading || !text.trim()}
          className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center gap-2 min-w-[180px] text-base"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing Content...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Start Analysis
            </>
          )}
        </button>
      </div>

      {/* Results Section */}
      {result && (
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700 transition-all duration-300">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <div>
              <h3 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                <span className="text-3xl">🔍</span>
                Analysis Complete
              </h3>
              <p className="text-sm text-gray-400">Detailed security assessment results</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copySummary}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm hover:text-white"
                title="Copy analysis summary to clipboard"
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy Summary
                  </>
                )}
              </button>
              <button
                onClick={downloadReport}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm hover:text-white"
                title="Download full report as JSON"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export Report
              </button>
            </div>
          </div>

          {/* Verdict Card */}
          <div className={`border-2 rounded-xl p-6 ${getVerdictColor(result.verdict)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                  Security Assessment
                </p>
                <p className="text-3xl font-bold flex items-center gap-2 capitalize">
                  {getVerdictIcon(result.verdict)} {result.verdict === "scam" ? "Potential Scam" : result.verdict === "suspicious" ? "Suspicious Activity" : "Appears Legitimate"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs font-semibold uppercase tracking-wider mb-2 text-gray-400">
                  Risk Score
                </p>
                <p className="text-4xl font-bold">
                  {result.scam_probability}%
                </p>
                <p className="text-xs text-gray-400 mt-1">scam probability</p>
              </div>
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
            <h4 className="text-lg font-bold text-red-300 mb-2 flex items-center gap-2">
              <span>⚠️</span> Critical Warning Signs
            </h4>
            <p className="text-xs text-red-400 mb-4">Indicators that suggest this may be fraudulent</p>
            {result.red_flags && result.red_flags.length > 0 ? (
              <ul className="space-y-3">
                {result.red_flags.map((flag, index) => (
                  <li key={index} className="flex items-start gap-3 text-red-200">
                    <span className="text-red-400 mt-1 flex-shrink-0">⚠</span>
                    <span className="leading-relaxed">{flag}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-300 font-medium flex items-center gap-2">
                <span>✅</span> No critical warning signs detected
              </p>
            )}
          </div>

          {/* Suspicious Phrases */}
          <div className="bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg p-6">
            <h4 className="text-lg font-bold text-yellow-300 mb-2 flex items-center gap-2">
              <span>🔍</span> Suspicious Language Patterns
            </h4>
            <p className="text-xs text-yellow-400 mb-4">Phrases commonly used in fraudulent communications</p>
            {result.suspicious_phrases && result.suspicious_phrases.length > 0 ? (
              <ul className="space-y-3">
                {result.suspicious_phrases.map((phrase, index) => (
                  <li key={index} className="flex items-start gap-3 text-yellow-200">
                    <span className="text-yellow-400 mt-1 flex-shrink-0">•</span>
                    <span className="leading-relaxed italic">"{phrase}"</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-300 font-medium flex items-center gap-2">
                <span>✅</span> No suspicious language patterns identified
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
            <h4 className="text-lg font-bold text-blue-300 mb-2 flex items-center gap-2">
              <span>📋</span> Analysis Summary
            </h4>
            <p className="text-xs text-blue-400 mb-4">AI-generated assessment of the content</p>
            <p className="text-blue-200 leading-relaxed text-base">{result.summary}</p>
          </div>
        </div>
      )}
    </div>
  );
}
