import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotesDashboard from "./pages/NotesDashboard";
import ProtectedRoute from "./routes/ProtectedRoute";
import GoogleCallback from "./pages/GoogleCallback";
function AppContent() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, [location]);

  return (
    <>
      <Routes>
        <Route path="/login" element={
          token ? <Navigate to="/" replace /> : <Login />
        } />
        <Route path="/register" element={
          token ? <Navigate to="/" replace /> : <Register />
        } />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <NotesDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to={token ? "/" : "/login"} replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}