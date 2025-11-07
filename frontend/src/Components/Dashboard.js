import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaBriefcase } from "react-icons/fa";
import { MdSpaceDashboard, MdLiveTv } from "react-icons/md";
import { PiChalkboardTeacherFill } from "react-icons/pi";
import { IoBookSharp } from "react-icons/io5";
import { GiFamilyHouse, GiMeal } from "react-icons/gi";
import { TfiShoppingCart } from "react-icons/tfi";
import { FaRecycle } from "react-icons/fa";
import { FiMenu } from "react-icons/fi";
import Ads from "./Ads";

export default function Dashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isMyPostAskPage = location.pathname.includes("/dashboard/mypostask");
  const currentSection = localStorage.getItem("currentSection");

  //Redirect to general by default if no section selected
  useEffect(() => {
    const section = localStorage.getItem("currentSection");
    if (!section) {
      localStorage.setItem("currentSection", "general");
    }

    // If the current path is just "/dashboard", redirect to general
    if (location.pathname === "/dashboard") {
      navigate("/dashboard/general", { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="dash-wrapper">
      <button className="toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FiMenu size={20} />
      </button>

      <div className={`dash-sidebar ${sidebarOpen ? "active" : ""}`}>
        <div className="dash-sidebar-top">
          <div className="navbar-links">
            {[
              { to: "/dashboard/general", label: "General", icon: <MdSpaceDashboard />, section: "general" },
              { to: "/dashboard/job", label: "Job", icon: <FaBriefcase />, section: "job" },
              { to: "/dashboard/coaching", label: "Institute", icon: <PiChalkboardTeacherFill />, section: "coaching" },
              { to: "/dashboard/tiffin", label: "Food", icon: <GiMeal />, section: "tiffin" },
              { to: "/dashboard/entertainment", label: "Entertainment", icon: <MdLiveTv />, section: "entertainment" },
              { to: "/dashboard/learning", label: "Learning / Notes", icon: <IoBookSharp />, section: "notes" },
              { to: "/dashboard/accommodation", label: "Accommodation", icon: <GiFamilyHouse />, section: "accommodation" },
              { to: "/dashboard/shop", label: "Shoping", icon: <TfiShoppingCart />, section: "shoping" },
              { to: "/dashboard/useditem", label: "Used-Item", icon: <FaRecycle />, section: "useditem" },
            ].map((item, index) => (
              <NavLink
                key={index}
                to={item.to}
                className={({ isActive }) => {
                  if (isActive && !isMyPostAskPage) return "nav-item active-blue";
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

      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)}></div>
      )}

      <div className="dash-content">
        <div className="dash-outlet">
          <Outlet context={{ currentSection }} />
        </div>

        <div className="dash-right-ads">
          <Ads />
        </div>
      </div>
    </div>
  );
}
