import React, { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import SfondiSiderbar from "./SfondiSiderbar";

const UserSettings = () => {
  const { currentUser } = useContext(AuthContext);

  const [currentUserData, setCurrentUserData] = useState([]);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    emri: "",
    mbiemri: "",
    emaili: "",
    fjalekalimi: "",
    kfjalekalimi: "",
  });
  const [inputs, setInputs] = useState({
    emri: currentUser ? currentUser.emri : "",
    mbiemri: currentUser ? currentUser.mbiemri : "",
    emaili: currentUser ? currentUser.emaili : "",
    fjalekalimi: "", // Initialize fjalekalimi
    kfjalekalimi: "", // Initialize kfjalekalimi
    perdoruesi_id: currentUser ? currentUser.id : "",
  });

  useEffect(() => {
    fetchUser();
  }, [currentUser.id]);

  const validateEmri = (value) => (value ? "" : "Emri është i detyrueshëm");
  const validateMbiemri = (value) =>
    value ? "" : "Mbiemri është i detyrueshëm";
  const validateEmail = (value) =>
    /\S+@\S+\.\S+/.test(value) ? "" : "Emaili nuk është i vlefshëm";
  const validatePassword = (value) =>
    !value || value.length >= 6
      ? ""
      : "Fjalëkalimi duhet të ketë të paktën 6 karaktere";
  const validateConfirmPassword = (value) =>
    !value || value === inputs.fjalekalimi ? "" : "Fjalëkalimet nuk përputhen";

  const trajtoSubmit = async (e) => {
    e.preventDefault();

    const newErrors = {
      emri: validateEmri(inputs.emri),
      mbiemri: validateMbiemri(inputs.mbiemri),
      emaili: validateEmail(inputs.emaili),
      fjalekalimi: validatePassword(inputs.fjalekalimi),
      kfjalekalimi: validateConfirmPassword(inputs.kfjalekalimi),
    };

    setErrors(newErrors);

    if (
      newErrors.emri ||
      newErrors.mbiemri ||
      newErrors.emaili ||
      newErrors.fjalekalimi ||
      newErrors.kfjalekalimi
    ) {
      return;
    }

    try {
      await axios.put("http://localhost:8800/api/perdoruesit", {
        ...inputs,
        perdoruesi_id: currentUser.id,
      });
      alert("Profile updated successfully.");
      fetchUser(); // Refetch user data after update
    } catch (err) {
      setError(err.response.data);
    }
  };

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/perdoruesit/${currentUser.id}`
      );

      if (response.data) {
        setCurrentUserData(response.data);
        setInputs({
          emri: response.data.emri || "",
          mbiemri: response.data.mbiemri || "",
          emaili: response.data.emaili || "",
          fjalekalimi: "",
          kfjalekalimi: "",
          perdoruesi_id: currentUser.id,
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const trajtoNdryshimet = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#8E9A83]">
      <SfondiSiderbar />

      <div className="flex-1 p-4 lg:p-10 bg-[#BCC5B8] flex flex-col">
        <form className="w-full max-w-lg mx-auto" onSubmit={trajtoSubmit}>
          {[
            { name: "emri", placeholder: "Emri", type: "text" },
            { name: "mbiemri", placeholder: "Mbiemri", type: "text" },
            { name: "emaili", placeholder: "Emaili", type: "email" },
            {
              name: "fjalekalimi",
              placeholder: "Fjalekalimi",
              type: "password",
            },
            {
              name: "kfjalekalimi",
              placeholder: "Konfirmo Fjalekalimin",
              type: "password",
            },
          ].map((field) => (
            <div key={field.name} className="relative my-6">
              <input
                type={field.type}
                name={field.name}
                className={`peer w-full h-16 rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0 ${
                  errors[field.name] ? "border-red-500" : ""
                }`}
                placeholder={"Shkruaj " + field.placeholder + "n"}
                value={inputs[field.name]}
                onChange={trajtoNdryshimet}
              />

              <label
                htmlFor=""
                className="absolute left-0 z-50 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
              >
                {field.placeholder}
              </label>
              {errors[field.name] && (
                <div className="text-sm text-red-500 ml-[10px] mt-1 absolute left-0">
                  {errors[field.name]}
                </div>
              )}
            </div>
          ))}
          <button
            type="submit"
            onClick={trajtoSubmit}
            className="w-full rounded-[10px] bg-[#7B8E76] p-2 text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
          >
            përditëso
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
