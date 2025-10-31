import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

export default function PostItem({ searchQuery }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [activeLikesPost, setActiveLikesPost] = useState(null);
  const [likesUsers, setLikesUsers] = useState([]);
  const [activeDropdownPost, setActiveDropdownPost] = useState(null);
  const [activeCommentDropdown, setActiveCommentDropdown] = useState(null);

  const currentSection = localStorage.getItem("currentSection");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

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
                user_id: c.user_id,
                user_name: c.user_name || "Unknown",
                text: c.comment_text,
              }));

              // Fetch likes
              const postIdParam = `${currentSection}_post_id`;
              let likesCount = 0;
              let likedByUser = false;
              try {
                const likeRes = await fetch(
                  `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${p.id}`
                );
                const likeData = await likeRes.json();
                likesCount = likeData.total_likes || 0;
                likedByUser = likeData.liked_users?.some(
                  (u) => u.user_id === userId
                );
              } catch (error) {
                console.warn("Like fetch failed for post:", p.id, error);
              }

              return {
                id: p.id,
                user_id: p.user_id,
                name: p.user_name || "Unknown User",
                college: p.college || p.user_college || "",
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
                created_at: new Date(p.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
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
          `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${id}`
        );
        const likeData = await likeRes.json();

        const isLikedByUser = likeData.liked_users?.some(
          (u) => u.user_id === userId
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  liked: isLikedByUser,
                  likes: likeData.total_likes || 0,
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
          user_id: c.user_id,
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

  // -------------------- Delete Comment --------------------
  const deleteComment = async (commentId, postId) => {
    const confirmDelete = window.confirm("Delete this comment?");
    if (!confirmDelete) return;

    try {
      const res = await fetch(
        `http://localhost:5000/${currentSection}/comment/${commentId}`,
        {
          method: "DELETE",
        }
      );
      const data = await res.json();
      if (res.ok && data.message.includes("Comment deleted")) {
        setPosts((prev) =>
          prev.map((p) =>
            p.id === postId
              ? {
                  ...p,
                  comments: p.comments.filter((c) => c.id !== commentId),
                }
              : p
          )
        );
      } else {
        alert("Failed to delete comment");
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  // -------------------- Fetch Likes List --------------------
  const fetchLikesList = async (id) => {
    try {
      const postIdParam = `${currentSection}_post_id`;
      const res = await fetch(
        `http://localhost:5000/${currentSection}/getlike?${postIdParam}=${id}`
      );
      const data = await res.json();

      if (res.ok && data.liked_users) {
        setLikesUsers(data.liked_users);

        const isLikedByUser = data.liked_users.some(
          (u) => u.user_id === userId
        );

        setPosts((prev) =>
          prev.map((p) =>
            p.id === id
              ? {
                  ...p,
                  likes: data.total_likes || 0,
                  liked: isLikedByUser,
                }
              : p
          )
        );

        setActiveLikesPost({ id });
      } else {
        setLikesUsers([]);
      }
    } catch (error) {
      console.error("Error fetching likes:", error);
    }
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

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim()) {
        setPosts(originalPosts);
        return;
      }
      try {
        const res = await fetch(
          `http://localhost:5000/${currentSection}/searchPost?query=${encodeURIComponent(
            searchQuery
          )}`
        );
        const data = await res.json();
      console.log(data ,"hahahahahahahahahahahahah");
      
        if (data && Array.isArray(data)) {
          const mappedResults = data.map((p) => ({
            id: p.id,
            name: p.name || "Unknown User",
            college: p.college || p.user_college || "",
            message: p.content,
            image: p.image_url
                  ? `http://localhost:5000/uploads/${currentSection}_posts/${p.image_url}`
                  : null,
            profile_image: p.profile_image
              ? `http://localhost:5000/uploads/${p.profile_image}`
              : null,
            comments: [],
            created_at: new Date(p.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
          }));
          setPosts(mappedResults);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearchResults();
  }, [searchQuery, currentSection, originalPosts]);

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
              <div className="profile-details">
                <h3 className="profile-name">{p.name}</h3>
                <span className="divider">|</span>
                <span className="coll-name">{p.college}</span>
                <span className="divider">|</span>
                <span className="created-date">{p.created_at}</span>
              </div>
            </div>
            {isMyPostsPage && userId === p.user_id && (
              <div className="post-options">
                <button
                  className="three-dots-buttons"
                  onClick={() =>
                    setActiveDropdownPost(
                      activeDropdownPost === p.id ? null : p.id
                    )
                  }
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
            )}
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
            <div className="like-section">
              <button
                className={`heart-button ${p.liked ? "liked" : ""}`}
                onClick={() => toggleLike(p.id, p.liked)}
              >
                {p.liked ? "❤️" : "🤍"}
              </button>

              <span className="like-count" onClick={() => fetchLikesList(p.id)}>
                Likes ({p.likes})
              </span>
            </div>

            <button
              className="action-button comment-toggle-button"
              onClick={() => setActiveCommentsPost(p)}
            >
              💬 Comments ({p.comments.length})
            </button>
            <button className="share-btn">Share</button>
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
                  <div key={c.id} className="comment-item">
                    <p>
                      <strong>{c.user_name}</strong>: {c.text}
                    </p>

                    {userId === c.user_id && (
                      <div className="comment-options">
                        <button
                          className="three-dots-button"
                          onClick={() =>
                            setActiveCommentDropdown(
                              activeCommentDropdown === c.id ? null : c.id
                            )
                          }
                        >
                          ⋮
                        </button>

                        {activeCommentDropdown === c.id && (
                          <div className="dropdown-menu">
                            <button
                              className="delete-button"
                              onClick={() =>
                                deleteComment(c.id, activeCommentsPost.id)
                              }
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
        <div className="modal-overlay" onClick={() => setActiveLikesPost(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Liked by</h3>

            {likesUsers.length > 0 ? (
              likesUsers.map((u, i) => (
                <div key={i} className="like-user-item">
                  <p>❤️ {u.user_name}</p>
                </div>
              ))
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