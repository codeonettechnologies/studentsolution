import React, { useState, useEffect } from "react";

export default function PostForm({ onCancel, onSubmit }) {
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
    postImageSrc: preview || ""   
  });
};

  return (
    <div className="create-post-form-section">
      <h4 className="post-form-title">Create New Post</h4>

      <div className="post-input-header">
        <img src="default-profile.png" alt="user" className="current-user-profile-logo" />
        <textarea
          placeholder="What's on your mind?"
          className="post-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
      </div>

      {preview && (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="post-image-preview" />
          <button className="remove-image-button" onClick={() => setFile(null)}>
            × Remove Photo
          </button>
        </div>
      )}

      <input type="file" id="file-upload" accept="image/*" style={{ display: "none" }} onChange={(e) => setFile(e.target.files[0])} />

      <div className="post-options">
        {!file && (
          <label htmlFor="file-upload" className="post-option-button photo-button">
            📸 Photo
          </label>
        )}
        <button className="post-submit-button cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button className="post-submit-button" onClick={handleSubmit} disabled={!message.trim() && !file}>
          Post
        </button>
      </div>
    </div>
  );
}
