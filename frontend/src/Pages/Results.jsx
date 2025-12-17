import React from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";

const Results = ({ onLogout }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const result = location.state?.result;

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  // If no result data, redirect back to analyzer
  React.useEffect(() => {
    if (!result) {
      navigate("/analyze", { replace: true });
    }
  }, [result, navigate]);

  if (!result) {
    return null;
  }

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              🛡️ Fake Job Scam Analyzer
            </h1>
            <div className="flex items-center gap-4">
              <Link
                to="/analyze"
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors"
              >
                🔄 New Analysis
              </Link>
              <Link
                to="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                📊 Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-gray-300 hover:text-white font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Results Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 space-y-6 border border-gray-700">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-1">
                <span className="text-3xl">🔍</span>
                Analysis Complete
              </h2>
              <p className="text-sm text-gray-400">Detailed security assessment results</p>
            </div>
          </div>

          {/* Verdict Card */}
          <div className={`border-2 rounded-xl p-6 ${getVerdictColor(result.verdict)}`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-400">
                  Security Assessment
                </p>
                <p className="text-3xl font-bold flex items-center gap-2 capitalize">
                  {getVerdictIcon(result.verdict)} {result.verdict === "scam" ? "Potential Scam" : result.verdict === "suspicious" ? "Suspicious Activity" : "Appears Legitimate"}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-semibold uppercase tracking-wide mb-2 text-gray-400">
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

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4 border-t border-gray-700">
            <Link
              to="/analyze"
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Analyze Another Document
            </Link>
            <Link
              to="/dashboard"
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-semibold transition-colors"
            >
              View All Reports
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;

