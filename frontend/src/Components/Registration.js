import React, { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { FaPen } from "react-icons/fa";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

export default function Register() {
  const [image, setImage] = useState(null);
  const [cropData, setCropData] = useState(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null); 

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgURL = URL.createObjectURL(file);
      setImage(imgURL);
    }
  };

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

  const handleOpenFilePicker = () => {
    fileInputRef.current.click();
  };

  const handleReupload = () => setCropData(null);

  return (
    <div className="register-wrapper">
      <div className="register-frm">
        <h1>Create Account</h1>

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
                style={{
                  width: "300px",
                  height: "300px",
                  borderRadius: "10px",
                }}
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

        <label>Name:</label>
        <input type="text" placeholder="Type your name" required />
        <label>Email:</label>
        <input type="email" placeholder="Type your email" required />
        <label>Mobile Number</label>
        <input type="number" placeholder="Type your mobile number" required />
        <label>Password:</label>
        <input type="password" placeholder="Type your password" required />
        <label>College:</label>
        <input type="text" placeholder="Type your college" required />
        <label>City:</label>
        <select>
          <option value="indore">Indore</option>
          <option value="bhopal">Bhopal</option>
          <option value="dewas">Dewas</option>
          <option value="jabalpur">Jabalpur</option>
        </select>
        <label>Field:</label>
        <select>
          <option value="engineer">Engineer</option>
          <option value="doctor">Doctor</option>
          <option value="lawyer">Lawyer</option>
          <option value="banker">Banker</option>
          <option value="pharmacist">Pharmacist</option>
        </select>
        <label>Year:</label>
        <select>
          <option value="1st">1 year</option>
          <option value="2nd">2 year</option>
          <option value="3rd">3 year</option>
          <option value="4th">4 year</option>
        </select>
        <label>Type:</label>
        <select>
          <option value="Student">Student</option>
          <option value="HR">HR</option>
        </select>

        <button className="register-frm-btn">Submit</button>
        <p>
          If you already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
}
