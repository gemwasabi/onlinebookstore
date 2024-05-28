import React, { useContext } from "react";
import { AuthContext } from "../context/authContext";

const Navbar = () => {
  const { currentUser, ckycu } = useContext(AuthContext);

  const handleLogout = async () => {
    await ckycu();
  };

  return (
    <nav class="bg-[#879C82] flex justify-between items-center px-4 md:px-8 py-4">
  <div class="logo">
    <img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg" alt="Logo" class="h-6 md:h-8"/>
  </div>
  <div class="flex-1 flex justify-center">
    <div class="relative w-full max-w-xs">
      <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
         <img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1716846152/Book_1_ti41ba.svg" alt="Add to Cart" class="h-5 w-5"/>
      </div>
      <input type="text" class="bg-[#BDC6BA] border-4 border-[#ADBBAA] text-[#858B83] rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:border-white focus:shadow-md placeholder:text-center" placeholder="kërko këtu..."/>
    </div>
  </div>
  <div class="items">
    <img src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg" alt="User Icon" class="h-6 md:h-8"/>
  </div>
</nav>
  );
};

export default Navbar;
