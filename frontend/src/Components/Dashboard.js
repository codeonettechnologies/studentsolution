import React, { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import { MdSpaceDashboard, MdCastForEducation, MdLiveTv } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { IoBookSharp } from "react-icons/io5";
import { FiMenu } from "react-icons/fi";
import { GiMeal } from "react-icons/gi";
import Ads from "./Ads";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Check if we're on mypostask page
  const isMyPostAskPage = location.pathname.includes("/dashboard/mypostask");

  // Read current section stored in localStorage
  const currentSection = localStorage.getItem("currentSection");

  return (
    <>
      <div className="dash-wrapper">
        <button
          className="toggle-btn"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <FiMenu size={20} />
        </button>

        <div className={`dash-sidebar ${sidebarOpen ? "active" : ""}`}>
          <div className="dash-sidebar-top">
            <div className="profile-info">
              <div className="navbar-links">
                {[
                  { to: "/dashboard/general", label: "General", icon: <MdSpaceDashboard />, section: "general" },
                  { to: "/dashboard/job", label: "Job", icon: <FaBriefcase />, section: "job" },
                  { to: "/dashboard/coaching", label: "Coaching", icon: <PiChalkboardTeacherFill />, section: "coaching" },
                  {to: "/dashboard/tiffin", label: "Tiffin", icon: <GiMeal />, section: "tiffin"},
                  { to: "/dashboard/education", label: "Education", icon: <MdCastForEducation />, section: "education" },
                  { to: "/dashboard/entertainment", label: "Entertainment", icon: <MdLiveTv />, section: "entertainment" },
                  { to: "/dashboard/notes", label: "Notes", icon: <IoBookSharp />, section: "notes" },
                ].map((item, index) => (
                  <NavLink
                    key={index}
                    to={item.to}
                    className={({ isActive }) => {
                      // Normal condition for blue highlight
                      if (isActive && !isMyPostAskPage) return "nav-item active-blue";

                      // If we are on /mypostask and this section matches last used section
                      if (isMyPostAskPage && currentSection === item.section)
                        return "nav-item active-smoke";

                      return "nav-item";
                    }}
                    onClick={() => {
                      localStorage.setItem("currentSection", item.section);
                      setSidebarOpen(false);
                    }}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </NavLink>
                ))}
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

        <div className="dash-content">
          <div className="dash-outlet">
            <Outlet />
          </div>
          <div className="dash-right-ads">
            <Ads />
          </div>
        </div>
      </div>
    </>
  );
}

