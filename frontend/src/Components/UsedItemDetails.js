import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function UsedItemDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item;

  if (!item)
    return (
      <div className="details-page">
        <p>No item selected.</p>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );

  return (
    <div className="details-page">
      <button className="back-btn" onClick={() => navigate(-1)}>
        ←
      </button>

      <div className="details-container">
        <div className="details-image">
          <img
            src={`http://localhost:5000/uploads/useditem_posts/${item.image_url}`}
            alt={item.title}
          />
        </div>

        <div className="details-info">
          <h1>{item.title}</h1>
          <p className="price">₹{item.price}</p>
          <p className="desc">{item.description}</p>

          <div className="user-details">
            <h3>Posted By:</h3>
            <p className="user-name">{item.user_name}</p>
            <p className="user-meta">
              {item.user_college} • {item.user_year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
