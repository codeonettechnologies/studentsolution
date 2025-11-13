import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function LearningDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const note = state?.note;

  if (!note) {
    return (
      <div>
        <p>Note not found.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div
      className="learning-details-page"
      style={{ maxWidth: 700, margin: "auto", padding: 20 }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: 20 }}>
        ←
      </button>

      <p style={{ fontSize: 14, color: "#888" }}>Author: {note.user_name}</p>
      <h2>{note.topic}</h2>
      <p>{note.details}</p>

      {note.image_url && (
        <div style={{ margin: "15px 0" }}>
          <p>Image:</p>
          <img
            src={`http://localhost:5000/uploads/notes_post/${note.image_url}`}
            alt={note.topic}
            style={{ width: "100%", borderRadius: 8 }}
          />
        </div>
      )}

      {note.pdf && (
        <div style={{ margin: "15px 0" }}>
          <p>PDF:</p>
          <iframe
            src={`http://localhost:5000/uploads/notes_post/${note.pdf}`}
            title={note.topic}
            width="100%"
            height="600px"
            style={{ border: "1px solid #ccc", borderRadius: 8 }}
          ></iframe>
        </div>
      )}
    </div>
  );
}
