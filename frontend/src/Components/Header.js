import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoPerson } from "react-icons/io5";

const Header = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/dashboard";
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img src="https://elitestudentsolution.com/wp-content/uploads/2017/03/logo.png" alt="Logo" className="logo-img" />
          <span className="logo-name">Studentsolution</span>
        </Link>
      </div>

      <div className="header-right">
        <div className="hamburger" onClick={toggleMenu}>
          {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
        </div>

        <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
          <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)}>About</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link to="/privacy" onClick={() => setMenuOpen(false)}>Privacy Policy</Link>
        </nav>

        {isDashboard && (
          <div className="header-dashboard">
            <IoPerson className="profile-icon" />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
