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

  const [errors, setErrors] = useState({
    emaili: "",
    fjalekalimi: "",
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { kycu } = useContext(AuthContext);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      return "Emaili nuk mund të jetë bosh.";
    } else if (!emailRegex.test(email)) {
      return "Emaili duhet të jetë në formatin e duhur.";
    }
    return "";
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
    if (!password.trim()) {
      return "Fjalëkalimi nuk mund të jetë bosh.";
    } else if (!passwordRegex.test(password)) {
      return "Fjalëkalimi duhet të jetë të paktën 8 karaktere dhe të përmbajë një shkronjë, një numër dhe një simbol.";
    }
    return "";
  };

  const trajtoNdryshimet = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: name === "emaili" ? validateEmail(value) : validatePassword(value) }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();

    // Validate form before submission
    const newErrors = {
      emaili: validateEmail(inputs.emaili),
      fjalekalimi: validatePassword(inputs.fjalekalimi),
    };

    setErrors(newErrors);

    // If there are errors, prevent form submission
    if (newErrors.emaili || newErrors.fjalekalimi) {
      return;
    }

    try {
      await kycu(inputs);
      navigate("/");
    } catch (err) {
      setError(err.response?.data || "Diçka shkoi keq. Ju lutem provoni përsëri.");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      trajtoSubmit(e);
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
      <div className="relative mt-5 flex min-h-screen flex-col items-center justify-center overflow-hidden ">
        <div className="h-screen w-full rounded-none bg-[#BCC5B8] px-[40px] pb-[30px] shadow-2xl sm:h-auto sm:w-[510px] sm:rounded-2xl">
          {error && (
            <div className="mt-5 flex h-16 w-full items-center rounded-[10px] bg-[#d6a3a3] px-6 text-[20px] text-[#6e5d5d]">
              <span className="flex items-center">
                <img src={warning} alt="" className="pr-3" />
                {error}
              </span>
            </div>
          )}
          <form>
            <div className="relative py-[50px]">
              <input
                type="email"
                name="emaili"
                className={`peer h-16 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0 ${
                  errors.emaili ? "border-red-500" : ""
                }`}
                placeholder="Shkruaj Emailin"
                value={inputs.emaili}
                onChange={trajtoNdryshimet}
              />
              <label
                htmlFor=""
                className="absolute left-0 z-50 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
              >
                Emaili
              </label>
              {errors.emaili && (
                <div className="text-sm text-red-500 ml-[10px] mt-1 absolute left-0">
                  {errors.emaili}
                </div>
              )}
            </div>
            <div className="relative py-[20px]">
              <input
                type="password"
                name="fjalekalimi"
                className={`peer h-16 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0 ${
                  errors.fjalekalimi ? "border-red-500" : ""
                }`}
                placeholder="Shkruaj Fjalekalimin"
                value={inputs.fjalekalimi}
                onChange={trajtoNdryshimet}
                onKeyPress={handleKeyPress}
              />
              <label
                htmlFor=""
                className="absolute left-0 z-50 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
              >
                Fjalëkalimi
              </label>
              {errors.fjalekalimi && (
                <div className="text-sm text-red-500 ml-[10px] mt-1 absolute left-0 bottom-[-40px] lg:bottom-[-20px] md:bottom-[-20px]">
                  {errors.fjalekalimi}
                </div>
              )}
            </div>
            <div className="flex justify-between pt-5 lg:pt-4 md:pt-4">
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
                type="submit"
                onClick={trajtoSubmit}
                className="mt-[116px] w-full rounded-[10px] bg-[#7B8E76] p-2 text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
              >
                kyçu
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Kycu;
