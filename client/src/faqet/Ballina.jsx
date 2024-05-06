import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import cover from "../assets/img/bookcover.jpg";
const Ballina = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [librat, setLibrat] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:8800/api/librat");
      try {
        setLibrat(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-screen bg-[#BDC6BA] min-h-screen p-5">
      {currentUser ? <span>Hej {currentUser?.id}</span> : ""}
      <br />
      {currentUser ? (
        <span onClick={ckycu}>Ckycu</span>
      ) : (
        <Link to="/kycu">Kycu</Link>
      )}

      {currentUser ? (
        <Link to="shtoLiber" className="p-2 bg-[#7B8E76] block w-28">
          {" "}
          + Shto Liber
        </Link>
      ) : (
        ""
      )}

      <div className="grid grid-cols-5 gap-4 mt-1">
        {librat.map((libri) => (
          <Link to={'/libri/'+libri.id}>
            <div className="bg-[#7B8E76] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-2xl">
              <div className="relative h-48"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{libri.emri}</h3>
                <p className="text-gray-700">Cmimi: $10</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Ballina;
