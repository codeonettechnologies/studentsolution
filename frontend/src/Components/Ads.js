import React from "react";

export default function Ads() {
  const ads = [
    { id: 1, img: "/ads/ad1.jpgk", link: "#" },
    { id: 2, img: "/ads/ad2.jpg", link: "#" },
    { id: 3, img: "/ads/ad3.jpg", link: "#" },
  ];

  return (
    <div className="ads-container">
      {ads.map((ad) => (
        <a href={ad.link} key={ad.id} className="ad-item" target="_blank" rel="noreferrer">
          <img src={ad.img} alt={`Ad ${ad.id}`} />
        </a>
      ))}
    </div>
  );
}
