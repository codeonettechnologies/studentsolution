import React, { useState } from "react";
import PostItem from "./Post";
import PostForm from "./PostForm";
import Ask from "./Ask";
import AskForm from "./AskForm";
import Modal from "./PopupModal";

export default function CommonContent() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [posts, setPosts] = useState([]);

  const handlePostCreated = (newPost) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <div className="main-content-area">
      {/* -------- Tabs -------- */}
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

      {/* -------- Common Search Bar & + Button -------- */}
      <div className="feed-header-bar">
        <input
          type="text"
          placeholder={`Search ${tab === "post" ? "posts" : "asks"}...`}
          className="search-box-input"
        />
        <button
          className="create-post-button"
          onClick={() => setOpenModal(true)}
        >
          +
        </button>
      </div>

      {/* -------- Tab Content -------- */}
      {tab === "post" && <PostItem posts={posts} setPosts={setPosts} />}
      {tab === "ask" && <Ask />}

      {/* -------- Single Modal for Both -------- */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {tab === "post" ? (
          <PostForm
            onCancel={() => setOpenModal(false)}
            onPostCreated={handlePostCreated}
          />
        ) : (
          <AskForm
            onCancel={() => setOpenModal(false)}
            onPostCreated={handlePostCreated}
          />
        )}
      </Modal>
    </div>
  );
}
