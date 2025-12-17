import React from "react";

const ReportModal = ({ report, onClose }) => {
  if (!report) return null;

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

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-gray-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto relative border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl font-bold transition-colors z-10"
        >
          ✖
        </button>

        <div className="p-8 space-y-6">
          <h2 className="text-3xl font-bold text-white mb-6">📄 Detailed Report</h2>

          {/* Verdict and Probability */}
          <div className={`border-2 rounded-xl p-6 ${getVerdictColor(report.verdict)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-400">Verdict</p>
                <p className="text-2xl font-bold capitalize">{report.verdict}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-400">Scam Probability</p>
                <p className="text-3xl font-bold">{report.scam_probability}%</p>
              </div>
            </div>
          </div>

          {/* Red Flags */}
          <div className="bg-red-900/20 border-l-4 border-red-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-300 mb-4 flex items-center gap-2">
              <span>⚠️</span> Red Flags
            </h3>
            {report.red_flags?.length > 0 ? (
              <ul className="space-y-2">
                {report.red_flags.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-red-200">
                    <span className="text-red-400 mt-1">•</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-300 font-medium flex items-center gap-2">
                <span>✅</span> No red flags found
              </p>
            )}
          </div>

          {/* Suspicious Phrases */}
          <div className="bg-yellow-900/20 border-l-4 border-yellow-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-yellow-300 mb-4 flex items-center gap-2">
              <span>🧩</span> Suspicious Phrases
            </h3>
            {report.suspicious_phrases?.length > 0 ? (
              <ul className="space-y-2">
                {report.suspicious_phrases.map((s, i) => (
                  <li key={i} className="flex items-start gap-2 text-yellow-200">
                    <span className="text-yellow-400 mt-1">•</span>
                    <span>{s}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-green-300 font-medium flex items-center gap-2">
                <span>✅</span> No suspicious phrases detected
              </p>
            )}
          </div>

          {/* Summary */}
          <div className="bg-blue-900/20 border-l-4 border-blue-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-blue-300 mb-4 flex items-center gap-2">
              <span>📝</span> Summary
            </h3>
            <p className="text-blue-200 leading-relaxed">{report.summary}</p>
          </div>

          {/* Email & Company */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📌</span> Contact Information
            </h3>
            <div className="space-y-2">
              <p className="text-gray-300">
                <span className="font-semibold">Email:</span> {report.hrEmail || "—"}
              </p>
              <p className="text-gray-300">
                <span className="font-semibold">Company:</span> {report.company || "—"}
              </p>
            </div>
          </div>

          {/* Text Snippet */}
          <div className="bg-gray-700 rounded-lg p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <span>📄</span> Extracted Text Snippet
            </h3>
            <div className="bg-gray-800 border border-gray-600 rounded-lg p-4 max-h-64 overflow-y-auto text-sm text-gray-300 whitespace-pre-wrap">
              {report.originalTextSnippet || "No text snippet available"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
