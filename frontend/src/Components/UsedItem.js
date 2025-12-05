import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Modal from "./PopupModal";
import PostForm from "./PostForm";
import AskForm from "./AskForm";
import Ask from "./Ask";
import { TiPlus } from "react-icons/ti";
import { FiMoreVertical, FiTrash2 } from "react-icons/fi";

export default function UsedItem() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [usedItems, setUsedItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [askRefreshTrigger, setAskRefreshTrigger] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const isMyPostsPage = location.pathname.includes("mypostask");

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user?.id;

  // ---------------- Fetch Used Items ----------------
  const fetchUsedItems = async () => {
    if (!userId && isMyPostsPage) return;
    setLoading(true);
    try {
      const apiUrl = isMyPostsPage
        ? `http://localhost:5000/usedItem/postGet/${userId}`
        : "http://localhost:5000/usedItem/post/get";

      const res = await fetch(apiUrl);
      const data = await res.json();

      if (data?.data) {
        const normalizedData = data.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          user_name: item.user_name || user.name,
          user_college: item.user_college || user.college || "",
          user_year: item.user_year || user.year || "",
        }));
        setUsedItems(normalizedData);
      } else {
        setUsedItems([]);
      }
    } catch (error) {
      console.error("Error fetching used items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsedItems();
  }, [isMyPostsPage]);

  // ---------------- Delete Post ----------------
  const handleDelete = async (postId) => {
    if (!window.confirm("Are you sure you want to delete this post?")) return;

    try {
      const res = await fetch(`http://localhost:5000/usedItem/post/${postId}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.message === "Used item post deleted successfully") {
        setUsedItems((prev) => prev.filter((item) => item.id !== postId));
        toast.success("Post deleted successfully!");
      } else {
        toast.error("Failed to delete post!");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  // ---------------- Fetch Search Results ----------------
useEffect(() => {
  const fetchSearchResults = async () => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      fetchUsedItems();
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(
        `http://localhost:5000/useditem/searchPost?query=${encodeURIComponent(
          searchQuery
        )}`
      );
      const data = await res.json();

      if (data?.data) {
        const normalizedData = data.data.map((item) => ({
          id: item.id,
          title: item.title,
          description: item.description,
          price: item.price,
          image_url: item.image_url,
          user_name: item.user_name || user.name,
          user_college: item.user_college || user.college || "",
          user_year: item.user_year || user.year || "",
        }));
        setUsedItems(normalizedData);
      } else {
        setUsedItems([]);
      }
    } catch (error) {
      console.error("Error searching used items:", error);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search a bit for better UX
  const timeoutId = setTimeout(fetchSearchResults, 300);
  return () => clearTimeout(timeoutId);
}, [searchQuery]);


  return (
    <div className="main-content-area">
      {/* Tabs */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${tab === "post" ? "active" : ""}`}
          onClick={() => setTab("post")}
        >
          Items
        </button>
        <button
          className={`tab-button ${tab === "ask" ? "active" : ""}`}
          onClick={() => setTab("ask")}
        >
          Ask
        </button>
      </div>

      {/* Search Bar + Add Button */}
      <div className="feed-header-bar">
        <input
          type="text"
          placeholder={`Search ${tab === "post" ? "used items" : "asks"}...`}
          className="search-box-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
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
          <div className="shop-container">
            {loading ? (
              <p className="loading-text">Loading...</p>
            ) : usedItems.length > 0 ? (
              usedItems.map((item, index) => (
                <div
                  key={item.id}
                  className="shop-card"
                  style={{ cursor: "pointer" }}
                  onClick={() => navigate("/dashboard/useditemdetails", { state: { item } })} 
                >
                  {/* 3-dot menu only on My Posts page */}
                  {isMyPostsPage && (
                    <div className="item-three-dot-menu">
                      <FiMoreVertical
                        onClick={(e) => {
                          e.stopPropagation(); 
                          setActiveMenu(activeMenu === index ? null : index);
                        }}
                        className="item-three-dot-icon"
                      />
                      {activeMenu === index && (
                        <div className="item-menu-dropdown">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item.id);
                            }}
                            className="delete-btnn"
                          >
                            <FiTrash2 /> Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="shop-image">
                    <img
                      src={`http://localhost:5000/uploads/useditem_posts/${item.image_url}`}
                      alt={item.title}
                    />
                  </div>

                  <div className="shop-details">
                    <h2 className="product-name">{item.title}</h2>
                    <p className="product-description">{item.description}</p>
                    <p className="product-price">₹{item.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No items found.</p>
            )}
          </div>
        ) : (
          <Ask searchQuery={searchQuery} refreshTrigger={askRefreshTrigger} />
        )}
      </div>

      {/* Modal */}
      <Modal isOpen={openModal} onClose={() => setOpenModal(false)}>
        {tab === "post" ? (
          <PostForm
            onCancel={() => setOpenModal(false)}
            onPostCreated={async () => {
              await fetchUsedItems();
              setOpenModal(false);
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
