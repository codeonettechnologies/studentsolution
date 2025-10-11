import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import { MdSpaceDashboard, MdCastForEducation, MdLiveTv } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { IoBookSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <div className="dash-wrapper">
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={24} />
        </button>

        <div className={`dash-sidebar ${sidebarOpen ? "active" : ""}`}>
          <div className="dash-sidebar-top">
            <div className="profile-info">
              <div className="navbar-links">
                <NavLink to="/dashboard" end onClick={() => setSidebarOpen(false)}>
                  <MdSpaceDashboard />
                  <span>General</span>
                </NavLink>
                <NavLink to="/dashboard/job" onClick={() => setSidebarOpen(false)}>
                  <FaBriefcase />
                  <span>Job</span>
                </NavLink>
                <NavLink to="/dashboard/coching" onClick={() => setSidebarOpen(false)}>
                  <PiChalkboardTeacherFill />
                  <span>Coaching</span>
                </NavLink>
                <NavLink to="/dashboard/entertainment" onClick={() => setSidebarOpen(false)}>
                  <MdLiveTv />
                  <span>Entertainment</span>
                </NavLink>
                <NavLink to="/dashboard/notes" onClick={() => setSidebarOpen(false)}>
                  <IoBookSharp />
                  <span>Notes/Books</span>
                </NavLink>
                <NavLink to="/dashboard/education" onClick={() => setSidebarOpen(false)}>
                  <MdCastForEducation />
                  <span>Education</span>
                </NavLink>
              </div>
            </div>
          </div>
        </div>

        {sidebarOpen && (
          <div
            className="sidebar-overlay"
            onClick={() => setSidebarOpen(false)}
          ></div>
        )}

        <div className="dash-outlet">
          <Outlet />
        </div>
      </div>
    </>
  );
}
