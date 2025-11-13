import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddAds() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ image: "", video: "" });
  const [loading, setLoading] = useState(false);

  // Fetch all ads from backend on mount
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/all");
      setAds(res.data);
    } catch (err) {
      console.error("Error fetching ads:", err);
      alert("Failed to load ads.");
    }
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };
  // Add Ad (image/video upload)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image && !formData.video) {
      alert("Please upload an image or a video!");
      return;
    }

    const data = new FormData();
    if (formData.image) data.append("image", formData.image);
    if (formData.video) data.append("video", formData.video);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/admin/addAd", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Ad added successfully!");
      setShowForm(false);
      setFormData({ image: "", video: "" });
      fetchAds();
    } catch (err) {
      console.error("Error adding ad:", err);
      alert("Failed to add ad!");
    } finally {
      setLoading(false);
    }
  };

  // Delete Ad from backend + update UI
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this ad?")) return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/deleteAds/${id}`
      );

      if (res.status >= 200 && res.status < 300) {
        alert(res.data.message || "Ad deleted successfully!");
        setAds(ads.filter((ad) => ad.id !== id));
      } else {
        alert("Failed to delete ad.");
      }
    } catch (err) {
      console.error("Error deleting ad:", err);
      alert("Server error. Could not delete ad.");
    }
  };

  return (
    <div className="ads-container">
      <div className="ads-header">
        <h2>Advertisement List</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add Ads
        </button>
      </div>
      <table className="ads-table">
        <thead>
          <tr>
            <th>Image</th>
            <th>Video</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {ads.length > 0 ? (
            ads.map((ad) => (
              <tr key={ad.id}>
                <td>
                  {ad.image ? (
                    <img
                      src={`http://localhost:5000/uploads/ads/${ad.image}`}
                      alt="Ad"
                      className="ads-img"
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>
                  {ad.video ? (
                    <video
                      src={`http://localhost:5000/uploads/ads/${ad.video}`}
                      controls
                      width="100"
                      height="80"
                    ></video>
                  ) : (
                    "No Video"
                  )}
                </td>
                <td>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(ad.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" className="no-data">
                No Ads Added Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="ads-popup">
          <div className="ads-card">
            <form onSubmit={handleSubmit}>
              <h2 className="ads-title">
                {loading ? "Uploading..." : "Add Advertisement"}
              </h2>

              <div className="ads-group">
                <label>Upload Image:</label>
                <input
                  type="file"
                  accept="image/*"
                  name="image"
                  onChange={handleChange}
                  className="ads-input"
                />
              </div>

              <div className="ads-group">
                <label>Upload Video:</label>
                <input
                  type="file"
                  accept="video/*"
                  name="video"
                  onChange={handleChange}
                  className="ads-input"
                />
              </div>

              <div className="ads-buttons">
                <button
                  type="submit"
                  className="ads-submit-btn"
                  disabled={loading}
                >
                  Submit
                </button>
                <button
                  type="button"
                  className="ads-cancel-btn"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
