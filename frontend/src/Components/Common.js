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
  const [sectionText, setSectionText] = useState("");

  const currentSection = localStorage.getItem("currentSection") || "Job";

  useEffect(() => {
    const sectionHeadingMap = {
      job: "Explore the latest job opportunities here!",
      coaching: "Find the best coaching tips and guides.",
      tiffin: "Discover delicious tiffin and food options.",
      entertainment: "Enjoy trending entertainment content.",
      default: "Check out the latest content in this section.",
    };
    setSectionText(
      sectionHeadingMap[currentSection.toLowerCase()] ||
        sectionHeadingMap.default
    );
  }, [currentSection]);

  return (
    <div className="main-content-area">
      <h2 className="section-heading">{sectionText}</h2>

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
        <button className="create-post-button" onClick={() => setOpenModal(true)}>
          <TiPlus />
        </button>
      </div>

      {/* Tab Content */}
      {tab === "post" ? (
        <PostItem searchQuery={searchQuery} />
      ) : (
        <Ask searchQuery={searchQuery} />
      )}

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {tab === "post" ? (
          <PostForm onCancel={() => setOpenModal(false)} />
        ) : (
          <AskForm onCancel={() => setOpenModal(false)} />
        )}
      </Modal>
    </div>
  );
}
