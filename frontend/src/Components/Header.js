import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { IoPerson } from "react-icons/io5";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboardRoute = location.pathname.startsWith("/dashboard");
  const isAdminDashboardRoute = location.pathname.startsWith("/admindashboard");

  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const dropdownRef = useRef(null);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);
  }, []);

  return (
    <header className="header">
      <div className="header-left">
        <Link to="/" className="logo">
          <img
            src="https://elitestudentsolution.com/wp-content/uploads/2017/03/logo.png"
            alt="Logo"
            className="logo-img"
          />
          <span className="logo-name">Studentsolution</span>
        </Link>
      </div>

      <div className="header-right">
        {/* Hamburger Menu for non-dashboard pages */}
        {!isDashboardRoute && !isAdminDashboardRoute && (
          <div className="hamburger" onClick={toggleMenu}>
            {menuOpen ? <FiX size={25} /> : <FiMenu size={25} />}
          </div>
        )}

        {/* Normal Navigation */}
        {!isDashboardRoute && !isAdminDashboardRoute && (
          <nav className={`nav-menu ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            <Link to="/about" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link to="/contact" onClick={() => setMenuOpen(false)}>
              Contact
            </Link>
            <Link to="/privacy" onClick={() => setMenuOpen(false)}>
              Privacy Policy
            </Link>
          </nav>
        )}

        {/* Profile for Dashboard and AdminDashboard */}
        {(isDashboardRoute || isAdminDashboardRoute) && (
          <div className="profile-dropdown-container" ref={dropdownRef}>
            {/* User/Admin Profile Image or Icon */}
            {user && user.profile_image ? (
              <img
                src={`http://localhost:5000/uploads/${user.profile_image}`}
                alt="User"
                className="profile-img"
                onClick={toggleDropdown}
              />
            ) : (
              <IoPerson
                className="profile-icon"
                onClick={toggleDropdown}
                size={28}
              />
            )}

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div className="profile-dropdown">
                {isDashboardRoute && (
                  <>
                    <Link
                      to="/dashboard/profile"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Profile
                    </Link>
                    <Link
                      to="/dashboard/mypostask"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Post / Ask
                    </Link>
                    <Link
                      to="/dashboard/myorder"
                      onClick={() => setDropdownOpen(false)}
                    >
                      My Order
                    </Link>
                  </>
                )}

                {isAdminDashboardRoute && (
                  <>
                    <Link
                      to="/admindashboard/registeruser"
                      onClick={() => setDropdownOpen(false)}
                    >
                      Admin Panel
                    </Link>
                  </>
                )}

                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
