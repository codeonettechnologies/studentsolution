import React, { useState } from "react";
import { FiSearch } from "react-icons/fi";
import { IoPerson } from "react-icons/io5";

export default function Header() {
    const[menuOpen , setMenuOpen] = useState(false);
  return (
    <>
      <div className="header-wrapper">
        <div className="header-top">
          <div className="logo-top-left">
            <h1>Logo</h1>
          </div>
          <div className="search-iconn-right">
            <FiSearch />
          </div>
        </div>

        <div className="header-bottom">
        <div className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
            <span></span>
            <span></span>
            <span></span>
        </div>
          <div className={`menu-bottom-left ${menuOpen ? "active" : ""}`}>
            <a href="home">Home</a>
            <a href="#">About-Us</a>
            <a href="#">Contact</a>
            <button>Registration</button>
          </div>
          <div className="profile-bottom-right">
            <IoPerson />
          </div>
        </div>
      </div>
    </>
  );
}