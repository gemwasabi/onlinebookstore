import React from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

const UserSettings = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const { currentUserData, setCurrentUserData } = useState([]);
  const [inputs, setInputs] = useState({
    emri: currentUser ? currentUser.emri : "",
    mbiemri: currentUser ? currentUser.mbiemri : "",
    numri_telefonit: "",
    emaili: currentUser ? currentUser.emaili : "",
    emri_ne_kartele: "",
    numri_karteles: "",
    data_skadimit: "",
    cvv: "",
    adresa_1: "",
    adresa_2: "",
    qyteti: "",
    kodi_postar: "",
    koment: "",
    perdoruesi_id: currentUser ? currentUser.id : "",
  });

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8800/api/perdoruesit/" + currentUser.id
      );

      if (Array.isArray(response.data)) {
        setCurrentUserData(response.data);
      } else {
        // setCurrentUserData([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
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
    <div className="w-full h-full bg-[#8E9A83] shadow-lg rounded-lg flex flex-col lg:flex-row">
      <div className="w-full lg:w-1/4 lg:max-w-96 bg-[#60725c] p-4 text-[#c3c9be] h-full">
        <h2 className="text-xl lg:text-2xl text-left font-bold mb-4 lg:mb-10 text-[#c3c9be]">
          Settings
        </h2>
        <button className="block w-full text-left px-3 py-2 mb-2 lg:mb-4 bg-[#8E9A83] transition-colors rounded">
          Përdoruesi
        </button>
        <Link to={"/sfondi/adresa"}>
          <button className="block w-full text-left px-3 py-2 mb-2 lg:mb-4 hover:bg-[#8E9A83] transition-colors rounded">
            Adresat
          </button>
        </Link>
        <button className="block w-full text-left px-3 py-2 mb-2 lg:mb-4 hover:bg-[#8E9A83] transition-colors rounded">
          Kartela bankare
        </button>
        <button
          type="button"
          className="block w-full text-left px-3 py-2 mb-2 lg:mb-4 hover:bg-red-400 text-red-300 hover:text-white transition-colors rounded-lg"
        >
          Fshij Profilin
        </button>
      </div>

      <div className="w-full p-4 lg:p-10 bg-[#7b8f76] h-full">
        <h3 className="text-2xl font-bold text-center mb-4 lg:mb-8"></h3>
        <form>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 px-2">
            <div className="col-span-1 lg:col-span-2">
              <h3 className="text-xl font-bold text-[#c3c9be] mb-4">
                Detajet e llogarisë
              </h3>
            </div>
            <div>
              <label
                htmlFor="first_name"
                className="block mb-2 text-sm font-medium text-[#5a6856]"
              >
                Emri
              </label>
              <input
                type="text"
                id="first_name"
                name="emri"
                onChange={trajtoNdryshimet}
                value={inputs.emri}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="Filane Fisteku"
                required
              />
            </div>
            <div>
              <label className="block mb-2 text-sm font-medium text-[#5a6856]">
                Mbiemri
              </label>
              <input
                type="text"
                name="mbiemri"
                onChange={trajtoNdryshimet}
                value={inputs.mbiemri}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="Filane Fisteku"
                required
              />
            </div>
            <div>
              <label
                htmlFor="last_name"
                className="block mb-2 text-sm font-medium text-[#5a6856]"
              >
                Nr. i tel
              </label>
              <input
                type="text"
                id="last_name"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="+383"
                required
              />
            </div>
            <div>
              <label
                htmlFor="company"
                className="block mb-2 text-sm font-medium text-[#5a6856]"
              >
                E-mail adresa
              </label>
              <input
                type="text"
                id="company"
                value={inputs.emaili}
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="example@example.com"
                required
              />
            </div>
            <div>
              <label
                htmlFor="phone"
                className="block mb-2 text-sm font-medium text-[#5a6856]"
              >
                Fjalekalimi
              </label>
              <input
                type="tel"
                id="phone"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="********"
                pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}"
                required
              />
            </div>
            <div>
              <label
                htmlFor="website"
                className="block mb-2 text-sm font-medium text-[#5a6856]"
              >
                Nr.personal
              </label>
              <input
                type="url"
                id="website"
                className="bg-gray-50 border border-gray-300 text-sm rounded-lg block w-full p-2.5 text-gray-900"
                placeholder="00000000"
                required
              />
            </div>
          </div>
          <div className="flex justify-center space-x-4 mt-6">
            <button
              type="button"
              className="text-white bg-[#60725c] hover:bg-gray-400 focus:ring-4 focus:outline-none focus:ring-[#4e5e4b] font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center"
            >
              Edito Profilin
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserSettings;
