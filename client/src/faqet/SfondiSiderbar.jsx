import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";

const DeleteProfileButton = () => {
  const { currentUser } = useContext(AuthContext);

  const handleDeleteProfile = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your profile? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          `http://localhost:8800/api/perdoruesit/${currentUser.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`, // Adjust if needed
            },
          }
        );

        alert(
          "Profile deleted successfully. You will be redirected to the login page."
        );
        // Redirect to login page
        window.location.href = "/kycu"; // Adjust the path as needed
      } catch (err) {
        console.error("Error deleting profile:", err);
        alert("Failed to delete profile. Please try again later.");
      }
    }
  };

  return (
    <button
      type="button"
      onClick={handleDeleteProfile}
      className="text-xl w-full text-left px-3 py-2 mb-2 lg:mb-4 hover:bg-red-400 text-red-300 hover:text-white transition-colors rounded-lg"
    >
      Fshij Profilin
    </button>
  );
};

const Sidebar = () => {
  const location = useLocation();
  const { currentUser } = useContext(AuthContext);

  return (
    <div className="lg:w-1/4 bg-[#7B8E76] p-4 text-[#c3c9be] flex flex-col">
      <h1 className="text-xl lg:text-3xl font-bold mb-4 lg:mb-10 text-[#c3c9be]">
        Sfondi
      </h1>
      <SidebarButton
        to="/sfondi"
        label="Përdoruesi"
        currentPath={location.pathname}
      />
      <SidebarButton
        to="/sfondi/adresat"
        label="Adresat"
        currentPath={location.pathname}
      />
      <SidebarButton
        to="/sfondi/kartelat"
        label="Kartela bankare"
        currentPath={location.pathname}
      />
      <SidebarButton
        to="/sfondi/porosite"
        label="Porosite"
        currentPath={location.pathname}
      />
      {currentUser.grupi == 0 && <DeleteProfileButton />}
    </div>
  );
};

const SidebarButton = ({ to, label, currentPath }) => {
  const isActive = currentPath === to;
  return (
    <Link to={to}>
      <button
        className={`text-xl w-full text-left px-3 py-2 mb-2 lg:mb-4 transition-colors rounded-lg ${
          isActive ? "bg-[#8E9A83]" : "hover:bg-[#8E9A83]"
        }`}
      >
        {label}
      </button>
    </Link>
  );
};

export default Sidebar;
