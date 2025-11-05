import React, { useState, useEffect } from "react";
import Modal from "./PopupModal";
import PostForm from "./PostForm";
import AskForm from "./AskForm";
import { TiPlus } from "react-icons/ti";

export default function UsedItem() {
  const [tab, setTab] = useState("post");
  const [openModal, setOpenModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sectionText, setSectionText] = useState("");

  const currentSection = localStorage.getItem("currentSection") || "Used-Item";

  useEffect(() => {
    const sectionHeadingMap = {
      useditem: "Find and list pre-owned items easily!",
    };
    setSectionText(
      sectionHeadingMap[currentSection.toLowerCase()] ||
        sectionHeadingMap.default
    );
  }, [currentSection]);

  const products = [
    {
      image:
        "https://th.bing.com/th/id/OIP.wTf5JcvIAzx7FYt483d30AHaE8?w=280&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      name: "Stylish Casual Shoes",
      description:
        "Comfortable and trendy casual shoes for everyday wear. Lightweight and durable for all-day comfort.",
      price: "₹1,499",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.hqvPO_0QYbPzm5qXIhfDYAAAAA?w=181&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      name: "Classic Leather Wallet",
      description:
        "Premium quality leather wallet with multiple card slots and a sleek finish for modern men.",
      price: "₹899",
    },
    {
      image:
        "https://tse1.mm.bing.net/th/id/OIP.p5u-TKxHBPT3sC6M9fAXOgHaFS?rs=1&pid=ImgDetMain&o=7&rm=3",
      name: "Noise Cancelling Headphones",
      description:
        "Wireless over-ear headphones with powerful bass, clear sound, and long-lasting battery life.",
      price: "₹3,499",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.nVP57pjOkZ1-bU-azimqlAHaHa?w=195&h=195&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      name: "Smart Fitness Watch",
      description:
        "Track your fitness goals with this smartwatch — heart rate monitor, steps tracker, and more.",
      price: "₹2,999",
    },
    {
      image:
        "https://th.bing.com/th/id/OIP.WWrBRroB17UPtapB0tVflgHaEJ?w=288&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
      name: "Stylish Backpack",
      description:
        "Spacious and stylish backpack with padded compartments for laptop and essentials. Perfect for work or travel.",
      price: "₹1,199",
    },
  ];

  // Filter products by search
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="main-content-area">
      {/* Section Heading */}
      <h2 className="section-heading">{sectionText}</h2>

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

      {/* Search Bar + + Button */}
      <div className="feed-header-bar">
        <input
          type="text"
          placeholder={`Search ${tab === "post" ? "used items" : "asks"}...`}
          className="search-box-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button className="create-post-button" onClick={() => setOpenModal(true)}>
          <TiPlus />
        </button>
      </div>

      {/* Tab Content */}
      <div key={tab} className={`tab-content fade-slide`}>
        {tab === "post" ? (
          <div className="shop-container">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product, index) => (
                <div key={index} className="shop-card">
                  <div className="shop-image">
                    <img src={product.image} alt={product.name} />
                  </div>
                  <div className="shop-details">
                    <h2 className="product-name">{product.name}</h2>
                    <p className="product-description">{product.description}</p>
                    <p className="product-price">{product.price}</p>
                    <button className="buy-btn">Add to Cart</button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No matching items found.</p>
            )}
          </div>
        ) : (
          <p className="ask-placeholder">Ask about a product or service...</p>
        )}
      </div>

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
