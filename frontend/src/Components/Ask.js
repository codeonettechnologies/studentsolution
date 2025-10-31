import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

// Single Answer Item
function AnswerItem({ a, onDelete }) {
  const [showMenu, setShowMenu] = useState(false);

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this reply?")) {
      onDelete(a.id);
    }
    setShowMenu(false);
  };

  return (
    <div
      style={{
        position: "relative",
        background: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "10px 15px",
        marginBottom: "12px",
      }}
    >
      <p
        style={{ margin: 0, fontSize: "14px", color: "#333", lineHeight: 1.4 }}
      >
        <strong>{a.name}:</strong> {a.content}
      </p>

      {/* Three-dot menu */}
      <div
        style={{
          position: "absolute",
          right: "10px",
          top: "10px",
          cursor: "pointer",
        }}
      >
        <span
          onClick={() => setShowMenu((prev) => !prev)}
          style={{ fontSize: "18px", color: "#555" }}
        >
          &#x22EE;
        </span>
        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "22px",
              background: "#fff",
              border: "1px solid #ccc",
              borderRadius: "6px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
              minWidth: "100px",
              zIndex: 100,
              textAlign: "center",
              animation: "fadeIn 0.15s forwards",
            }}
          >
            <button
              onClick={handleDeleteClick}
              style={{
                background: "none",
                border: "none",
                padding: "8px 12px",
                width: "100%",
                cursor: "pointer",
                fontSize: "14px",
                color: "red",
                borderRadius: "4px",
              }}
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function QuestionItem({ q, onQuestionDeleted, userId }) {
  const [reply, setReply] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

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
    if (!reply.trim() || !userData?.id) return;

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
        const data = await res.json();
        setAllAnswers((prev) => [
          ...prev,
          {
            id: data.id,
            user_id: userData.id,
            name: userData.name || "You",
            content: reply,
          },
        ]);
        setReply("");
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setLoadingReply(false);
    }
  };

  // Delete Reply
  const handleDeleteReply = async (replyId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/${currentSection}/reply/${replyId}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) setAllAnswers((prev) => prev.filter((a) => a.id !== replyId));
    } catch (error) {
      console.error(error);
    }
  };

  // Delete Question
  const handleDeleteQuestion = async () => {
    if (!window.confirm("Are you sure you want to delete this question?"))
      return;
    try {
      const res = await fetch(
        `http://localhost:5000/${currentSection}/ask/${q.id}`,
        {
          method: "DELETE",
        }
      );
      if (res.ok) onQuestionDeleted(q.id);
    } catch (error) {
      console.error(error);
    }
    setShowMenu(false);
  };

  const visibleReplies = showAll ? allAnswers : allAnswers.slice(0, 1);

  return (
    <div
      style={{
        position: "relative",
        background: "#f9f9f9",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
        padding: "15px",
        marginBottom: "15px",
      }}
    >
      {/* Question Header */}
      <div
        style={{ display: "flex", alignItems: "center", position: "relative" }}
      >
        <img
          src={`http://localhost:5000/uploads/${q.profile_image}`}
          alt="profile"
          style={{
            width: "40px",
            height: "40px",
            borderRadius: "50%",
            marginRight: "10px",
          }}
        />
        <div>
          <div style={{ fontSize: "14px", color: "#333" }}>
            <strong>{q.name || q.user_name}</strong> | {q.college} |{" "}
            {new Date(q.created_at).toLocaleDateString()}
          </div>
        </div>

        {/* Three-dot menu */}
        {q.user_id === userId && (
          <div style={{ position: "absolute", right: "0", cursor: "pointer" }}>
            <span
              style={{ fontSize: "18px", color: "#555" }}
              onClick={() => setShowMenu((prev) => !prev)}
            >
              &#x22EE;
            </span>
            {showMenu && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "22px",
                  background: "#fff",
                  border: "1px solid #ccc",
                  borderRadius: "6px",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.15)",
                  minWidth: "100px",
                  zIndex: 100,
                  textAlign: "center",
                }}
              >
                <button
                  onClick={handleDeleteQuestion}
                  style={{
                    background: "none",
                    border: "none",
                    padding: "8px 12px",
                    width: "100%",
                    cursor: "pointer",
                    fontSize: "14px",
                    color: "red",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Question Content */}
      <p style={{ margin: "10px 0", fontSize: "14px", color: "#333" }}>
        {q.content}
      </p>

      {/* Reply Input */}
      <form
        style={{ display: "flex", marginBottom: "10px" }}
        onSubmit={handleReply}
      >
        <input
          type="text"
          placeholder="Reply..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          style={{
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            marginRight: "8px",
          }}
        />
        <button
          type="submit"
          disabled={!reply.trim() || loadingReply}
          style={{
            padding: "8px 14px",
            borderRadius: "6px",
            border: "none",
            backgroundColor: "#007bff",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          {loadingReply ? "Sending..." : "Reply"}
        </button>
      </form>

      {/* Replies Section */}
      <div>
        <h5 style={{ fontSize: "14px", marginBottom: "5px" }}>
          Replies ({allAnswers.length})
        </h5>
        {visibleReplies.map((a) => (
          <AnswerItem
            key={a.id}
            a={a}
            onDelete={handleDeleteReply}
            userId={userId}
          />
        ))}
        {allAnswers.length > 1 && (
          <button
            onClick={() => setShowAll(!showAll)}
            style={{
              background: "none",
              border: "none",
              color: "#007bff",
              cursor: "pointer",
              fontSize: "13px",
              marginTop: "5px",
            }}
          >
            {showAll ? "...less" : "...more"}
          </button>
        )}
      </div>
    </div>
  );
}

export default function Ask({ searchQuery }) {
  const [questions, setQuestions] = useState([]);
  const [originalQuestions, setOriginalQuestions] = useState([]);
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

  //-------------------- Search Asks --------------------

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setQuestions(originalQuestions);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/${currentSection}/searchAsk?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
        if (Array.isArray(data)) setQuestions(data);
      } catch (err) {
        console.error("Search Ask error:", err);
      }
    };
    fetchSearchResults();
  }, [searchQuery, currentSection, originalQuestions]);

  // Handle question deletion from list
  const handleQuestionDeleted = (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="ask-feed">
      {Array.isArray(questions) && questions.length > 0 ? (
        questions.map((q) => (
          <QuestionItem
            key={q.id}
            q={q}
            userId={userId}
            isMyPostsPage={isMyPostsPage}
            onQuestionDeleted={handleQuestionDeleted}
          />
        ))
      ) : (
        <p>No questions found.</p>
      )}
    </div>
  );
}
