import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";

export default function AddField() {
  const [fields, setFields] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [profession, setProfession] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  // Fetch all professions
  const fetchFields = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/getAllProfessions");
      setFields(res.data || []);
    } catch (err) {
      console.error("Error fetching professions:", err);
      alert("Failed to load professions.");
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  // Add new profession
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profession.trim()) return alert("Please enter a profession!");

    try {
      await axios.post("http://localhost:5000/admin/addProfessions", { profession });
      alert("Profession added successfully!");
      setProfession("");
      setShowForm(false);
      fetchFields(); // refresh list
    } catch (err) {
      console.error("Error adding profession:", err);
      alert("Failed to add profession!");
    }
  };

  // Delete profession
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this profession?")) return;

    try {
      await axios.delete(`http://localhost:5000/admin/deleteProfessions/${id}`);
      alert("Profession deleted successfully!");
      fetchFields(); // refresh list
    } catch (err) {
      console.error("Error deleting profession:", err);
      alert("Failed to delete profession!");
    }
    setOpenMenuId(null);
  };

  return (
    <div className="field-container">
      <div className="field-header">
        <button
          className="add-btn"
          onClick={() => setShowForm(true)}
          style={{ marginBottom: 20 }}
        >
          + Add Profession
        </button>
      </div>

      <table className="field-table">
        <thead>
          <tr>
            <th>Profession</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {fields.length > 0 ? (
            fields.map((f) => (
              <tr key={f.id}>
                <td>{f.profession}</td>
                <td style={{ position: "relative" }}>
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenuId(openMenuId === f.id ? null : f.id)
                    }
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openMenuId === f.id && (
                    <div className="action-menu">
                      <button
                        className="delete-option"
                        onClick={() => handleDelete(f.id)}
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
                No Professions Added Yet
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
              <h3 className="form-title">Add Profession</h3>
              <div className="form-group">
                <label htmlFor="profession">Profession Name:</label>
                <input
                  id="profession"
                  type="text"
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="Enter profession name"
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
