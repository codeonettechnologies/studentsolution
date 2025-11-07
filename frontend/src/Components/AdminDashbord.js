import React from "react";
import { Outlet, Link } from "react-router-dom";

export default function AdminDashbord() {
  return (
    <div className="admin-wrap">
      <div className="admin-navbar-link">
        <h2 className="admin-title">Admin Panel</h2>
        <Link to="/admindashboard/addcollege" className="admin-nav-btn">
          Add College
        </Link>
        <Link to="/admindashboard/addads" className="admin-nav-btn">
          Add Ads
        </Link>
        <Link to="/admindashboard/addproduct" className="admin-nav-btn">
          Add Shopping Product
        </Link>
      </div>

      <div className="admin-dash-outlet">
        <Outlet />
      </div>
    </div>
  );
}
