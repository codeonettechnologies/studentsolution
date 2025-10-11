import React, { useState } from "react";
import PostForm from "./Post";
import Ask from "./Ask";
import Modal from "./PopupModal";

function PostItem({ name, college, message, image, likes, comments }) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(likes);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [allComments, setAllComments] = useState(comments);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  const addComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const newComment = { user: "Current User", text: commentText };
    setAllComments([...allComments, newComment]);
    setCommentText("");
    setShowComments(true);
  };

  return (
    <div className="profile-item">
      <div className="profile-header">
        <img
          src={image || "default-profile.png"}
          className="profile-logo"
          alt="profile"
        />
        <div className="profile-info">
          <h3 className="profile-name">{name}</h3>
          <span className="college-name">{college}</span>
        </div>
      </div>

      <div className="inner-content">
        <p className="message-post">{message}</p>
        {image && <img src={image} alt="post" className="post-image" />}
      </div>

      <div className="post-actions">
        <button
          className={`action-button like-button ${liked ? "liked" : ""}`}
          onClick={toggleLike}
        >
          {liked ? "❤️" : "🤍"} Like ({likeCount})
        </button>
        <button
          className="action-button comment-toggle-button"
          onClick={() => setShowComments(!showComments)}
        >
          {showComments ? "🔽" : "▶️"} Comments ({allComments.length})
        </button>
      </div>

      <form className="comment-input-area" onSubmit={addComment}>
        <input
          type="text"
          placeholder="Write a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="comment-input-field"
        />
        <button
          type="submit"
          className="comment-submit-button"
          disabled={!commentText.trim()}
        >
          Send
        </button>
      </form>

      {showComments &&
        allComments.map((c, i) => (
          <p key={i} className="comment-text">
            <strong>{c.user}:</strong> {c.text}
          </p>
        ))}
    </div>
  );
}

export default function JobContent() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      name: "Jaswant Kumar",
      college: "Acropolis Institute",
      message: "Looking for a MERN stack internship.",
      image: "",
      likes: 45,
      comments: [],
    },
    {
      id: 2,
      name: "Sneha Sharma",
      college: "BITS Pilani",
      message: "Finished my ML project!",
      image: "https://via.placeholder.com/600x400.png?text=ML+Project",
      likes: 120,
      comments: [],
    },
  ]);

  const handleNewPost = (data) => {
    const newPost = {
      id: Date.now(),
      name: "Current User",
      college: "Your College",
      message: data.message || "",
      image: data.postImageSrc || "",
      likes: 0,
      comments: [],
    };
    setPosts([newPost, ...posts]);
    setOpenModal(false);
  };

  return (
    <div className="main-content-area">
      <div className="tab-navigation">
        <button
          className={`tab-button ${tab === "post" ? "active" : ""}`}
          onClick={() => setTab("post")}
        >
          Post
        </button>
        <button
          className={`tab-button ${tab === "ask" ? "active" : ""}`}
          onClick={() => setTab("ask")}
        >
          Ask
        </button>
      </div>

      <div className="feed-header-bar">
        <input
          type="text"
          placeholder="Search posts..."
          className="search-box-input"
        />
        <button
          className="create-post-button"
          onClick={() => setOpenModal(true)}
        >
          +
        </button>
      </div>

      {tab === "ask" ? (
        <Ask />
      ) : (
        posts.map((p) => (
          <PostItem
            key={p.id}
            name={p.name}
            college={p.college}
            message={p.message}
            image={p.image}
            likes={p.likes}
            comments={p.comments}
          />
        ))
      )}

      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        <PostForm
          onCancel={() => setOpenModal(false)}
          onSubmit={handleNewPost}
        />
      </Modal>
    </div>
  );
}
