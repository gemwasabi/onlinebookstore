import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {

  return (
    <nav className="bg-[#879C82] flex flex-row justify-between items-center px-4 md:px-8 py-4">
      <div className="logo mb-4 md:mb-0 hidden md:block">
        <img
          src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg"
          alt=""
          className="w-16 md:w-24"
        />
      </div>

      <div className="searchbar flex-1 max-w-md md:max-w-full md:text-center md:flex md:items-center md:justify-center">
        <input
          type="text"
          className="w-full md:w-auto rounded-3xl border-4 border-[#ADBBAA] bg-[#BDC6BA] p-2 outline-none placeholder:p-2 placeholder:text-left placeholder:font-sans placeholder:text-[#858B83] hover:border-[#FFFFFF] hover:shadow active:border-[#FFFFFF]"
          placeholder="kërko këtu..."
        />
      </div>

      <div className="ml-auto flex">
        <img
          src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
          alt=""
          className="w-6 md:w-8"
        />
      </div>
    </nav>
  );
};

export default Navbar;
