import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

export default function AddCity() {
  const [cities, setCities] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [city, setCity] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  console.log("city", cities);

  // Fetch all cities
  const fetchCities = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/getAllCity");
      setCities(res.data || []);
    } catch (err) {
      console.error("Error fetching cities:", err);
    }
  };

  useEffect(() => {
    fetchCities();
  }, []);

  // Add new city
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!city.trim()) return toast("Please enter a city name!");

    try {
      await axios.post("http://localhost:5000/admin/addCity", { city });
      toast.success("City added successfully!");
      setCity("");
      setShowForm(false);
      fetchCities(); // refresh list
    } catch (err) {
      console.error("Error adding city:", err);
      toast.error("Failed to add city!");
    }
  };

  // Delete city
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this city?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/deleteCity/${id}`);
      toast.success("City deleted successfully!");
      fetchCities(); // refresh list
    } catch (err) {
      console.error("Error deleting city:", err);
      toast.error("Failed to delete city!");
    }

    setOpenMenuId(null);
  };

  return (
    <div className="city-container">
      <div className="city-header">
        <button
          className="city-btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: 20 }}
        >
          + Add City
        </button>
      </div>

      <table className="city-table">
        <thead>
          <tr>
            <th>City Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {cities.length > 0 ? (
            cities.map((c) => (
              <tr key={c.id}>
                <td>{c.city}</td>
                <td style={{ position: "relative" }}>
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === c.id ? null : c.id)
                    }
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openMenuId === c.id && (
                    <div className="action-menu">
                      <button
                        className="delete-option"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="2" className="no-data">
                No Cities Added Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/*Popup Form */}
      {showForm && (
        <div className="college-popup">
          <div className="college-card">
            <form onSubmit={handleSubmit}>
              <h3 className="form-title">Add City</h3>
              <div className="form-group">
                <label htmlFor="city">City Name:</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Enter city name"
                  className="form-input"
                />
              </div>
              <div className="form-buttons">
                <button type="submit" className="submit-btn">
                  Submit
                </button>
                <button
                  type="button"
                  className="cancel-btn"
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
