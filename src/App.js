<<<<<<< HEAD
// App.js
import React, { useState, useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate
} from "react-router-dom";

=======

// import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import SignupForm from "./SignupForm";
// import Home from "./Home";
// import SearchPage from "./SearchPage";
// import ResultPage from "./ResultPage";
// import CarDetailPage from "./CarDetailPage";
// import TradeInForm from "./TradeInForm"; // ⬅️ Import halaman Trade-in

// export default function App() {
//   const [isLogin, setIsLogin] = useState(true);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);

//   const switchToSignup = () => setIsLogin(false);
//   const switchToLogin = () => setIsLogin(true);

//   const handleLoginSuccess = (userData) => {
//     setUser(userData);
//     setIsAuthenticated(true);
//   };

//   if (!isAuthenticated) {
//     return (
//       <>
//         {isLogin ? (
//           <LoginPage
//             onSwitchToSignup={switchToSignup}
//             onLoginSuccess={handleLoginSuccess}
//           />
//         ) : (
//           <SignupForm onSwitchToLogin={switchToLogin} />
//         )}
//       </>
//     );
//   }

//   return (
//     <Routes>
//       <Route path="/" element={<Home user={user} />} />
//       <Route path="/search" element={<SearchPage user={user} />} />
//       <Route path="/results" element={<ResultPage />} />
//       <Route path="/car/:id" element={<CarDetailPage />} />
//       <Route path="/tradein" element={<TradeInForm user={user} />} /> {/* ⬅️ ROUTING TRADE-IN */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


import React, { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AdminHome from "./AdminHome";
>>>>>>> c7934f3c89a35fa332f4b2d5e138f036ecaa6462
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Home from "./Home";
import SearchPage from "./SearchPage";
import ResultPage from "./ResultPage";
import CarDetailPage from "./CarDetailPage";
import TradeInForm from "./TradeInForm";
import TradeInResult from "./TradeInResult";
import AjukanJadwal from "./AjukanJadwal";
<<<<<<< HEAD

// ─── Helper untuk “mengunci” route ────────────────────────────────
function ProtectedRoute({ isAuthenticated, children }) {
  return isAuthenticated ? (
    children
  ) : (
    <Navigate to="/login" replace />
  );
}
=======
>>>>>>> c7934f3c89a35fa332f4b2d5e138f036ecaa6462

export default function App() {
  const navigate = useNavigate();     // ← dipakai setelah login
  const [isAuthenticated, setIsAuthenticated] = useState(false);
<<<<<<< HEAD
  const [user, setUser]               = useState(null);
=======
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
>>>>>>> c7934f3c89a35fa332f4b2d5e138f036ecaa6462

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
<<<<<<< HEAD
    navigate("/", { replace: true });   // langsung ke Home
=======

    const role = userData.role;
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "users") {
      navigate("/");
    }
>>>>>>> c7934f3c89a35fa332f4b2d5e138f036ecaa6462
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
<<<<<<< HEAD
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
=======
      <Route path="/" element={<Home user={user} />} />
      <Route path="/search" element={<SearchPage user={user} />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/car/:id" element={<CarDetailPage />} />
      <Route path="/tradein" element={<TradeInForm user={user} />} />
      <Route path="/tradein-result/:tradeinId" element={<TradeInResult />} />
      <Route path="/jadwal" element={<AjukanJadwal user={user} />} />
      <Route path="/admin" element={<AdminHome user={user} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
>>>>>>> c7934f3c89a35fa332f4b2d5e138f036ecaa6462
    </Routes>
  );
}

