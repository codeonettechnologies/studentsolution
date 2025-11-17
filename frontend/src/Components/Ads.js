import React, { useEffect, useState } from "react";

export default function Ads({ posts = [] }) {
  const [ads, setAds] = useState([]);
  const [isMobile, setIsMobile] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isWindowLoaded, setIsWindowLoaded] = useState(false);

  // Wait for full window load (IMPORTANT)
  useEffect(() => {
    if (document.readyState === "complete") {
      setIsWindowLoaded(true);
    } else {
      const onLoad = () => setIsWindowLoaded(true);
      window.addEventListener("load", onLoad);
      return () => window.removeEventListener("load", onLoad);
    }
  }, []);

  // Detect screen size AFTER window loads
  useEffect(() => {
    if (!isWindowLoaded) return;

    const checkScreen = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreen();
    setIsReady(true);

    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, [isWindowLoaded]);

  // Fetch ads
  useEffect(() => {
    const fetchAds = async () => {
      try {
        const res = await fetch("http://localhost:5000/admin/all");
        const data = await res.json();

        if (Array.isArray(data)) {
          setAds(data);
        } else if (data.success && Array.isArray(data.data)) {
          setAds(data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchAds();
  }, []);

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
          <img src={imageUrl} alt="ad" className="ad-banner" />
        ) : (
          <p>No Media</p>
        )}

        <div className="ad-content">Advertisement</div>
      </div>
    );
  };

  const renderWithAds = () => {
    const list = [];
    let adIndex = 0;

    for (let i = 0; i < posts.length; i++) {
      list.push(
        <div key={`post-${i}`} className="post-item">
          {posts[i]}
        </div>
      );

      if ((i + 1) % 8 === 0 && ads[adIndex]) {
        list.push(
          <div key={`ad-${i}`} className="ad-wrapper">
            {renderAd(ads[adIndex])}
          </div>
        );
        adIndex = (adIndex + 1) % ads.length;
      }
    }

    return list;
  };

  // Do not render until window loaded + screen detected
  if (!isWindowLoaded || !isReady || isMobile === null) return null;

  return (
    <div className="ads-container">
      {isMobile ? (
        renderWithAds()
      ) : ads.length > 0 ? (
        ads.map((ad) => renderAd(ad))
      ) : (
        <p>No ads found</p>
      )}
    </div>
  );
}
