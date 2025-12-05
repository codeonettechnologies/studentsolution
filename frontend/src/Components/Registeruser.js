import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function RegisterUser() {
  const [users, setUsers] = useState([]);

  // Fetch users from API
  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/auth/getAllUser");
      if (res.data && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
      toast.error("Failed to fetch users!");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="register-user-container">
      <table className="register-user-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile Number</th>
            <th>College</th>
            <th>City</th>
            <th>Year</th>
            <th>Profession</th>
            <th>Role</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.mobile_number}</td>
                <td>{u.college}</td>
                <td>{u.city}</td>
                <td>{u.college_year}</td>
                <td>{u.profession}</td>
                <td>{u.role}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="no-data">
                No users found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
