import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import SearchIcon from "../assets/img/search.svg";
import Filter from "../assets/img/filter.svg";
import Checkout from "../assets/img/checkout.svg";
import { useNavigate } from "react-router-dom";
import Menu from "../assets/img/menu.svg";

const Navbar = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await ckycu();
      // Redirect to the main page after logging out
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Handle logout failure if needed
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const closeDropdown = () => {
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-[#879C82] flex flex-col md:flex-row justify-between items-center md:h-[100px] px-8 py-4 sticky top-0 z-[1000]">
      {/* First Row: Logo (Phone view only) */}
      <div className="w-full flex justify-center md:hidden mb-4">
        <Link to="/">
          <img
            src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg"
            alt="Logo"
            className="h-8" // Fixed size, logo won't change
          />
        </Link>
      </div>

      {/* Full Layout for Normal View */}
      <div className="flex justify-between w-full items-center">
        {/* Left: Menu Icon */}
        <div>
          <Link to="/">
            <img src={Menu} alt="Menu Icon" className="h-6 md:h-8" />
          </Link>
        </div>

        {/* Center: Logo (Visible on larger screens) */}
        <div className="hidden md:block justify-center">
          <Link to="/">
            <img
              src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg"
              alt="Logo"
              className="h-8" // Fixed size on larger screens
            />
          </Link>
        </div>

        {/* Right: User Icon and Checkout */}
        <div className="flex items-center space-x-4">
          {/* User Icon */}
          <img
            src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg"
            alt="User Icon"
            className="h-6 md:h-8 cursor-pointer"
            onClick={toggleDropdown}
            aria-expanded={isDropdownOpen ? "true" : "false"}
          />

          {currentUser && (
            <Link to="/pagesa">
              <img src={Checkout} alt="Checkout Icon" className="h-6 md:h-8" />
            </Link>
          )}
        </div>
      </div>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`absolute right-0 top-full mt-0 w-48 bg-[#879C82] rounded-md shadow-lg py-2 z-20 transition-all duration-300 ease-in-out ${
          isDropdownOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-2"
        }`}
        style={{ right: "0" }} // Ensure the dropdown aligns with the right edge of the navbar
      >
        {currentUser ? (
          <>
            {currentUser.grupi == 1 && (
              <Link
                to="/admin"
                className="block px-4 py-2 text-lg text-[#6e5d5d] hover:text-white hover:bg-[#BDC6BA]"
                onClick={closeDropdown}
              >
                Admin
              </Link>
            )}
            <Link
              to="/sfondi"
              className="block px-4 py-2 text-lg text-[#6e5d5d] hover:text-white hover:bg-[#BDC6BA]"
              onClick={closeDropdown}
            >
              Sfondi
            </Link>
            <button
              onClick={() => {
                handleLogout();
                closeDropdown();
              }}
              className="w-full text-left block px-4 py-2 text-lg text-[#6e5d5d] hover:text-white hover:bg-[#BDC6BA]"
            >
              Ckycu
            </button>
          </>
        ) : (
          <>
            <Link
              to="/kycu"
              className="block px-4 py-2 text-lg text-[#6e5d5d] hover:bg-[#BDC6BA]"
              onClick={closeDropdown}
            >
              Kycu
            </Link>
            <Link
              to="/regjistrohu"
              className="block px-4 py-2 text-lg text-[#6e5d5d] hover:bg-[#BDC6BA]"
              onClick={closeDropdown}
            >
              Regjistrohu
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
