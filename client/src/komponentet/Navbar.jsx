import React, { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import search from "../assets/img/Book.svg";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [isActive, setIsActive] = useState(false);

  const handleLogout = async () => {
    await ckycu();
  };

  return (
    <nav className="bg-[#879C82] flex flex-col md:flex-row justify-between items-center h-auto md:h-[100px] px-4 md:px-8 py-4 sticky top-0 z-10">
      <div className="flex justify-between items-center w-full md:w-auto">
        <div className="logo">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg"
              alt="Logo"
              className="h-6 md:h-8"
            />
          </Link>
        </div>
        <div className="md:hidden">
          <img
            src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
            alt="User Icon"
            className="h-6 md:h-8"
          />
        </div>
      </div>
      <div className="relative w-full max-w-[438px] my-4 md:my-0">
        <input
          type="text"
          className={`transition-colors duration-200 w-full rounded-3xl border-4 border-[#ADBBAA] bg-[#BDC6BA] hover:drop-shadow-md p-2 outline-none placeholder:p-3 placeholder:text-left placeholder:font-sans placeholder:text-[#858B83] text-[#747474] hover:border-[#FFFFFF] hover:shadow active:border-[#FFFFFF] ${
            isActive ? "" : "pr-12"
          }`}
          placeholder="kërko këtu..."
          onFocus={() => setIsActive(true)}
          onBlur={() => setIsActive(false)}
        />
        {!isActive && (
          <img
            className="w-10 h-10 absolute right-0 top-0 mt-1 mr-3"
            src={search} // replace with actual path to the search icon
            alt="search ikona"
          />
        )}
      </div>
      <div className="hidden md:flex items-center">
        <img
          src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
          alt="User Icon"
          className="h-6 md:h-8"
        />
      </div>
    </nav>
  );
};

export default Navbar;
