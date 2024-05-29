import React from "react";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? "active" : "";
  };

  return (
    <nav id="sidebar" className="sidebar js-sidebar">
      <div className="sidebar-content js-simplebar">
        <a className="sidebar-brand" href="index.html">
          <span className="align-middle">Lype</span>
        </a>

        <ul className="sidebar-nav">
          <li className="sidebar-header">Kryesore</li>

          <li className={`sidebar-item ${isActive("/")}`}>
            <Link className="sidebar-link" to="/admin/ballina">
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Ballina</span>
            </Link>
          </li>

          <li
            className={`sidebar-item ${isActive(
              "/admin/perdoruesit/shfaqPerdoruesit"
            )}`}
          >
            <Link
              className="sidebar-link"
              to="/admin/perdoruesit/shfaqPerdoruesit"
            >
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Perdoruesit</span>
            </Link>
          </li>

          <li className="sidebar-header">Faqet</li>

          <li
            className={`sidebar-item ${isActive("/admin/librat/shfaqLibrat")}`}
          >
            <Link className="sidebar-link" to="/admin/librat/shfaqLibrat">
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Librat</span>
            </Link>
          </li>

          <li
            className={`sidebar-item ${isActive(
              "/admin/kategorite/shfaqKategorite"
            )}`}
          >
            <Link
              className="sidebar-link"
              to="/admin/kategorite/shfaqKategorite"
            >
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Kategorite</span>
            </Link>
          </li>

          <li
            className={`sidebar-item ${isActive(
              "/admin/porosite/shfaqPorosite"
            )}`}
          >
            <Link className="sidebar-link" to="/admin/porosite/shfaqPorosite">
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Porosite</span>
            </Link>
          </li>

          <li
            className={`sidebar-item ${isActive(
              "/admin/tufat"
            )}`}
          >
            <Link className="sidebar-link" to="/admin/tufat">
              <i className="align-middle" data-feather="sliders"></i>
              <span className="align-middle">Tufat</span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Sidebar;
