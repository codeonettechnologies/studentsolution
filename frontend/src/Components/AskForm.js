import React, { useState, useEffect } from "react";

export default function AskForm({ onCancel, onSubmit }) {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);
  const handleSubmit = () => {
    if (!message.trim() && !file) {
      alert("Please enter a message or select a file.");
      return;
    }
    onSubmit({
      message,
      postImageSrc: file
        ? "https://via.placeholder.com/600x400.png?text=Uploaded+Image"
        : "",
    });
  };
  return (
    <div className="create-post-form-section">
      <h4 className="post-form-title">Create New ask</h4>
      <div className="post-input-header">
        <img
          src="default-profile.png"
          alt="user"
          className="current-user-profile-logo"
        />
        <textarea
          placeholder="What's on your mind?"
          className="post-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>
        <button className="post-submit-button cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="post-submit-button"
          onClick={handleSubmit}
          disabled={!message.trim() && !file}
        >
          Post
        </button>
      
    </div>
  );
}
