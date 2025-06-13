import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

const LoginPage = ({ onSwitchToSignup, onLoginSuccess }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    try {
      const res = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login berhasil! 🙌");
        console.log("User:", data.user);

        // Simpan data user ke localStorage
        localStorage.setItem("user", JSON.stringify(data.user));

        onLoginSuccess(data.user);

        // Arahkan berdasarkan role
        if (data.user.role === "admin") {
          navigate("/admin");
        } else if (data.user.role === "users") {
          navigate("/");
        } else {
          alert("Peran pengguna tidak dikenali.");
        }
      } else {
        alert("Login gagal: " + data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Tidak bisa terhubung ke server");
    }
  };


  return (
    <div
      className="login-page"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/LoginPage.jpg)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div className="login-form">
        <h1>
          ONOKY <span>DEALERSHIP</span>
        </h1>
        <p>Login into your Account</p>

        <div className="input-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group password-group">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={togglePasswordVisibility}>
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <button onClick={handleLogin}>Login</button>

        <p className="register-link">
          Don't have an account?{" "}
          <a
            href="SignupForm"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToSignup();
            }}
          >
            Create Account
          </a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
