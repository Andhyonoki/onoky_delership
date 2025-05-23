import React, { useState } from "react";
import LoginPage from "./LoginPage";
import SignupForm from "./SignupForm";
import SearchPage from "./SearchPage";

export default function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const switchToSignup = () => setIsLogin(false);
  const switchToLogin = () => setIsLogin(true);

  // Terima user dari LoginPage dan set authenticated
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  if (isAuthenticated && user) {
    return <SearchPage user={user} />;
  }

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
