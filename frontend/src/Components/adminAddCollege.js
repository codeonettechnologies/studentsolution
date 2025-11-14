import React, { useState, useEffect } from "react";
import { FiMoreVertical } from "react-icons/fi";
import axios from "axios";

export default function AddCollege() {
  const [colleges, setColleges] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [college, setCollegeName] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const res = await axios.get("http://localhost:5000/admin/getAllCollege");
      if (Array.isArray(res.data.colleges)) {
        setColleges(res.data.colleges);
      } else if (Array.isArray(res.data)) {
        setColleges(res.data);
      }
    } catch (error) {
      console.error("Error fetching colleges:", error);
      alert("Failed to load colleges.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!college.trim()) return alert("Please enter a college name!");

    try {
      const res = await axios.post("http://localhost:5000/admin/addCollege", {
        college,
      });
      if (
        res.status >= 200 &&
        res.status < 300 &&
        (res.data.success || res.data.message)
      ) {
        alert(res.data.message || "College added successfully!");
        setCollegeName("");
        setShowForm(false);
        fetchColleges();
      } else {
        alert("Failed to add college. Please try again.");
      }
    } catch (error) {
      console.error("Error adding college:", error);
      alert("Server error. Please try again later.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this college?"))
      return;

    try {
      const res = await axios.delete(
        `http://localhost:5000/admin/deleteClg/${id}`
      );
      if (res.status >= 200 && res.status < 300) {
        alert(res.data.message || "College deleted successfully!");
        setColleges(colleges.filter((c) => c.id !== id));
      }
    } catch (error) {
      console.error("Error deleting college:", error);
      alert("Failed to delete college.");
    }

    setOpenMenuId(null);
  };

  return (
    <div className="college-container">
      <div className="college-header">
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Add College
        </button>
      </div>

      <table className="college-table">
        <thead>
          <tr>
            <th>College Name</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {colleges.length > 0 ? (
            colleges.map((college) => (
              <tr key={college.id}>
                <td>{college.college}</td>
                <td style={{ position: "relative" }}>
                  <button
                    className="menu-btn"
                    onClick={() =>
                      setOpenMenuId(
                        openMenuId === college.id ? null : college.id
                      )
                    }
                  >
                    <FiMoreVertical size={18} />
                  </button>
                  {openMenuId === college.id && (
                    <div className="action-menu">
                      <button
                        className="delete-option"
                        onClick={() => handleDelete(college.id)}
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
                No Colleges Added Yet
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {showForm && (
        <div className="college-popup">
          <div className="college-card">
            <form onSubmit={handleSubmit}>
              <h3 className="form-title">Add College</h3>
              <div className="form-group">
                <label htmlFor="college">College Name:</label>
                <input
                  id="college"
                  type="text"
                  value={college}
                  onChange={(e) => setCollegeName(e.target.value)}
                  placeholder="Enter college name"
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
