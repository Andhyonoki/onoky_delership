
import React, { useState } from "react";
import "./SignupForm1.css";

export default function SignupForm({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => setShowPassword(!showPassword);

  // Fungsi kirim data ke backend
  const handleSignup = async (e) => {
    e.preventDefault(); // cegah reload halaman

    try {
      const res = await fetch("/register", {  // pastikan endpoint ini di backend sudah ada
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, paymentMethod, email, password }),

      });

      const data = await res.json();

      if (res.ok) {
        alert("Registrasi berhasil!");
        onSwitchToLogin(); // balik ke halaman login otomatis
      } else {
        alert("Gagal daftar: " + data.message);
      }
    } catch (error) {
      alert("Terjadi kesalahan saat mendaftar");
      console.error(error);
    }
  };

  return (
    <div
      className="signup-container"
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
      <div className="signup-card">
        <h1 className="title">
          <span className="brand">ONOKY</span> DEALERSHIP
        </h1>
        <p className="subtitle">Start with create an account</p>

        <form className="form" onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span className="eye-icon" onClick={togglePassword}>
                {showPassword ? "🙈" : "👁️"}
              </span>
            </div>
          </div>

          <button type="submit" className="signup-btn">
            Signup
          </button>
        </form>

        <p className="login-text">
          Already have an account?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToLogin();
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
