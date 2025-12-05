import React, { useState, useEffect } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function AdminDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 992);
  const location = useLocation();

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const navLinks = [
    { to: "/admindashboard/registeruser", label: "Registered Users" },
    { to: "/admindashboard/visitor", label: "Website Visitors" },
    { to: "/admindashboard/addcity", label: "Cities" },
    { to: "/admindashboard/addcollege", label: "Colleges" },
    { to: "/admindashboard/addfield", label: "Professions" },
    { to: "/admindashboard/addads", label: "Ads" },
    { to: "/admindashboard/addproduct", label: "Shopping Product" },
  ];

  // Active logic including default "/admindashboard"
  const isActive = (path) => {
    return (
      location.pathname === path ||
      (location.pathname === "/admindashboard" &&
        path === "/admindashboard/registeruser")
    );
  };

  return (
    <div className="admin-wrap">
      {isMobile && (
        <button className="admin-hamburger" onClick={toggleMenu}>
          {menuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      )}

      <div
        className={`admin-sidebar ${menuOpen || !isMobile ? "open" : ""}`}
      >
        <h2 className="admin-title">Admin Panel</h2>

        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className={`admin-nav-btn ${isActive(link.to) ? "active" : ""}`}
            onClick={() => isMobile && setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </div>

      <div
        className={`admin-dash-outlet ${
          menuOpen && isMobile ? "shifted" : !isMobile ? "shifted" : ""
        }`}
      >
        <Outlet />
      </div>
    </div>
  );
}
