import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import LearningPopup from "./NotesPopUp";
import Modal from "./PopupModal";
import AskForm from "./AskForm";
import Ask from "./Ask";
import { TiPlus } from "react-icons/ti";
import { FiTrash2, FiMoreVertical } from "react-icons/fi";

export default function Learning() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [askRefreshTrigger, setAskRefreshTrigger] = useState(0);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef(null);

  const location = useLocation();
  const isMyPostsPage = location.pathname.includes("mypostask");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ---------------- Fetch Notes ----------------
  const fetchNotes = async () => {
    if (!userId && isMyPostsPage) return;
    setLoading(true);
    try {
      const apiUrl = isMyPostsPage
        ? `http://localhost:5000/notes/getNotes/${userId}`
        : "http://localhost:5000/notes/getNotes";

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data?.data && Array.isArray(data.data)) {
        const normalized = data.data.map((note) => ({
          id: note.id,
          topic: note.topic,
          details: note.details,
          image_url: note.image_url,
          pdf: note.pdf,
          user_name: note.user_name,
        }));
        setNotes(normalized);
      } else if (Array.isArray(data)) {
        setNotes(data);
      } else {
        setNotes([]);
        console.error("Invalid notes data:", data);
      }
    } catch (error) {
      console.error("Error fetching notes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [isMyPostsPage]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // ---------------- Search Notes ----------------
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim() || query.trim().length < 3) {
      fetchNotes();
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/notes/searchNotes?query=${encodeURIComponent(
          query
        )}`
      );
      const data = await res.json();

      if (data.success && Array.isArray(data.data)) {
        setNotes(
          data.data.map((note) => ({
            id: note.id,
            topic: note.topic,
            details: note.details,
            image_url: note.image_url,
            pdf: note.pdf,
            user_name: note.user_name,
          }))
        );
      } else {
        setNotes([]);
      }
    } catch (error) {
      console.error("Error searching notes:", error);
      setNotes([]);
    } finally {
      setLoading(false);
    }
  };

  // ---------------- Delete Note ----------------
  const handleDelete = async (noteId) => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    try {
      const res = await fetch(
        `http://localhost:5000/notes/deleteNote/${noteId}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );
      const data = await res.json();

      if (data.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
        alert("Note deleted successfully!");
      } else {
        alert("Failed to delete note!");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const navigate = useNavigate();
  const openNoteDetails = (note) => {
    navigate("/dashboard/learning-details", { state: { note } });
  };

  return (
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

      {/* Search + Add */}
      <div className="feed-header-bar">
        <input
          type="text"
          placeholder={`Search ${tab === "post" ? "notes" : "asks"}...`}
          className="search-box-input"
          value={searchQuery}
          onChange={(e) => handleSearch(e.target.value)}
        />
        {!isMyPostsPage && (
          <button
            className="create-post-button"
            onClick={() => setOpenModal(true)}
          >
            <TiPlus />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div key={tab} className="tab-content fade-slide">
        {tab === "post" ? (
          <div className="learning-ui">
            {loading ? (
              <p>Loading notes...</p>
            ) : notes.length > 0 ? (
              notes.map((note, index) => (
                <div
                  key={note.id || index}
                  className="note-card"
                  onClick={() => openNoteDetails(note)}
                  style={{ cursor: "pointer" }}
                >
                  {isMyPostsPage && (
                    <div className="item-three-dot-menu" ref={menuRef}>
                      <FiMoreVertical
                        className="item-three-dot-icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveMenu(activeMenu === index ? null : index);
                        }}
                      />
                      {activeMenu === index && (
                        <div className="item-menu-dropdown">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(note.id);
                            }}
                            className="delete-btnn"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <p className="note-user-name">{note.user_name}</p>
                  <h4>{note.topic}</h4>
                  <p className="note-details">{note.details}</p>

                  {note.image_url && (
                    <div className="pdf-preview">
                      View Image: {note.image_url}
                    </div>
                  )}
                  {note.pdf && (
                    <div className="pdf-preview">View PDF: {note.pdf}</div>
                  )}
                </div>
              ))
            ) : (
              <p>No notes found.</p>
            )}
          </div>
        ) : (
          <Ask searchQuery={searchQuery} refreshTrigger={askRefreshTrigger} />
        )}
      </div>

      {/* Popup Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {tab === "post" ? (
          <LearningPopup
            isOpen={openModal}
            onClose={() => {
              setOpenModal(false);
              fetchNotes();
            }}
          />
        ) : (
          <AskForm
            onCancel={() => setOpenModal(false)}
            onAskCreated={() => {
              setAskRefreshTrigger((prev) => prev + 1);
              setOpenModal(false);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
