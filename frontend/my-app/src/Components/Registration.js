import React from "react";
import { Link } from "react-router-dom";

export default function Register() {
  return (
    <>
      <div className="register-wrapper">
        <div className="register-frm">
          <h1>Registration</h1>
          <label>Name:</label>
          <input type="text" placeholder="type your name" required />
          <label>Email:</label>
          <input type="email" placeholder="type your email" required />
          <label>Mobile Number</label>
          <input type="number" placeholder="type your mobile number" required />
          <label>Password:</label>
          <input type="password" placeholder="type your password" required />
          <label>College:</label>
          <input type="text" placeholder="type your college" required />
          <label>Field:</label>
          <select>
            <option value="engineer">Engineer</option>
            <option value="doctor">Doctor</option>
            <option value="layer">Layer</option>
            <option value="banker">Banker</option>
            <option value="pharmassit">pharmassit</option>
          </select>
          <label>Year:</label>
          <select>
            <option value="1st">1 year</option>
            <option value="2nd">2 year</option>
            <option value="3rd">3 year</option>
            <option value="4th">4 year</option>
          </select>
          <label>City:</label>
          <select>
            <option value="indore">Indore</option>
            <option value="bhopal">Bhopal</option>
            <option value="dewas">Dewas</option>
            <option value="jabalpur">Jabalpur</option>
          </select>
          <button className="register-frm-btn">Submit</button>
          <p>
            If you already have an account? <Link to="/login">Login Here</Link>
          </p>
        </div>
      </div>
    </>
  );
}
