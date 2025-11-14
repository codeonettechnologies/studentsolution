import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import axios from "axios";

export default function Register() {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [colleges, setColleges] = useState([]);
  const [cities, setCities] = useState([]);
  const [professions, setProfessions] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile_number: "",
    password: "",
    college: "",
    city: "",
    college_year: "1st Year",
    role: "Student",
    profession: "",
  });

  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Fetch colleges, cities, professions
  useEffect(() => {
    fetchColleges();
    fetchCities();
    fetchProfessions();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/getAllCollege");
      if (Array.isArray(res.data.colleges)) setColleges(res.data.colleges);
      else if (Array.isArray(res.data)) setColleges(res.data);
    } catch (err) {
      console.error("Error fetching colleges:", err);
      alert("Failed to load colleges!");
    }
  };

  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/getAllCity");
      if (Array.isArray(res.data)) setCities(res.data);
    } catch (err) {
      console.error("Error fetching cities:", err);
      alert("Failed to load cities!");
    }
  };

  const fetchProfessions = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/admin/getAllProfessions"
      );
      if (Array.isArray(res.data)) setProfessions(res.data);
    } catch (err) {
      console.error("Error fetching professions:", err);
      alert("Failed to load professions!");
    }
  };

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle image select
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
    }
  };

  // Crop and make circular
  const handleCrop = () => {
    if (cropperRef.current && cropperRef.current.cropper) {
      const croppedCanvas = cropperRef.current.cropper.getCroppedCanvas({
        width: 200,
        height: 200,
      });

      const circleCanvas = document.createElement("canvas");
      const ctx = circleCanvas.getContext("2d");
      const size = 200;
      circleCanvas.width = size;
      circleCanvas.height = size;

      ctx.beginPath();
      ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(croppedCanvas, 0, 0, size, size);

      const cropped = circleCanvas.toDataURL();
      setCropData(cropped);
      setImage(null);
    }
  };

  const handleOpenFilePicker = () => fileInputRef.current.click();
  const handleReupload = () => setCropData(null);

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      const formToSend = new FormData();
      for (const key in formData) formToSend.append(key, formData[key]);

      if (cropData) {
        const blob = await (await fetch(cropData)).blob();
        formToSend.append("profile_image", blob, "profile.png");
      }

      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        body: formToSend,
      });

      const data = await response.json();
      console.log("Register Response:", data);

      if (data.success) {
        alert("Registration Successful!");
        navigate("/");
      } else {
        alert(data.message || "Registration failed.");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong. Check console.");
    }
  };

  return (
    <div className="register-wrapper">
      <div className="register-frm">
        <h1>Create Account</h1>

        {/* Image upload/crop */}
        <div className="upload-circle">
          {cropData ? (
            <div className="circle-preview">
              <img src={cropData} alt="Profile" className="circle-img" />
              <button className="reupload-btn" onClick={handleReupload}>
                Change Image
              </button>
            </div>
          ) : image ? (
            <div className="circle-cropper">
              <Cropper
                ref={cropperRef}
                src={image}
                aspectRatio={NaN}
                viewMode={1}
                background={false}
                guides={true}
                dragMode="crop"
                cropBoxResizable={true}
                cropBoxMovable={true}
                movable={true}
                zoomable={true}
                style={{ width: "300px", height: "300px", borderRadius: "10px" }}
              />
              <button className="crop-btn" onClick={handleCrop}>
                Done
              </button>
            </div>
          ) : (
            <div className="circle-placeholder">No Image</div>
          )}

          {!image && !cropData && (
            <>
              <button className="upload-btn" onClick={handleOpenFilePicker}>
                <FaPen className="upload-icon" /> Upload Image
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />
            </>
          )}
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            placeholder="Type your name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Email:</label>
          <input
            type="email"
            name="email"
            placeholder="Type your email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Mobile Number:</label>
          <input
            type="number"
            name="mobile_number"
            placeholder="Type your mobile number"
            value={formData.mobile_number}
            onChange={handleChange}
            required
          />

          <label>Password:</label>
          <input
            type="password"
            name="password"
            placeholder="Type your password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <label>College:</label>
          <select
            name="college"
            value={formData.college}
            onChange={handleChange}
            required
          >
            <option value="">Select College</option>
            {colleges.map((c, idx) => (
              <option key={idx} value={c.college}>
                {c.college}
              </option>
            ))}
          </select>

          <label>City:</label>
          <select name="city" value={formData.city} onChange={handleChange}>
            <option value="">Select City</option>
            {cities.map((c, idx) => (
              <option key={idx} value={c.city}>
                {c.city}
              </option>
            ))}
          </select>

          <label>Year:</label>
          <select
            name="college_year"
            value={formData.college_year}
            onChange={handleChange}
          >
            <option value="1st Year">1st Year</option>
            <option value="2nd Year">2nd Year</option>
            <option value="3rd Year">3rd Year</option>
            <option value="4th Year">4th Year</option>
          </select>

          <label>Profession:</label>
          <select
            name="profession"
            value={formData.profession}
            onChange={handleChange}
          >
            <option value="">Select Profession</option>
            {professions.map((f, idx) => (
              <option key={idx} value={f.profession}>
                {f.profession}
              </option>
            ))}
          </select>

          <label>Role:</label>
          <select name="role" value={formData.role} onChange={handleChange}>
            <option value="Student">Student</option>
            <option value="HR">HR</option>
            <option value="Admin">Admin</option>
          </select>

          <button type="submit" className="register-frm-btn">
            Submit
          </button>
        </form>

        <p>
          Already have an account? <Link to="/">Login Here</Link>
        </p>
      </div>
    </div>
  );
}
