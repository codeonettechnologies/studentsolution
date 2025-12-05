import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { UserContext } from "./userContext";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(UserContext); 
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast("Please enter both email and password!");
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
        //Update UserContext so Header updates automatically
        setUser(data.user);

        //Optional: localStorage (UserProvider already syncs)
        localStorage.setItem("user", JSON.stringify(data.user));
        
       // localStorage.setItem("userId", data.user.id);
        // localStorage.setItem("userName", data.user.name);
        // localStorage.setItem("userEmail", data.user.email);
        // localStorage.setItem("userType", data.user.type);
        // localStorage.setItem("userCollege", data.user.college);
        // localStorage.setItem("userCity", data.user.city);


        toast.success("Login Successful!");
        console.log(data.user);

        if (data.user.role === "Admin") {
          navigate("/admindashboard");
        } else {
          navigate("/dashboard");
        }
      } else {
        toast.error(data.message || "Invalid credentials!");
      }
    } catch (error) {
      console.error("Login Error:", error);
      toast("Something went wrong. Check console for details.");
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