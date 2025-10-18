import React, { useState, useEffect } from "react";

export default function PostForm({ onCancel, onPostCreated }) {
  const [content, setContent] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  // console.log(user);
  // console.log(userId);

  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const currentSection = localStorage.getItem("currentSection");
console.log(currentSection);

  const handleSubmit = async () => {
    if (!content.trim() && !file) {
      alert("Please write something or upload an image.");
      return;
    }
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("user_id", userId);
      formData.append("content", content);
      if (file) formData.append("image", file);
      const apiUrl = `http://localhost:5000/${currentSection}/post/create`;
      const res = await fetch(apiUrl, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("API Response:", data);

      if (
        data.message === "Job post created" ||
        data.message.includes("created")
      ) {
        alert(`✅ ${currentSection} post created successfully!`);
        if (onPostCreated) onPostCreated(data);
        setContent("");
        setFile(null);
        setPreview(null);
        onCancel();
      } else {
        alert("Failed to create post. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="create-post-form-section">
      <h4 className="post-form-title">Create New Post</h4>

      <div className="post-input-header">
        {/* <img
          src={
            user?.profile_image
              ? `http://localhost:5000/uploads/${user.profile_image}`
              : "default-profile.png"
          }
          alt={user?.name || "user"}
          className="current-user-profile-logo"
        /> */}

        <textarea
          placeholder="What's on your mind?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="post-textarea"
        />
      </div>

      {preview && (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="post-image-preview" />
          <button className="remove-image-button" onClick={() => setFile(null)}>
            × Remove Photo
          </button>
        </div>
      )}

      <input
        type="file"
        id="file-upload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <div className="post-options">
        {!file && (
          <label
            htmlFor="file-upload"
            className="post-option-button photo-button"
          >
            📸 Photo
          </label>
        )}
        <button className="post-submit-button cancel-button" onClick={onCancel}>
          Cancel
        </button>
        <button
          className="post-submit-button"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Posting..." : "Post"}
        </button>
      </div>
    </div>
  );
}
