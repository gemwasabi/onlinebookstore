import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const Libri = () => {
  const [inputs, setInputs] = useState({
    emri: "",
    isbn: "",
    pershkrimi: "",
  });

  const navigate = useNavigate();

  const [libri, setLibrin] = useState({});

  const location = useLocation();

  const libriId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/librat/" + libriId
      );
      try {
        setLibrin(res.data);
        window.scroll(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [libriId]);

  return (
    <div className="font-sans bg-[#7b8e76] min-h-screen">
      <div className="container mx-auto p-4">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <img
              className="w-32 md:w-48"
              src={`/assets/img/bookcovers/${libri.foto}`}
              alt="The Tenant of Wildfell Hall by Anne Brontë"
            />
          </div>
          <div className="bg-[#bcc5b8] p-6 rounded-lg shadow-lg flex-grow">
            <h1 className="text-[#848a81] text-2xl md:text-3xl font-bold mb-2">
              {libri.emri}
            </h1>
            <h2 className="text-lg md:text-xl text-[#848a81] mb-4">
              nga {libri.autori}
            </h2>
            <div className="mb-4">
              <label htmlFor="format" className="block text-[#848a81]">
                Formati
              </label>
              <select
                id="format"
                className="h-10 w-full text-[#848a81] rounded-lg border-2 border-[#848a81] bg-transparent px-4 text-lg focus:border-[#848a81] focus:outline-none"
              >
                <option>Zgjidh llojin</option>
                <option>Paperback</option>
                <option>Hardcover</option>
              </select>
            </div>
            <div className="flex space-x-4 mb-6">
              <button className="bg-[#7b8e76] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-[#6d7b69]">
                <img
                  src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1716846152/solar_bag-bold_2_nwtgvx.svg"
                  alt="Add to Cart"
                  className="h-5 w-5 mr-2"
                />
                Shto në shportë
              </button>
              <button className="bg-[#7b8e76] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-[#6d7b69]">
                <img
                  src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1716846152/Vector_jca2na.svg"
                  alt="Rent"
                  className="h-5 w-5 mr-2"
                />
                Merr me qera
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#848a81]">
              Pershkrimi:
            </h2>
            <p className="text-[#848a81] mb-6">
              {libri.pershkrimi}
            </p>
            <div>
              <h2 className="text-[#848a81] text-2xl font-semibold mb-2">
                Detajet e produktit:
              </h2>
              <div className="flex space-x-2">
                <ul className="text-[#848a81] text-right">
                  <li>Çmimi:</li>
                  <li>Botuesi:</li>
                  <li>Data e botimit:</li>
                  <li>Nr. i faqeve:</li>
                  <li>Dimensionet:</li>
                  <li>Gjuha:</li>
                  <li>Lloji:</li>
                  <li>EAN/UPC:</li>
                </ul>
                <ul className="text-[#848a81] text-left">
                  <li>15.00€</li>
                  <li>Penguin</li>
                  <li>2015</li>
                  <li>386</li>
                  <li>12.7cm x 20.3cm</li>
                  <li>Anglisht</li>
                  <li>Paperback</li>
                  <li>1111111111111</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Libri;
