import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, ckycu } = useContext(AuthContext);

  const handleLogout = async () => {
    await ckycu();
  };

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

      <div className="ml-auto flex items-center relative group">
        <img
          src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
          alt=""
          className="w-6 md:w-8 cursor-pointer"
        />
        <div className="absolute right-0 mt-2 w-48 bg-[#7B8E76] rounded-md shadow-lg py-1 z-20 hidden group-hover:block">
          {currentUser ? (
            <>
              <a
                href="/settings"
                className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
              >
                Settings
              </a>
              <button
                onClick={handleLogout}
                className="w-full text-left block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
              >
                Ckycu
              </button>
            </>
          ) : (
            <>
              <a
                href="/kycu"
                className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
              >
                Kycu
              </a>
              <a
                href="/regjistrohu"
                className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
              >
                Regjistrohu
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
