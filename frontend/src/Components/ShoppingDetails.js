import React from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="product-details">
        <p>No product selected.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div className="product-details">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      <div className="details-container">
        <div className="image-section">
          <img
            src={`http://localhost:5000/uploads/shopping_posts/${product.image_url}`}
            alt={product.name}
          />
        </div>
        <div className="info-section">
          <h1>{product.name}</h1>
          <p className="price">₹{product.price}</p>
          <p className="desc">
            {product.description || "No description available."}
          </p>
          <button
            className="buy-btn"
            onClick={() => toast.success("Added to cart (demo)")}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}
