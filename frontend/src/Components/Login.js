import React from "react";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <>
      <div className="login-wrapper">
        <div className="login-form">
          <div className="login">
            <h1>Login</h1>
            <div className="login-field">
              <label>Email:</label>
              <input type="email" placeholder="type your email" required />
              <label>Password:</label>
              <input
                type="password"
                placeholder="type your password"
                required
              />
              <button className="login-frm-btn">Login</button>
              <p>
                Already have an account?{" "}
                <Link to="/register">Register here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
