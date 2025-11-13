import React, { useState, useEffect } from "react";

export default function PostForm({ onCancel, onPostCreated }) {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const currentSection = localStorage.getItem("currentSection");
  console.log(currentSection);

  // image preview
  useEffect(() => {
    if (!file) return setPreview(null);
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleSubmit = async () => {
    if (currentSection === "useditem") {
      if (!title.trim() || !content.trim() || !price.trim()) {
        alert("Please enter title, price and description.");
        return;
      }
    } else if (!content.trim() && !file) {
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

      if (currentSection === "useditem") {
        formData.append("title", title);
        formData.append("description", content);
        formData.append("price", price);
      } else {
        formData.append("content", content);
      }

      if (file) formData.append("image", file);

      // handle Used Item API separately
      let apiUrl;
      if (currentSection === "useditem") {
        apiUrl = "http://localhost:5000/usedItem/post/create";
      } else {
        apiUrl = `http://localhost:5000/${currentSection}/post/create`;
      }

      const res = await fetch(apiUrl, { method: "POST", body: formData });
      const data = await res.json();

      console.log("Response:", data);

      if (
        data.message === "Job post created" ||
        data.message === "Used item post created successfully" ||
        data.message.includes("created")
      ) {
        alert(`${currentSection} post created successfully!`);
        if (onPostCreated) onPostCreated(data);
        setContent("");
        setTitle("");
        setPrice("");
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

      {/* Used Item form fields */}
      {currentSection === "useditem" ? (
        <>
          <input
            type="text"
            value={title}
            placeholder="Enter title..."
            onChange={(e) => setTitle(e.target.value)}
            className="post-input title-input"
          />

          <input
            type="number"
            value={price}
            placeholder="Enter price..."
            onChange={(e) => setPrice(e.target.value)}
            className="post-input title-input"
          />

          <textarea
            placeholder="Enter description..."
            value={content}
            rows="8"
            onChange={(e) => setContent(e.target.value)}
            className="post-textarea description-textarea"
          />
        </>
      ) : (
        // Normal post
        <div className="post-input-header">
          <textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="post-textarea"
          />
        </div>
      )}

      {/* image preview */}
      {preview && (
        <div className="image-preview-container">
          <img src={preview} alt="Preview" className="post-image-preview" />
          <button className="remove-image-button" onClick={() => setFile(null)}>
            × Remove Photo
          </button>
        </div>
      )}

      {/* upload buttons */}
      <input
        type="file"
        id="file-upload"
        accept="image/*"
        style={{ display: "none" }}
        onChange={(e) => setFile(e.target.files[0])}
      />

      <div className="postForm-options">
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
