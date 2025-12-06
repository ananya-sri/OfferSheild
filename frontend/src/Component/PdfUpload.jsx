import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const PdfUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a PDF file first");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        "http://localhost:5000/api/analyze/pdf",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Navigate to results page with the result data
      navigate("/results", { state: { result: res.data } });
      
    } catch (err) {
      console.error(err);
      setError("Analysis failed. Please check your file and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 text-red-200 p-4 rounded-lg">
          <p className="font-medium">{error}</p>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        <label className="flex-1 cursor-pointer">
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => {
              setFile(e.target.files[0]);
              setError("");
            }}
            className="hidden"
            id="file-upload"
          />
          <div className="flex items-center justify-center w-full h-12 px-4 border-2 border-dashed border-gray-600 rounded-lg hover:border-blue-500 transition-colors bg-gray-700 hover:bg-gray-600">
            <span className="text-gray-300 font-medium">
              {file ? file.name : "Choose PDF File"}
            </span>
          </div>
        </label>

        <button
          onClick={handleUpload}
          disabled={loading || !file}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Analyzing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              Upload & Analyze
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PdfUpload;
