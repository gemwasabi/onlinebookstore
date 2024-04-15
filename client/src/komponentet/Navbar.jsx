import React from 'react';
import './Navbar.css';
const Navbar = () => {
  
  return (
    <nav>
    <div className="logo">
       <img id="lype" src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713009973/lype_crhi55.svg" alt=""/>
    </div>
    <div className="searchbar">
        <input type="search" placeholder="kërko këtu.."/> 
    </div>
    <div className="items">
        <img id="user" src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1713122873/User_yr1eko.svg" alt=""/>
    </div>
</nav>
  );
};

export default Navbar;
