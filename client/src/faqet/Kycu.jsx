import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/img/lype.svg";
import axios from "axios";
import warning from "../assets/img/warning-icon.svg";
import { AuthContext } from "../context/authContext";

const Kycu = () => {
  const [inputs, setInputs] = useState({
    emaili: "",
    fjalekalimi: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { kycu } = useContext(AuthContext);

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    try {
      await kycu(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response.data);
    }
  };
  return (
    <div className="w-screen bg-[#7B8E76]">
      <div className="flex justify-center">
        <img
          className="my-[50px] absolute text-center lg:block hidden"
          src={logo}
          alt="Logoja Lype"
        />
      </div>
      <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden ">
        <div className="h-screen w-full rounded-none bg-[#BCC5B8] px-[40px] pb-[30px] shadow-2xl sm:h-auto sm:w-[510px] sm:rounded-2xl">
          {error && (
            <div className="mt-5 flex h-16 w-full items-center rounded-[10px] bg-[#d6a3a3] px-6 text-[20px] text-[#6e5d5d]">
              <span className="flex items-center">
                <img src={warning} alt="" className="pr-3" />
                {error}
              </span>
            </div>
          )}
          <div className="relative py-[50px]">
            <input
              type="email"
              name="emaili"
              className="peer h-16 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
              placeholder="Shkruaj Emailin"
              onChange={trajtoNdryshimet}
            />
            <label
              htmlFor=""
              className="absolute left-0 z-50 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
            >
              Emaili
            </label>
          </div>
          <div className="relative">
            <input
              type="password"
              name="fjalekalimi"
              className="peer h-16 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
              placeholder="Shkruaj Fjalekalimin"
              onChange={trajtoNdryshimet}
            />
            <label
              htmlFor=""
              className="absolute left-0 z-50 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
            >
              Fjalëkalimi
            </label>
          </div>
          <div className="flex justify-between pt-3">
            <span className="text-lg text-[#757C73]">
              <input type="checkbox" className="border-none bg-inherit" /> Më
              mbaj në mend
            </span>
            <span className="text-lg text-[#757C73] underline">
              <a href="#">Ke harruar fjalëkalimin?</a>
            </span>
          </div>
          <div className="flex justify-center">
            <button
              onClick={trajtoSubmit}
              className="mt-[116px] w-full rounded-[10px] bg-[#7B8E76] p-2 text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
            >
              kyçu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kycu;
