import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import SearchIcon from "../assets/img/search.svg";
import Filter from "../assets/img/filter.svg";

const Navbar = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    await ckycu();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#879C82] flex flex-col md:flex-row justify-between items-center h-auto md:h-[100px] px-4 md:px-8 py-4 sticky top-0 z-[1000]">
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
            className="h-6 md:h-8 cursor-pointer"
            onClick={toggleDropdown}
          />
        </div>
      </div>
      <div className="relative gap-4 my-4 md:my-0 flex items-center no-underline">
      <a href="/#search-section">
        <img
          src={SearchIcon}
          alt="search icon"
          className="h-6 md:h-8"
        />
      </a>
      <a href="/kategoria">
        <img
          src={Filter}
          alt="search icon"
          className="h-6 md:h-8"
        />
      </a>
      </div>
      <div className="hidden md:flex items-center relative">
        <img
          src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
          alt="User Icon"
          className="h-6 md:h-8 cursor-pointer"
          onClick={toggleDropdown}
        />
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-[#7B8E76] rounded-md shadow-lg py-1 z-20">
            {currentUser ? (
              <>
                <Link
                  to="/procesimi"
                  className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
                  onClick={closeDropdown}
                >
                  Shporta
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
                  onClick={closeDropdown}
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    closeDropdown();
                  }}
                  className="w-full text-left block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
                >
                  Ckycu
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/kycu"
                  className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
                  onClick={closeDropdown}
                >
                  Kycu
                </Link>
                <Link
                  to="/regjistrohu"
                  className="block px-4 py-2 text-sm text-[#6e5d5d] hover:bg-[#BDC6BA]"
                  onClick={closeDropdown}
                >
                  Regjistrohu
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
