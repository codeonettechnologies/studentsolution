import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

function AnswerItem({ name, profile_image, content, college }) {
  return (
    <div className="answer-item">
      <div className="answer-user-info">
        <div>
          <strong>{name}</strong>
        </div>
      </div>
      <p className="answer-text">{content}</p>
    </div>
  );
}

function QuestionItem({ q }) {
  const [reply, setReply] = useState("");
  const [allAnswers, setAllAnswers] = useState([]);
  const [loadingReply, setLoadingReply] = useState(false);

  const currentSection = localStorage.getItem("currentSection");
  const userData = JSON.parse(localStorage.getItem("user")) || {};

  //Step 1: Fetch Replies for this Question
  useEffect(() => {
    const fetchReplies = async () => {
      try {
        const res = await fetch(`http://localhost:5000/${currentSection}/${q.id}`);
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

  // Step 2: Submit Reply
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
          {
            name: userData.name || "You",
            content: reply,
            profile_image: userData.profile_image || "default-profile.png",
            college: userData.college || "",
          },
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

  return (
    <div className="question-item profile-item">
      <div className="profile-header">
        <img
          src={`http://localhost:5000/uploads/${q.profile_image}`}
          alt="profile"
          className="profile-logo"
        />
        <div className="profile-info">
          <h3 className="profile-name">{q.name}</h3>
          <span className="college-name">{q.college}</span>
        </div>
      </div>

      <div className="question-content inner-content">
        <p className="message-post">{q.content}</p>
      </div>

      <form className="reply-input-area comment-input-area" onSubmit={handleReply}>
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

      <div className="answers-section">
        <h5 className="answers-heading">Answers ({allAnswers.length})</h5>
        {allAnswers.map((a, i) => (
          <AnswerItem
            key={i}
            name={a.name}
            content={a.content}
            profile_image={a.profile_image}
            college={a.college}
          />
        ))}
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

  // detect whether user is on MyPostAsk page
  const isMyPostsPage = location.pathname.includes("mypostask");

  //Step 3: Fetch all Asks (or self asks)
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        let apiUrl = `http://localhost:5000/${currentSection}/${currentSection}AskGet`;
        if (isMyPostsPage && userId) {
          apiUrl = `http://localhost:5000/${currentSection}/askGet/${userId}`;
        }

        const res = await fetch(apiUrl);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setQuestions(data);
          } else if (Array.isArray(data.data)) {
            setQuestions(data.data);
          } else {
            console.error("Unexpected response format:", data);
            setQuestions([]);
          }
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
