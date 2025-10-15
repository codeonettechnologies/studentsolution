import React, { useEffect, useState } from "react";

export default function PostItem() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);

  const currentSection = localStorage.getItem("currentSection");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // -------------------- Fetch Posts --------------------
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `http://localhost:5000/${currentSection}/post/get`
        );
        const data = await res.json();

        if (data.data) {
          const postsWithData = await Promise.all(
            data.data.map(async (p) => {
              // Fetch comments
              const commentsRes = await fetch(
                `http://localhost:5000/${currentSection}/${p.id}/comments`
              );
              const commentsData = await commentsRes.json();

              const postComments = (commentsData.data || []).map((c) => ({
                id: c.id,
                user_name: c.user_name || "Unknown",
                text: c.comment_text,
              }));

              // Fetch like info dynamically based on section
              const postIdParam = `${currentSection}_post_id`;
              let likesCount = 0;
              let likedByUser = false;

              try {
                const likeRes = await fetch(
                  `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${p.id}&user_id=${userId}`
                );
                const likeData = await likeRes.json();

                likesCount = likeData.total_likes || 0;
                likedByUser = likeData.liked || false;
              } catch (error) {
                console.warn("Like fetch failed for post:", p.id, error);
              }

              return {
                id: p.id,
                name: p.user_name || "Unknown User",
                college: p.user_college || "",
                message: p.content,
                image: p.image_url
                  ? `http://localhost:5000/uploads/${currentSection}_posts/${p.image_url}`
                  : null,
                profile_image: p.profile_image
                  ? `http://localhost:5000/uploads/${p.profile_image}`
                  : "default-profile.png",
                likes: likesCount,
                liked: likedByUser,
                comments: postComments,
              };
            })
          );

          setPosts(postsWithData);
        }
      } catch (err) {
        console.error("Error fetching posts:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [currentSection, userId]);

  // -------------------- Like / Unlike --------------------
  const toggleLike = async (id, liked) => {
    try {
      const postIdParam = `${currentSection}_post_id`;

      const res = await fetch(
        `http://localhost:5000/${currentSection}/like/unlike`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            [postIdParam]: id,
            action: liked ? "unlike" : "like",
          }),
        }
      );

      if (res.ok) {
        // Fetch updated like info
        const likeRes = await fetch(
          `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${id}&user_id=${userId}`
        );
        const likeData = await likeRes.json();

        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  liked: likeData.liked,
                  likes: likeData.total_likes,
                }
              : p
          )
        );
      }
    } catch (err) {
      console.error("Error toggling like:", err);
    }
  };


  // -------------------- Add Comment --------------------
  const addComment = async (id, text) => {
    try {
      const postIdParam = `${currentSection}_post_id`;

      const res = await fetch(
        `http://localhost:5000/${currentSection}/comment`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: userId,
            [postIdParam]: id,
            comment_text: text,
          }),
        }
      );

      const data = await res.json();

      if (data.message.includes("Comment added")) {
        const commentsRes = await fetch(
          `http://localhost:5000/${currentSection}/${id}/comments`
        );
        const commentsData = await commentsRes.json();

        const postComments = (commentsData.data || []).map((c) => ({
          id: c.id,
          user_name: c.user_name || "Unknown",
          text: c.comment_text,
        }));

        setPosts((prev) =>
          prev.map((p) => (p.id === id ? { ...p, comments: postComments } : p))
        );
      }
    } catch (err) {
      console.error("Error adding comment:", err);
    }
  };

  // -------------------- Toggle Comments --------------------
  const toggleComments = (id) => {
    setExpandedPostId((prev) => (prev === id ? null : id));
  };

  // -------------------- UI --------------------
  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0)
    return <p>No posts available in {currentSection} section.</p>;

  return (
    <div>
      {posts.map((p) => (
        <div key={p.id} className="profile-item">
          <div className="profile-header">
            <img
              src={p.profile_image || "default-profile.png"}
              alt={p.name || "profile"}
              className="profile-logo"
            />
            <div className="profile-info">
              <h3 className="profile-name">{p.name}</h3>
              <span className="college-name">{p.college}</span>
            </div>
          </div>

          <div className="inner-content">
            <p className="message-post">{p.message}</p>
            {p.image && <img src={p.image} alt="post" className="post-image" />}
          </div>

          <div className="post-actions">
            <button
              className={`action-button like-button ${p.liked ? "liked" : ""}`}
              onClick={() => toggleLike(p.id, p.liked)}
            >
              {p.liked ? "❤️" : "🤍"} Like ({p.likes})
            </button>

            <button
              className="action-button comment-toggle-button"
              onClick={() => toggleComments(p.id)}
            >
              💬 Comments ({p.comments.length})
            </button>
          </div>

          {expandedPostId === p.id && (
            <>
              <form
                className="comment-input-area"
                onSubmit={(e) => {
                  e.preventDefault();
                  const text = e.target.elements.comment.value;
                  if (!text.trim()) return;
                  addComment(p.id, text);
                  e.target.reset();
                }}
              >
                <input
                  type="text"
                  name="comment"
                  placeholder="Write a comment..."
                  className="comment-input-field"
                />
                <button type="submit" className="comment-submit-button">
                  Send
                </button>
              </form>

              {p.comments.map((c) => (
                <p key={c.id} className="comment-text">
                  <strong>{c.user_name || "Unknown"}:</strong> {c.text}
                </p>
              ))}
            </>
          )}
        </div>
      ))}
    </div>
  );
}
