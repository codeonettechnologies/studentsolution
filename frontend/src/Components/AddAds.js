import React, { useState, useEffect } from "react";
import axios from "axios";
import { FiMoreVertical } from "react-icons/fi";
import toast from "react-hot-toast";

export default function AddAds() {
  const [ads, setAds] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ image: "", video: "" });

  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [updateData, setUpdateData] = useState({ image: "", video: "" });

  const [selectedAd, setSelectedAd] = useState(null);
  const [menuOpen, setMenuOpen] = useState(null);

  const [loading, setLoading] = useState(false);

  // Fetch ads
  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/all");
      setAds(res.data);
    } catch (err) {
      console.error("Error fetching ads:", err);
    }
  };

  const handleChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  const handleUpdateChange = (e) => {
    const { name, files } = e.target;
    setUpdateData({ ...updateData, [name]: files[0] });
  };

  // Add new ad
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.image && !formData.video) return toast("Upload image or video");

    const data = new FormData();
    if (formData.image) data.append("image", formData.image);
    if (formData.video) data.append("video", formData.video);

    try {
      setLoading(true);
      await axios.post("http://localhost:5000/admin/addAd", data);
      toast.success("Ad Added!");
      setShowForm(false);
      setFormData({ image: "", video: "" });
      fetchAds();
    } catch (err) {
      toast.error("Failed to Add Ad");
    } finally {
      setLoading(false);
    }
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Confirm delete?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/deleteAds/${id}`);
      toast.success("Ad Deleted!");
      setAds(ads.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  // Open update popup
  const openUpdateForm = (ad) => {
    setSelectedAd(ad);
    setShowUpdateForm(true);
    setMenuOpen(null);
  };

  // Update ad
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    if (updateData.image) data.append("image", updateData.image);
    if (updateData.video) data.append("video", updateData.video);

    try {
      setLoading(true);

      await axios.put(
        `http://localhost:5000/admin/update/${selectedAd.id}`,
        data
      );

      toast.success("Ad Updated!");
      setShowUpdateForm(false);
      setUpdateData({ image: "", video: "" });
      fetchAds();
    } catch (err) {
      toast.error("Failed to update");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ads-container">

      <div className="ads-header">
        <button className="add-btn" onClick={() => setShowForm(true)}  style={{ marginBottom: 20 }}>
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

                <td style={{ position: "relative" }}>
                  <FiMoreVertical
                    className="menu-icon"
                    onClick={() =>
                      setMenuOpen(menuOpen === ad.id ? null : ad.id)
                    }
                  />

                  {menuOpen === ad.id && (
                    <div className="action-menu">
                      <p
                        className="action-menu-item"
                        onClick={() => openUpdateForm(ad)}
                      >
                        Update
                      </p>
                      <p
                        className="action-menu-item"
                        onClick={() => handleDelete(ad.id)}
                      >
                        Delete
                      </p>
                    </div>
                  )}
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

      {/* ADD AD POPUP */}
      {showForm && (
        <div className="ads-popup">
          <div className="ads-card">
            <form onSubmit={handleSubmit}>
              <h2 className="ads-title">
                {loading ? "Uploading..." : "Add Advertisement"}
              </h2>

              <div className="ads-group">
                <label>Upload Image:</label>
                <input type="file" name="image" onChange={handleChange} className="ads-input" />
              </div>

              <div className="ads-group">
                <label>Upload Video:</label>
                <input type="file" name="video" onChange={handleChange} className="ads-input" />
              </div>

              <div className="ads-buttons">
                <button type="submit" className="ads-submit-btn">
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

      {/* UPDATE POPUP */}
      {showUpdateForm && (
        <div className="ads-popup">
          <div className="ads-card">
            <form onSubmit={handleUpdateSubmit}>
              <h2 className="ads-title">
                {loading ? "Updating..." : "Update Advertisement"}
              </h2>

              <div className="ads-group">
                <label>Update Image:</label>
                <input type="file" name="image" onChange={handleUpdateChange} className="ads-input" />
              </div>

              <div className="ads-group">
                <label>Update Video:</label>
                <input type="file" name="video" onChange={handleUpdateChange} className="ads-input" />
              </div>

              <div className="ads-buttons">
                <button type="submit" className="ads-submit-btn">
                  Update
                </button>
                <button
                  type="button"
                  className="ads-cancel-btn"
                  onClick={() => setShowUpdateForm(false)}
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
