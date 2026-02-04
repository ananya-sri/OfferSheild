import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PdfUpload from "../Component/PdfUpload.jsx";
import TextAnalyzer from "../Component/TextAnalyzer.jsx";

const Analyzer = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
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
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Secure Your Career Journey
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            Advanced AI-powered detection for fraudulent job offers and recruitment scams
          </p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">
            Analyze PDF documents or text content instantly. Our intelligent system identifies suspicious patterns, 
            verifies company authenticity, and provides detailed security assessments to protect job seekers.
          </p>
        </div>

        {/* Upload Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-700">
          <PdfUpload />
        </div>

        {/* Text Analyzer Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-700">
          <TextAnalyzer />
        </div>
      </div>
    </div>
  );
};

export default Analyzer;
