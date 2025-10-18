import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PostItem() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [activeLikesPost, setActiveLikesPost] = useState(null);
  const [likesUsers, setLikesUsers] = useState([]);
  const [activeDropdownPost, setActiveDropdownPost] = useState(null);

  const currentSection = localStorage.getItem("currentSection");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
console.log(posts);

  const location = useLocation();
  const isMyPostsPage = location.pathname.includes("mypostask");

  // -------------------- Fetch Posts --------------------
  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let apiUrl = `http://localhost:5000/${currentSection}/post/get`;
        if (isMyPostsPage) {
          apiUrl = `http://localhost:5000/${currentSection}/postGet/${userId}`;
        }

        const res = await fetch(apiUrl);
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

              // Fetch likes
              const postIdParam = `${currentSection}_post_id`;
              console.log(postIdParam);
              
              let likesCount = 0;
              let likedByUser = false;
              try {
                const likeRes = await fetch(
                  `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${p.id}&user_id=${userId}`
                );
                const likeData = await likeRes.json();
                console.log(likeData);
                
                likesCount = likeData.total_likes || 0;
                likedByUser = likeData.liked || false;
              } catch (error) {
                console.warn("Like fetch failed for post:", p.id, error);
              }
              console.log(postIdParam);
              

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
                created_at: new Date(p.created_at).toLocaleString(),
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
  }, [currentSection, userId, isMyPostsPage]);

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
        const likeRes = await fetch(
          `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${id}&user_id=${userId}`
        );
        const likeData = await likeRes.json();
        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? { ...p, liked: likeData.liked, likes: likeData.total_likes }
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

  // -------------------- Fetch Likes List --------------------
  const fetchLikesList = async (id) => {
    const postIdParam = `${currentSection}_post_id`;
    const res = await fetch(
      `http://localhost:5000/${currentSection}/getlikeusers?${postIdParam}=${id}`
    );
    const data = await res.json();
    setLikesUsers(data.users || []);
  };

  // -------------------- Delete Posts --------------------
  const handleDeletePost = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/${currentSection}/post/${postId}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok && data.success) {
        // Remove deleted post from UI
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        setActiveDropdownPost(null);
      } else {
        alert(data.message || "Failed to delete the post.");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      alert("Something went wrong!");
    }
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
            <img src={p.profile_image} alt={p.name} className="profile-logo" />
            <div className="profile-info">
              <h3 className="profile-name">{p.name}</h3>
              <span className="college-name">{p.college}</span>
              <span className="college-name">{p.created_at}</span>
            </div>

            <div className="post-options">
              <button
                className="three-dots-button"
                onClick={() => setActiveDropdownPost(p.id)}
              >
                ⋮
              </button>

              {activeDropdownPost === p.id && (
                <div className="dropdown-menu">
                  <button
                    className="delete-button"
                    onClick={() => handleDeletePost(p.id)}
                  >
                     Delete
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="inner-content">
            <p className="message-post">{p.message}</p>
            {p.image && (
              <div className="image-container">
                <img src={p.image} alt="post" />
              </div>
            )}
          </div>

          <div className="post-actions">
            <button
              className={`action-button like-button ${p.liked ? "liked" : ""}`}
              onClick={() => toggleLike(p.id, p.liked)}
            >
              {p.liked ? "❤️" : "🤍"} Like ({p.likes})
            </button>

            <button
              className="action-button"
              onClick={() => {
                fetchLikesList(p.id);
                setActiveLikesPost(p);
              }}
            >
              👥 Likes
            </button>

            <button
              className="action-button comment-toggle-button"
              onClick={() => setActiveCommentsPost(p)}
            >
              💬 Comments ({p.comments.length})
            </button>
          </div>
        </div>
      ))}

      {/* ---------------- Comment Modal ---------------- */}
      {activeCommentsPost && (
        <div
          className="modal-overlay"
          onClick={() => setActiveCommentsPost(null)}
        >
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Comments</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const text = e.target.comment.value;
                if (!text.trim()) return;
                addComment(activeCommentsPost.id, text);
                e.target.reset();
              }}
              className="comment-form"
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

            <div className="comments-list">
              {activeCommentsPost.comments.length === 0 ? (
                <p>No comments yet</p>
              ) : (
                activeCommentsPost.comments.map((c) => (
                  <p key={c.id}>
                    <strong>{c.user_name}</strong>: {c.text}
                  </p>
                ))
              )}
            </div>

            <button
              className="close-button"
              onClick={() => setActiveCommentsPost(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}

      {/* ---------------- Likes Modal ---------------- */}
      {activeLikesPost && (
        <div
          className="mmodal-overlay"
          onClick={() => setActiveLikesPost(null)}
        >
          <div className="mmodal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Liked by</h3>
            {likesUsers.length > 0 ? (
              likesUsers.map((u, i) => <p key={i}>❤️ {u.user_name}</p>)
            ) : (
              <p>No likes yet</p>
            )}
            <button
              className="close-button"
              onClick={() => setActiveLikesPost(null)}
            >
              ✖
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
