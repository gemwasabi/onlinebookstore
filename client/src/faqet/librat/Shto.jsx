import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"

const Krijo = () => {

  const [inputs, setInputs] = useState({
    emri: "",
    isbn: "",
    pershkrimi: ""
  });

  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8800/api/librat/shto", inputs);
      navigate("/");
    } catch (err) {
      // setError(err.response.data);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <input onChange={trajtoNdryshimet} name="emri" className="border-2 border-black" type="text" placeholder="Emri" />
      <input onChange={trajtoNdryshimet} name="isbn" className="border-2 border-black" type="text" placeholder="ISBN" />
      <textarea onChange={trajtoNdryshimet} name="pershkrimi" className="border-2 border-black" id="" cols="30" rows="10" placeholder="Pershkrimi"></textarea>
      <button onClick={trajtoSubmit} className="border-2 border-black bg-slate-400">Shto Librin</button>
    </div>
  );
};

export default Krijo;
