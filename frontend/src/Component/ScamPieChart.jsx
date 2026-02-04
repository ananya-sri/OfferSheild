import React, { useMemo } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function ScamPieChart({ data }) {
  console.log("ScamPieChart received data:", data);
  
  // Memoize the chart data to ensure it updates when data changes
  const chartData = useMemo(() => {
    if (!data) return null;
    
    const scamCount = Number(data.scam) || 0;
    const suspiciousCount = Number(data.suspicious) || 0;
    const safeCount = Number(data.safe) || 0;
    
    return {
      labels: ["Scam", "Suspicious", "Safe"],
      datasets: [
        {
          label: "Job Offer Analysis",
          data: [scamCount, suspiciousCount, safeCount],
          backgroundColor: ["#EF4444", "#F59E0B", "#10B981"],
          borderColor: ["#DC2626", "#D97706", "#059669"],
          borderWidth: 2,
        },
      ],
    };
  }, [data]);

  const total = useMemo(() => {
    if (!data) return 0;
    const scamCount = Number(data.scam) || 0;
    const suspiciousCount = Number(data.suspicious) || 0;
    const safeCount = Number(data.safe) || 0;
    return scamCount + suspiciousCount + safeCount;
  }, [data]);

  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: true,
    animation: {
      animateRotate: true,
      animateScale: true,
    },
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 14,
            weight: 'bold'
          },
          color: '#E5E7EB'
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0;
            return `${label}: ${value} (${percentage}%)`;
          }
        },
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        titleColor: '#E5E7EB',
        bodyColor: '#E5E7EB',
        borderColor: '#4B5563',
        borderWidth: 1
      }
    }
  }), [total]);

  if (!data || !chartData) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12">
        <div className="animate-pulse">
          <div className="h-64 bg-gray-700 rounded-lg"></div>
        </div>
        <p className="mt-4 text-gray-400">Loading statistics...</p>
      </div>
    );
  }

  if (total === 0) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-12 px-6 border-2 border-dashed border-gray-600 rounded-xl bg-gray-700/50">
        <div className="text-6xl mb-4">📊</div>
        <p className="text-lg font-semibold text-gray-300 mb-2">No data available yet</p>
        <p className="text-sm text-gray-400">Upload some job offers to see statistics!</p>
      </div>
    );
  }

  // Create a unique key based on the data to force re-render
  const chartKey = `${data.scam || 0}-${data.suspicious || 0}-${data.safe || 0}`;

  return (
    <div className="w-full max-w-lg mx-auto p-6 space-y-4">
      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center p-4 bg-red-900/20 rounded-lg border border-red-600">
          <p className="text-2xl font-bold text-red-300">{data.scam || 0}</p>
          <p className="text-sm text-red-400">Scam</p>
        </div>
        <div className="text-center p-4 bg-yellow-900/20 rounded-lg border border-yellow-600">
          <p className="text-2xl font-bold text-yellow-300">{data.suspicious || 0}</p>
          <p className="text-sm text-yellow-400">Suspicious</p>
        </div>
        <div className="text-center p-4 bg-green-900/20 rounded-lg border border-green-600">
          <p className="text-2xl font-bold text-green-300">{data.safe || 0}</p>
          <p className="text-sm text-green-400">Safe</p>
        </div>
      </div>
      
      <Pie key={chartKey} data={chartData} options={options} />
    </div>
  );
}
