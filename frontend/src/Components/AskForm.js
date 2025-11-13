import React, { useState } from "react";

export default function AskForm({ onCancel, onAskCreated }) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const currentSection = localStorage.getItem("currentSection");
  console.log(currentSection, "currentSection");

  // Map each section to its own endpoint
  const askEndpointMap = {
    general: "generalAsk",
    job: "jobAsk",
    coaching: "caochingAsk",
    tiffin: "tiffinAsk",
    accommodation: "accommodation",
    entertainment: "EntertainmentAsk",
    useditem: "useditemAsk",
    notes: "noteAsk",
  };

  const askRoute = askEndpointMap[currentSection] || "general";
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert("Please enter a question or content.");
      return;
    }
    if (!userId) {
      alert("User not logged in. Please log in first.");
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `http://localhost:5000/${currentSection}/${askRoute}`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userId,
          content: content,
        }),
      });

      const data = await res.json();
      console.log("AskForm API Response:", data);

      if (data.message?.includes("created")) {
        alert(`${currentSection} ask created successfully!`);
        if (onAskCreated) onAskCreated(data);
        setContent("");
        onCancel();
      } else {
        alert("Failed to create ask. Please try again.");
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
      <h4 className="post-form-title">Create New Ask</h4>

      <div className="post-input-header">
        <textarea
          placeholder="What's your question?"
          className="post-textarea"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>

      <div className="postForm-options">
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
