import React, { useEffect, useState } from "react";

export default function Ads({ posts = [] }) {
  const [ads, setAds] = useState([]);

  //Fetch ads from API
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/all");
        const data = await res.json();

        if (Array.isArray(data)) {
          setAds(data);
        } else if (data.success && Array.isArray(data.data)) {
          setAds(data.data);
        } else {
          console.error("Invalid ads data:", data);
        }
      } catch (err) {
        console.error("Error fetching ads:", err);
      }
    };

    fetchAds();
  }, []);

  // Helper: render single ad (image or video)
  const renderAd = (ad) => {
    const imageUrl = ad.image
      ? `http://localhost:5000/uploads/ads/${ad.image}`
      : null;
    const videoUrl = ad.video
      ? `http://localhost:5000/uploads/ads/${ad.video}`
      : null;

    return (
      <div className="ad-item-container" key={ad.id}>
        {videoUrl ? (
          <video
            src={videoUrl}
            controls
            autoPlay
            muted
            loop
            playsInline
            className="ad-banner"
          />
        ) : imageUrl ? (
          <img src={imageUrl} alt={`Ad ${ad.id}`} className="ad-banner" />
        ) : (
          <p>No Media</p>
        )}
      </div>
    );
  };

  // Function to render ads between posts on mobile
  const renderWithAds = () => {
    if (!posts || posts.length === 0) return null;

    const elements = [];
    const isMobile = window.innerWidth < 768;
    let adIndex = 0;

    for (let i = 0; i < posts.length; i++) {
      elements.push(
        <div key={`post-${i}`} className="post-item">
          {posts[i]}
        </div>
      );

      //  Every 8th post → show ad (mobile only)
      if (isMobile && (i + 1) % 8 === 0 && ads[adIndex]) {
        elements.push(
          <div key={`ad-${i}`} className="ad-wrapper">
            {renderAd(ads[adIndex])}
          </div>
        );
        adIndex = (adIndex + 1) % ads.length;
      }
    }

    return elements;
  };

  return (
    <div className="ads-container">
      {/* Desktop view — show all ads */}
      {window.innerWidth >= 768 ? (
        ads.length > 0 ? (
          ads.map((ad) => renderAd(ad))
        ) : (
          <p>No ads available</p>
        )
      ) : (
        // Mobile view — show ads after every 8th post
        renderWithAds()
      )}
    </div>
  );
}
