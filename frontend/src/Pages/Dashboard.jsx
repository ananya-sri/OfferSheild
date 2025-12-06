import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ReportModal from "../Component/ReportModal.jsx";
import ScamPieChart from "../Component/ScamPieChart.jsx";

const Dashboard = ({ onLogout }) => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const navigate = useNavigate();

  const fetchStats = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/reports/stats");
      console.log("Stats data:", res.data);
      setStats(res.data);
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports");
        setReports(res.data);
        // Refetch stats after reports are loaded
        await fetchStats();
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem("token");
    }
    navigate("/login");
  };

  const getVerdictBadge = (verdict) => {
    const styles = {
      scam: "bg-red-900/30 text-red-300 border-red-600",
      suspicious: "bg-yellow-900/30 text-yellow-300 border-yellow-600",
      safe: "bg-green-900/30 text-green-300 border-green-600"
    };
    return styles[verdict] || "bg-gray-800 text-gray-300 border-gray-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <svg className="animate-spin h-12 w-12 text-blue-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="text-gray-300 font-medium">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <nav className="bg-gray-800 border-b border-gray-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              📊 Scam Analysis Dashboard
            </h1>
            <div className="flex items-center gap-4">
              <a
                href="/analyze"
                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                ➕ New Analysis
              </a>
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats Chart Section */}
        <div className="bg-gray-800 rounded-2xl shadow-xl p-8 mb-8 border border-gray-700">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Job Scam Analysis Overview
          </h2>
          <ScamPieChart data={stats} />
        </div>

        {/* Reports Table */}
        <div className="bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-700">
          <div className="px-8 py-6 border-b border-gray-700">
            <h2 className="text-2xl font-bold text-white">Recent Analyses</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-700">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">
                    Verdict
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-800 divide-y divide-gray-700">
                {reports.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="px-6 py-12 text-center text-gray-400">
                      No reports yet. Start analyzing job offers!
                    </td>
                  </tr>
                ) : (
                  reports.map((r) => (
                    <tr 
                      key={r._id}
                      onClick={() => setSelectedReport(r)}
                      className="hover:bg-gray-700 cursor-pointer transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {new Date(r.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {r.hrEmail || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                        {r.company || "—"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-200">
                        {r.scam_probability}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getVerdictBadge(r.verdict)}`}>
                          {r.verdict}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedReport && (
          <ReportModal 
            report={selectedReport} 
            onClose={() => setSelectedReport(null)} 
          />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
