// App.js
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Home from "./Home";
import SearchPage from "./SearchPage";
import ResultPage from "./ResultPage";
import CarDetailPage from "./CarDetailPage";
import TradeInForm from "./TradeInForm";
import TradeInResult from "./TradeInResult";
import AjukanJadwal from "./AjukanJadwal";

// ─── Helper untuk “mengunci” route ────────────────────────────────
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}

export default function App() {
  const navigate = useNavigate();     // ← dipakai setelah login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser]               = useState(null);

  // Cek token/user sekali saat app load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Saat login berhasil
  const handleLoginSuccess = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
    navigate("/", { replace: true });   // langsung ke Home
  };

  // Saat logout (sidebar memanggil prop ini)
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAuthenticated(false);
    navigate("/login", { replace: true });
  };

  return (
    <Routes>
      {/* ─────────── Auth Routes ─────────── */}
      <Route
        path="/login"
        element={
          <LoginPage
            onSwitchToSignup={() => navigate("/signup")}
            onLoginSuccess={handleLoginSuccess}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignupForm onSwitchToLogin={() => navigate("/login")} />
        }
      />

      {/* ─────────── Protected Routes ─────────── */}
      <Route
        path="/"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <SearchPage user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/results"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/car/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <CarDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tradein"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TradeInForm user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/tradein-result/:tradeinId"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <TradeInResult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/jadwal"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <AjukanJadwal user={user} onLogout={handleLogout} />
          </ProtectedRoute>
        }
      />

      {/* Fallback: kalau route tak dikenali */}
      <Route
        path="*"
        element={
          <Navigate
            to={isAuthenticated ? "/" : "/login"}
            replace
          />
        }
      />
    </Routes>
  );
}
