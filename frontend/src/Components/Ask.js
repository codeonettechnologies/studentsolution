import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnswerItem({ name, content }) {
  return (
    <div className="answer-item">
      <p className="answer-text">
        <strong>{name}:</strong> {content}
      </p>
    </div>
  );
}
function QuestionItem({ q }) {
  const [reply, setReply] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const [showAll, setShowAll] = useState(false); // for ...more/less toggle

  const currentSection = localStorage.getItem("currentSection");
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  // Fetch Replies
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/${currentSection}/${q.id}`
        );
        if (res.ok) {
          const data = await res.json();
          setAllAnswers(Array.isArray(data) ? data : []);
        } else {
          console.error("Failed to fetch replies:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
      }
    };
    fetchReplies();
  }, [q.id, currentSection]);

  // Submit Reply
  const handleReply = async (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    if (!userData?.id) {
      alert("Please login to reply.");
      return;
    }

    setLoadingReply(true);
    try {
      const apiUrl = `http://localhost:5000/${currentSection}/${currentSection}Reply`;
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: userData.id,
          ask_reply_id: q.id,
          content: reply,
        }),
      });

      if (res.ok) {
        setAllAnswers((prev) => [
          ...prev,
          { name: userData.name || "You", content: reply },
        ]);
        setReply("");
      } else {
        console.error("Error submitting reply:", res.statusText);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoadingReply(false);
    }
  };

  // Visible Replies
  const visibleReplies = showAll ? allAnswers : allAnswers.slice(0, 1);

  return (
    <div className="question-item profile-item">
      {/* Question Header */}
      <div className="profile-header">
        <img
          src={`http://localhost:5000/uploads/${q.profile_image}`}
          alt="profile"
          className="profile-logo"
        />
        <div className="profile-info">
          <div className="profile-details">
            <h3 className="profile-name">{q.name ||q.user_name}</h3>
            <span className="divider">|</span>
            <span className="coll-name">{q.college}</span>
            <span className="divider">|</span>
            <span className="created-date">
              {new Date(q.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        </div>
      </div>

      {/* Question Content */}
      <div className="question-content inner-content">
        <p className="message-post">{q.content}</p>
      </div>

      {/* Reply Input */}
      <form
        className="reply-input-area comment-input-area"
        onSubmit={handleReply}
      >
        <input
          type="text"
          placeholder="Reply to this question..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="comment-input-field"
        />
        <button
          type="submit"
          className="comment-submit-button"
          disabled={!reply.trim() || loadingReply}
        >
          {loadingReply ? "Sending..." : "Reply"}
        </button>
      </form>

      {/* Replies Section */}
      <div className="answers-section">
        <h5 className="answers-heading">Replies ({allAnswers.length})</h5>

        {visibleReplies.map((a, i) => (
          <AnswerItem key={i} name={a.name} content={a.content} />
        ))}

        {/* ...more / ...less toggle */}
        {allAnswers.length > 1 && (
          <button
            className="toggle-answers-btn"
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? "...less" : "...more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Ask() {
  const [questions, setQuestions] = useState([]);
  const currentSection = localStorage.getItem("currentSection");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const location = useLocation();

  const isMyPostsPage = location.pathname.includes("mypostask");

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let apiUrl = `http://localhost:5000/${currentSection}/${currentSection}AskGet`;
        if (isMyPostsPage && userId) {
          apiUrl = `http://localhost:5000/${currentSection}/askGet/${userId}`;
        }

        const res = await fetch(apiUrl);
        console.log(res);
        
        if (res.ok) {
          const data = await res.json();
          
          
          if (Array.isArray(data)) setQuestions(data);
          else if (Array.isArray(data.data)) setQuestions(data.data);
          else setQuestions([]);
        } else {
          console.error("Failed to fetch questions:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching questions:", error);
        setQuestions([]);
      }
    };
    fetchQuestions();
  }, [currentSection, userId, isMyPostsPage]);

  return (
    <div className="ask-feed">
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((q) => <QuestionItem key={q.id} q={q} />)
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
}
