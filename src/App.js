
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
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Home from "./Home";
import SearchPage from "./SearchPage";
import ResultPage from "./ResultPage";
import CarDetailPage from "./CarDetailPage";
import TradeInForm from "./TradeInForm";
import TradeInResult from "./TradeInResult";
import AjukanJadwal from "./AjukanJadwal";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);

    const role = userData.role;
    if (role === "admin") {
      navigate("/admin");
    } else if (role === "users") {
      navigate("/");
    }
  };

  if (!isAuthenticated) {
    return (
      <>
        {isLogin ? (
          <LoginPage
            onSwitchToSignup={switchToSignup}
            onLoginSuccess={handleLoginSuccess}
          />
        ) : (
          <SignupForm onSwitchToLogin={switchToLogin} />
        )}
      </>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home user={user} />} />
      <Route path="/search" element={<SearchPage user={user} />} />
      <Route path="/results" element={<ResultPage />} />
      <Route path="/car/:id" element={<CarDetailPage />} />
      <Route path="/tradein" element={<TradeInForm user={user} />} />
      <Route path="/tradein-result/:tradeinId" element={<TradeInResult />} />
      <Route path="/jadwal" element={<AjukanJadwal user={user} />} />
      <Route path="/admin" element={<AdminHome user={user} />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

