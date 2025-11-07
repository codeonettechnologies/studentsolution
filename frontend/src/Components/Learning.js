import React, { useState } from "react";
import LearningPopup from "./NotesPopUp";
import AskForm from "./AskForm";
import Modal from "./PopupModal";
import Ask from "./Ask"; // ✅ Import your Ask component
import { TiPlus } from "react-icons/ti";

export default function Learning() {
  const [tab, setTab] = useState("post");
  const [openLearningPopup, setOpenLearningPopup] = useState(false);
  const [openAskModal, setOpenAskModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  // handle + button click according to tab
  const handlePlusClick = () => {
    if (tab === "post") {
      setOpenLearningPopup(true);
    } else if (tab === "ask") {
      setOpenAskModal(true);
    }
  };

  return (
    <>
      <div className="main-content-area">
        {/* Tabs */}
        <div className="tab-navigation">
          <button
            className={`tab-button ${tab === "post" ? "active" : ""}`}
            onClick={() => setTab("post")}
          >
            Notes
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
            placeholder={`Search ${tab === "post" ? "notes" : "asks"}...`}
            className="search-box-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="create-post-button" onClick={handlePlusClick}>
            <TiPlus />
          </button>
        </div>

        {/* Popups */}
        <LearningPopup
          isOpen={openLearningPopup}
          onClose={() => setOpenLearningPopup(false)}
        />
        <Modal isOpen={openAskModal} onClose={() => setOpenAskModal(false)}>
          <AskForm onCancel={() => setOpenAskModal(false)} />
        </Modal>

        {/* Conditional UI */}
        {tab === "post" ? (
          <div className="learning-ui">
            <h4>React Basics</h4>
            <h6>
              This note covers the fundamental concepts of React such as
              components, props, and state.
            </h6>
            <img
              src="https://static1.xdaimages.com/wordpress/wp-content/uploads/wm/2024/05/top-onenote-features-supercharge-note-taking-9.jpg"
              alt="React Notes"
            />
            <div className="pdf-preview">
              <span>React_Notes.pdf</span>
              <a href="#" target="_blank">
                View PDF
              </a>
            </div>
          </div>
        ) : (
          <Ask searchQuery={searchQuery} />
        )}
      </div>
    </>
  );
}