import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import toast from "react-hot-toast";

export default function PostItem({
  searchQuery,
  refreshTrigger,
  setSelectedUser,
  setFilterUserId,
  filterUserId,
}) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [originalPosts, setOriginalPosts] = useState([]);
  const [activeCommentsPost, setActiveCommentsPost] = useState(null);
  const [activeLikesPost, setActiveLikesPost] = useState(null);
  const [likesUsers, setLikesUsers] = useState([]);
  const [activeDropdownPost, setActiveDropdownPost] = useState(null);
  const [activeCommentDropdown, setActiveCommentDropdown] = useState(null);
  const [ads, setAds] = useState([]);

  // -------------------- Fetch Ads --------------------
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/all");
        const data = await res.json();

        if (Array.isArray(data)) {
          setAds(data);
        } else if (data.success && Array.isArray(data.data)) {
          setAds(data.data);
        } else {
          console.error("Invalid ads data:", data);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };

    fetchAds();
  }, []);

  const currentSection = localStorage.getItem("currentSection");
  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;
  const location = useLocation();
  const isMyPostsPage = location.pathname.includes("mypostask");

  // -------------------- Fetch Posts --------------------
  const fetchPosts = async () => {
    setLoading(true);
    try {
      let apiUrl = `http://localhost:5000/${currentSection}/post/get`;
      if (isMyPostsPage) {
        apiUrl = `http://localhost:5000/${currentSection}/postGet/${userId}`;
      }

      const res = await fetch(apiUrl);
      const data = await res.json();
      console.log(data, "data");

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
              console.log("like", likeData);
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
        setOriginalPosts(postsWithData);
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchPosts();
  }, [currentSection, userId, isMyPostsPage, refreshTrigger]);

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
        // Refresh only that post's comments
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

        // Update modal instantly
        setActiveCommentsPost((prev) =>
          prev && prev.id === id ? { ...prev, comments: postComments } : prev
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
        await fetchPosts();
      } else {
        toast.error("Failed to delete comment");
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
        setActiveDropdownPost(null);
        setPosts((prevPosts) => prevPosts.filter((p) => p.id !== postId));
        setOriginalPosts((prevOriginal) =>
          prevOriginal.filter((p) => p.id !== postId)
        );
      } else {
        toast.error(data.message || "Failed to delete the post.");
      }
    } catch (error) {
      console.error("Delete post error:", error);
      toast("Something went wrong!");
    }
  };

  // -------------------- Search Posts --------------------
  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!searchQuery.trim() || searchQuery.trim().length < 3) {
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

        if (data && Array.isArray(data)) {
          const postsWithExtraData = await Promise.all(
            data.map(async (p) => {
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
                name: p.user_name || "Unknown User",
                college: p.user_college_name || p.user_college || "",
                message: p.content,
                image: p.image_url
                  ? `http://localhost:5000/uploads/${currentSection}_posts/${p.image_url}`
                  : null,
                profile_image: p.user_profile
                  ? `http://localhost:5000/uploads/${p.user_profile}`
                  : "default-profile.png",
                comments: postComments,
                likes: likesCount,
                liked: likedByUser,
                created_at: new Date(p.created_at).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                }),
              };
            })
          );

          setPosts(postsWithExtraData);
        }
      } catch (err) {
        console.error("Search error:", err);
      }
    };

    fetchSearchResults();
  }, [searchQuery, currentSection, originalPosts]);

  const fetchUserPosts = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/${currentSection}/userPost/${userId}`);
      const data = await res.json();

      if (data.posts) {
        const userPosts = data.posts.map((p) => ({
          id: p.id,
          user_id: p.user_id,
          name: p.user?.name || p.name || "Unknown User",
          college: p.user?.college || p.college || "",
          message: p.content,
          image: p.image_url
            ? `http://localhost:5000/uploads/job_posts/${p.image_url}`
            : null,
          profile_image: p.user?.profile_image
            ? `http://localhost:5000/uploads/${p.user?.profile_image}`
            : p.profile_image
            ? `http://localhost:5000/uploads/${p.profile_image}`
            : "default-profile.png",
          likes: p.total_likes || 0,
          liked: p.liked_users?.some((u) => u.user_id === userId) || false,
          comments: (p.comments_data || []).map((c) => ({
            id: c.comment_id,
            user_id: c.user_id,
            user_name: c.name,
            text: c.comment_text,
            profile_image: c.profile_image,
          })),
          created_at: new Date(p.created_at).toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        }));

        setPosts(userPosts);
        setSelectedUser(data.user);
        setFilterUserId(userId);
      }
    } catch (err) {
      console.error("Error fetching user posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // -------------------- UI --------------------
  if (loading) return <p>Loading posts...</p>;
  if (posts.length === 0)
    return <p>No posts available in {currentSection} section.</p>;

  //Helper to render ad (image or video)
  const renderAd = (ad, index) => {
    const imageUrl = ad.image
      ? `http://localhost:5000/uploads/ads/${ad.image}`
      : null;
    const videoUrl = ad.video
      ? `http://localhost:5000/uploads/ads/${ad.video}`
      : null;

    return (
      <div className="ad-item-container" key={`ad-${index}`}>
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="ad-banner"
          />
        ) : imageUrl ? (
          <img src={imageUrl} alt={`Ad ${index}`} className="ad-banner" />
        ) : (
          <p>No Media</p>
        )}
      </div>
    );
  };

  //  Combine posts + ads
  const isMobile = window.innerWidth < 768;
  const combinedFeed = [];
  let adIndex = 0;

  posts.forEach((p, i) => {
    combinedFeed.push(
      <div key={p.id} className="profile-item" style={{ position: "relative" }}>
        {/* ---------------- Post Header ---------------- */}
        <div className="profile-header">
          <img
            src={p.profile_image}
            alt={p.name}
            className="profile-logo"
            style={{ cursor: "pointer" }}
            onClick={() => fetchUserPosts(p.user_id)}
          />
          <div
            className="profile-info"
            style={{ cursor: "pointer" }}
            onClick={() => fetchUserPosts(p.user_id)}
          >
            <h3 className="profile-name">{p.name}</h3>
            <div className="profile-details">
              <span className="coll-name">{p.college}</span>
              <span className="divider">|</span>
              <span className="created-date">{p.created_at}</span>
            </div>
          </div>

          {/* Delete Button */}
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

        {/* ---------------- Post Content ---------------- */}
        <div className="inner-content">
          <p className="message-post">{p.message}</p>
          {p.image && (
            <div className="image-container">
              <img src={p.image} alt="post" />
            </div>
          )}
        </div>

        {/* ---------------- Post Actions ---------------- */}
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

        {/* ---------------- Comment Modal ---------------- */}
        {activeCommentsPost?.id === p.id && (
          <div
            className="mmodal-overlay"
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              width: "100%",
              zIndex: 100,
            }}
            onClick={() => setActiveCommentsPost(null)}
          >
            <div
              className="mmodal-content"
              style={{ position: "relative" }}
              onClick={(e) => e.stopPropagation()}
            >
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
        {activeLikesPost?.id === p.id && (
          <div
            className="mmodal-overlay"
            style={{
              position: "absolute",
              top: "100%",
              left: "0",
              width: "100%",
              zIndex: 100,
            }}
            onClick={() => setActiveLikesPost(null)}
          >
            <div
              className="mmodal-content"
              onClick={(e) => e.stopPropagation()}
            >
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

    //Add ad after every 8th post (mobile only)
    if (isMobile && (i + 1) % 8 === 0 && ads[adIndex]) {
      combinedFeed.push(renderAd(ads[adIndex], adIndex));
      adIndex = (adIndex + 1) % ads.length;
    }
  });
  return (
    <div>
      {/* Back to All Posts button */}
      {filterUserId && (
        <div className="back-to-all" style={{ marginBottom: "20px" }}>
          <button
            onClick={() => {
              setPosts(originalPosts);
              setFilterUserId(null);
              setSelectedUser(null);
            }}
          >
            ← Back to All Posts
          </button>
        </div>
      )}
      {/* Feed (posts + ads) */}
      {combinedFeed}
    </div>
  );
}
