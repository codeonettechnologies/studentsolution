import React from "react";

export default function AddAds() {
  return (
    <div className="ads-form-wrap">
      <div className="ads-card">
        <form>
          <h2 className="ads-title">Add Advertisement</h2>

          <div className="ads-group">
            <label htmlFor="adsFile">Upload Ads Image:</label>
            <input
              id="adsFile"
              type="file"
              accept="image/*"
              className="ads-input"
            />
          </div>
          <button type="submit" className="ads-submit-btn">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}
