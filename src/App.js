
// import React, { useState } from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import LoginPage from "./LoginPage";
// import SignupForm from "./SignupForm";
// import SearchPage from "./SearchPage";
// import ResultPage from "./ResultPage";
// import CarDetailPage from "./CarDetailPage"; // <--- Import halaman detail mobil

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
//       <Route path="/" element={<SearchPage user={user} />} />
//       <Route path="/results" element={<ResultPage />} />
//       <Route path="/car/:id" element={<CarDetailPage />} /> {/* <-- Routing detail */}
//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   );
// }


import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import Home from "./Home";
import SearchPage from "./SearchPage";
import ResultPage from "./ResultPage";
import CarDetailPage from "./CarDetailPage";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
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
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
