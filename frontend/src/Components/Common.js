import React, { useState, useEffect } from "react";
import PostItem from "./Post";
import Ask from "./Ask";
import PostForm from "./PostForm";
import AskForm from "./AskForm";
import Modal from "./PopupModal";
import { TiPlus } from "react-icons/ti";

export default function CommonContent() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [postRefreshTrigger, setPostRefreshTrigger] = useState(0);
  const [askRefreshTrigger, setAskRefreshTrigger] = useState(0);

  const handlePostCreated = (newPostData) => {
    setPostRefreshTrigger((prev) => prev + 1);
    setOpenModal(false);
  };

  const handleAskCreated = (newAskData) => {
    setAskRefreshTrigger((prev) => prev + 1);
    setOpenModal(false);
  };

  return (
    <div className="main-content-area">

      {/* Tabs */}
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

      {/* Search Bar + + Button */}
      <div className="feed-header-bar">
        <input
          type="text"
          placeholder={`Search ${tab === "post" ? "posts" : "asks"}...`}
          className="search-box-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button
          className="create-post-button"
          onClick={() => setOpenModal(true)}
        >
          <TiPlus />
        </button>
      </div>

      {/* Tab Content */}
      {/* {tab === "post" ? (
  <div className="tab-content">
    <PostItem searchQuery={searchQuery} refreshTrigger={postRefreshTrigger} />
  </div>
) : (
  <div className="tab-content">
    <Ask searchQuery={searchQuery} refreshTrigger={askRefreshTrigger} />
  </div>
)} */}

      {/* Tab Content with animation */}
      <div key={tab} className={`tab-content fade-slide`}>
        {tab === "post" ? (
          <PostItem
            searchQuery={searchQuery}
            refreshTrigger={postRefreshTrigger}
          />
        ) : (
          <Ask searchQuery={searchQuery} refreshTrigger={askRefreshTrigger} />
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {tab === "post" ? (
          <PostForm
            onCancel={() => setOpenModal(false)}
            onPostCreated={handlePostCreated}
          />
        ) : (
          <AskForm
            onCancel={() => setOpenModal(false)}
            onAskCreated={handleAskCreated}
          />
        )}
      </Modal>
    </div>
  );
}
