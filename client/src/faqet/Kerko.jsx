import React, { useState } from "react";
import logo from "../assets/img/lype.svg";
import scroll from "../assets/img/scroll.svg";
import search from "../assets/img/Book.svg";

const Kerko = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <div className="w-screen bg-[#7B8E76]">
      <div className="flex justify-center">
        <img
          className="mt-[283px] absolute text-center"
          src={logo}
          alt="Logoja Lype"
        />
      </div>
      <div className="min-h-screen w-screen relative flex flex-col items-center justify-center">
        <div className="relative w-full max-w-[600px]">
          <input
            type="text"
            className={`transition-colors duration-200 w-full rounded-3xl border-4 border-[#ADBBAA] bg-[#BDC6BA] hover:drop-shadow-md p-2 outline-none placeholder:p-2 placeholder:text-left placeholder:font-sans placeholder:text-[#858B83] text-[#747474] px-5 hover:border-[#FFFFFF] hover:shadow active:border-[#FFFFFF] ${
              isActive ? "" : "pr-12"
            }`}
            placeholder="kërko këtu..."
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
          />
          {!isActive && (
            <img
              className="w-10 h-10 absolute right-0 top-0 mt-1 mr-3"
              src={search}
              alt="search ikona"
            />
          )}
        </div>
        <img
          className={`w-10 h-10 absolute bottom-0 mb-4 self-center ${
            !isActive ? "animate-bounce" : ""
          }`}
          src={scroll}
          alt="scroll ikona"
        />
      </div>
    </div>
  );
};

export default Kerko;
