import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Analyzer from "./Pages/Analyzer";
import Dashboard from "./Pages/Dashboard";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import Results from "./Pages/Results";



function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage on mount
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    setLoading(false);
  }, []);

  // Logout function that clears token and updates state
  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  // Protected Route Component
  const ProtectedRoute = ({ children }) => {
    if (!token) {
      return <Navigate to="/login" replace />;
    }
    return children;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={
            token ? (
              <Navigate to="/analyze" replace />
            ) : (
              <Login setToken={setToken} />
            )
          } 
        />
        <Route 
          path="/signup" 
          element={
            token ? (
              <Navigate to="/analyze" replace />
            ) : (
              <Signup setToken={setToken} />
            )
          } 
        />
        <Route 
          path="/" 
          element={
            <Navigate to={token ? "/analyze" : "/login"} replace />
          } 
        />
        <Route 
          path="/analyze" 
          element={
            <ProtectedRoute>
              <Analyzer onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute>
              <Results onLogout={handleLogout} />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
