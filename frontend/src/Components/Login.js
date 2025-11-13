import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter both email and password!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data);

      if (data.message === "Login successful!") {
        localStorage.setItem("user", JSON.stringify(data.user));

        // localStorage.setItem("userId", data.user.id);
        // localStorage.setItem("userName", data.user.name);
        // localStorage.setItem("userEmail", data.user.email);
        // localStorage.setItem("userType", data.user.type);
        // localStorage.setItem("userCollege", data.user.college);
        // localStorage.setItem("userCity", data.user.city);

        alert("Login Successful!");
        console.log(data.user);
        if (data.user.role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        alert(data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("Something went wrong. Check console for details.");
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-form">
        <div className="login">
          <h1>Login</h1>
          <form className="login-field" onSubmit={handleLogin}>
            <label>Email:</label>
            <input
              type="email"
              placeholder="Type your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label>Password:</label>
            <input
              type="password"
              placeholder="Type your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <button type="submit" className="login-frm-btn">
              Login
            </button>

            <p>
              Don’t have an account? <Link to="/register">Register here</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
