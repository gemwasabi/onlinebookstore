import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import cover from "../assets/img/bookcover.jpg";

const Ballina = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [librat, setLibrat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/librat");
        if (Array.isArray(res.data)) {
          setLibrat(res.data);
        } else {
          setLibrat([]);
        }
      } catch (error) {
        setError(error);
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <div className="w-screen bg-[#BDC6BA] min-h-screen p-5">Duke u shfaqur...</div>;
  }

  if (error) {
    return <div className="w-screen bg-[#d6a3a3] min-h-screen p-5">Ndodhi nje error duke shfaqur librat: {error.message}</div>;
  }

  return (
    <div className="w-screen bg-[#BDC6BA] min-h-screen p-5">
      {currentUser && <span>Hej {currentUser.id}</span>}
      <br />
      {currentUser ? (
        <span onClick={ckycu} className="cursor-pointer">Ckycu</span>
      ) : (
        <Link to="/kycu">Kycu</Link>
      )}
      {currentUser && (
        <Link to="shtoLiber" className="p-2 bg-[#7B8E76] block w-28 mt-2">
          + Shto Liber
        </Link>
      )}
      <div className="grid grid-cols-5 gap-4 mt-4">
        {librat.map((libri) => (
          <Link key={libri.id} to={`/libri/${libri.id}`}>
            <div className="bg-[#7B8E76] rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-2xl">
              <div className="relative h-48">
                <img src={cover} alt="Book cover" className="h-full w-full object-cover" />
              </div>
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
