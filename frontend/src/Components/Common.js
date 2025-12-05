import React, { useState } from "react";
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

  const [selectedUser, setSelectedUser] = useState(null);
  const [filterUserId, setFilterUserId] = useState(null);

  const handlePostCreated = () => {
    setPostRefreshTrigger((prev) => prev + 1);
    setOpenModal(false);
  };

  const handleAskCreated = () => {
    setAskRefreshTrigger((prev) => prev + 1);
    setOpenModal(false);
  };

  return (
    <div className="main-content-area">
      {/* Selected User Info */}
      {selectedUser && (
        <div className="user-card">
          <div className="user-card-avatar">
            <img
              src={`http://localhost:5000/uploads/${selectedUser.profile_image}`}
              alt={selectedUser.name}
            />
          </div>
          <div className="user-card-info">
            <h3>{selectedUser.name}</h3>
            <p>
              <strong>Email:</strong> {selectedUser.email}
            </p>
            <p>
              <strong>College:</strong> {selectedUser.college} (
              {selectedUser.college_year})
            </p>
            <p>
              <strong>Profession:</strong> {selectedUser.profession}
            </p>
            <p>
              <strong>City:</strong> {selectedUser.city}
            </p>
          </div>
        </div>
      )}

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
      <div key={tab} className={`tab-content fade-slide`}>
        {tab === "post" ? (
          <PostItem
            searchQuery={searchQuery}
            refreshTrigger={postRefreshTrigger}
            setSelectedUser={setSelectedUser}
            setFilterUserId={setFilterUserId}
            filterUserId={filterUserId}
          />
        ) : (
          <Ask
            searchQuery={searchQuery}
            refreshTrigger={askRefreshTrigger}
            setSelectedUser={setSelectedUser}
            setFilterUserId={setFilterUserId}
            filterUserId={filterUserId}
          />
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
