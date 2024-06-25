import { useContext, useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import { toast, ToastContainer } from "react-toastify";

const BookList = () => {
  const [librat, setLibrat] = useState([]);
  const location = useLocation();
  const tufaId = location.pathname.split("/")[2];
  const { currentUser, ckycu } = useContext(AuthContext);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/tufat/" + tufaId
        );
        setLibrat(res.data.librat || []);
        window.scroll(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [tufaId]);

  const handleAddToCart = async (book) => {
    try {
      await axios.post("http://localhost:8800/api/shporta", {
        currentUser,
        book,
      });
      toast.success("Libri u shtua në shportë!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error adding book to cart:", error);
      toast.error("Ka ndodhur nje gabim gjatë procesit!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#7B8E76] py-10">
      <div className="container mx-auto px-4">
        {Array.isArray(librat) && librat.length > 0 ? (
          librat.map((libri) => (
            <div
              key={libri.id}
              className="flex shadow-lg bg-[#BDC6BA] overflow-hidden mb-1 rounded-sm"
            >
              <div
                className="mt-4 mb-4 ml-4"
                style={{
                  minWidth: "8rem",
                  minHeight: "8rem",
                  maxWidth: "10rem",
                  maxHeight: "12rem",
                }}
              >
                <img
                  src={`/assets/img/bookcovers/${libri.foto}`}
                  alt={libri.emri}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex flex-col pt-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-[#817E82] font-bold text-xl">
                      {libri.emri}
                    </h2>
                    <p className="text-[#0D78B4] text-lg mb-2">
                      <span className="text-[#817E82]">nga </span>
                      {libri.autori}
                    </p>
                  </div>
                  <div className="text-[#817E82] font-bold text-xl pr-4 flex flex-col items-end h-max">
                    <div className="mb-2 text-3xl">30eur</div>
                  </div>
                </div>
                <div className="flex flex-row justify-between">
                  <p className="text-[#817E82] text-base">{libri.pershkrimi}</p>
                  <button
                    className="bg-[#7b8e76] text-white px-4 py-2 rounded-lg transition-colors duration-200 hover:bg-[#6d7b69] m-3"
                    onClick={() => handleAddToCart(libri.id)}
                  >
                    Shto në shportë
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white">No books found.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default BookList;
