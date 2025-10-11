import React, { useState } from "react";

function AnswerItem({ user, text, likes }) {
  const [count, setCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  return (
    <div className="answer-item">
      <div className="answer-user-info">
        <img src="default-profile.png" alt="profile" className="profile-logo small-logo" />
        <strong>{user}</strong>
      </div>
      <p className="answer-text">{text}</p>
      <button className="answer-like-button" onClick={() => { if (!liked) { setCount(count + 1); setLiked(true); } }} disabled={liked}>
        👍 Like ({count})
      </button>
    </div>
  );
}

function QuestionItem({ name, college, question, answers }) {
  const [reply, setReply] = useState("");
  const [allAnswers, setAllAnswers] = useState(answers);

  const handleReply = (e) => {
    e.preventDefault();
    if (!reply.trim()) return;
    setAllAnswers([...allAnswers, { user: "Current User", text: reply, likes: 0 }]);
    setReply("");
  };

  return (
    <div className="question-item profile-item">
      <div className="profile-header">
        <img src="default-profile.png" alt="profile" className="profile-logo" />
        <div className="profile-info">
          <h3 className="profile-name">{name}</h3>
          <span className="college-name">{college}</span>
        </div>
      </div>

      <div className="question-content inner-content">
        <p className="message-post">{question}</p>
      </div>

      <form className="reply-input-area comment-input-area" onSubmit={handleReply}>
        <input
          type="text"
          placeholder="Reply to this question..."
          value={reply}
          onChange={(e) => setReply(e.target.value)}
          className="comment-input-field"
        />
        <button type="submit" className="comment-submit-button" disabled={!reply.trim()}>
          Reply
        </button>
      </form>

      <div className="answers-section">
        <h5 className="answers-heading">Answers ({allAnswers.length})</h5>
        {allAnswers.map((a, i) => (
          <AnswerItem key={i} user={a.user} text={a.text} likes={a.likes || 0} />
        ))}
      </div>
    </div>
  );
}

export default function Ask() {
  const questions = [
    {
      id: 1,
      name: "Deepika Patel",
      college: "CULM",
      question: "What are the best free online courses to learn ReactJS in 2024?",
      answers: [
        { user: "Ravi Varma", text: "FreeCodeCamp course is great with projects.", likes: 15 },
        { user: "Pooja Singh", text: "Codecademy basics are helpful.", likes: 5 }
      ]
    },
    {
      id: 2,
      name: "Rahul Sharma",
      college: "IIT Delhi",
      question: "How should I prepare for DSA interviews?",
      answers: []
    }
  ];

  return (
    <div className="ask-feed">
      {questions.map((q) => (
        <QuestionItem key={q.id} name={q.name} college={q.college} question={q.question} answers={q.answers} />
      ))}
    </div>
  );
}
