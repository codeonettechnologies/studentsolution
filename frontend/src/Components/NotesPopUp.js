import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function LearningPopup({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("popup-open");
    } else {
      document.body.classList.remove("popup-open");
    }
    return () => document.body.classList.remove("popup-open");
  }, [isOpen]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  console.log("user", userId);

  const [formData, setFormData] = useState({
    topic: "",
    details: "",
    image: null,
    pdf: null,
    userId: "",
  });

  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleSubmit = async (e) => {
    if (!userId) {
      toast.error("User not logged in. Please log in first.");
      return;
    }
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("topic", formData.topic);
      data.append("details", formData.details);
      data.append("userId", userId);
      if (formData.image) data.append("image", formData.image);
      if (formData.pdf) data.append("pdf", formData.pdf);

      const res = await fetch("http://localhost:5000/notes/notePost", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok && result.message) {
        toast.success(" " + result.message);
        setFormData({ topic: "", details: "", image: null, pdf: null });
        onClose();
      } else {
        toast.error("Failed to upload note");
      }
    } catch (error) {
      console.error("Error uploading note:", error);
      toast("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
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
            name="topic"
            placeholder="Enter topic"
            value={formData.topic}
            onChange={handleChange}
            required
          />

          <label>Details:</label>
          <textarea
            name="details"
            placeholder="Enter topic details"
            value={formData.details}
            onChange={handleChange}
            rows="8"
            required
          ></textarea>

          <div className="upload-row">
            <div className="upload-field">
              <label>Upload Image:</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleFileChange}
              />
            </div>

            <div className="upload-field">
              <label>Upload PDF:</label>
              <input
                type="file"
                name="pdf"
                accept=".pdf"
                onChange={handleFileChange}
              />
            </div>
          </div>

          <button type="submit" className="note-submit-btn" disabled={loading}>
            {loading ? "Uploading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
