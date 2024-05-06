
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

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:8800/api/librat", inputs);
      navigate("/");
    } catch (err) {
      // setError(err.response.data);
    }
  };

  const shlyejLibrin = async (e) => {
    try {
      await axios.delete("http://localhost:8800/api/librat/" + libriId);
      navigate("/");
    } catch (error) {
      
    }
  }

  const [libri, setLibrin] = useState({});

  const location = useLocation();

  const libriId = location.pathname.split("/")[2];
  
  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8800/api/librat/" + libriId);
      try {
        setLibrin(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [libriId]);

  return (
    <div className="flex flex-col gap-3">
      <input
        onChange={trajtoNdryshimet}
        name="emri"
        className="border-2 border-black"
        type="text"
        placeholder="Emri"
        value={libri.emri}
      />
      <input
        onChange={trajtoNdryshimet}
        name="isbn"
        className="border-2 border-black"
        type="text"
        placeholder="ISBN"
        value={libri.isbn}
      />
      <textarea
        onChange={trajtoNdryshimet}
        name="pershkrimi"
        className="border-2 border-black"
        id=""
        cols="30"
        rows="10"
        placeholder="Pershkrimi"
        value={libri.pershkrimi}
      ></textarea>
      <button
        onClick={trajtoSubmit}
        className="border-2 border-black bg-blue-300"
      >
        Perditeso Librin
      </button>
      <button
        onClick={shlyejLibrin}
        className="border-2 text-center border-black bg-red-300"
      >
        Shlyej Librin
      </button>
    </div>
  );
};

export default Libri;
