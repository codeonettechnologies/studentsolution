import React, { useState } from "react";

export default function LearningPopup({ isOpen, onClose }) {
  const [formData, setFormData] = useState({
    title: "",
    details: "",
    image: null,
    pdf: null,
  });

  if (!isOpen) return null; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    alert("Form submitted successfully!");
    onClose(); 
  };

  return (
    <div className="note-popup-overlay" onClick={onClose}>
      <div className="note-popup-content" onClick={(e) => e.stopPropagation()}>
        <button className="note-popup-close" onClick={onClose}>
          ✖
        </button>
        <form onSubmit={handleSubmit} className="learning-form">
          <label>Topic:</label>
          <input
            type="text"
            name="title"
            placeholder="Enter topic"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Details:</label>
          <textarea
            name="details"
            placeholder="Enter topic details"
            value={formData.details}
            onChange={handleChange}
            rows="4"
            required
          ></textarea>

          <label>Upload Image:</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
          />

          <label>Upload PDF:</label>
          <input
            type="file"
            name="pdf"
            accept=".pdf"
            onChange={handleFileChange}
          />

          <button type="submit" className="note-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
