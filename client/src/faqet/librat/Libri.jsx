import { useContext, useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { toast, ToastContainer } from "react-toastify";

const Libri = () => {
  const { currentUser } = useContext(AuthContext);
  const [libri, setLibrin] = useState({});
  const location = useLocation();
  const libriId = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/librat/" + libriId
        );
        setLibrin(res.data);
        window.scrollTo(0, 0);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [libriId]);

  const addToCart = async () => {
    try {
      await axios.post("http://localhost:8800/api/shporta", {
        currentUser,
        libriId,
      });
      toast.success("Libri u shtua në shportë!", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error adding book to cart:", error);
      toast.error("Ka ndodhur një gabim gjatë procesit!", {
        position: "top-right",
      });
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const row = porosite.find((porosi) => porosi.id === id);
    if (row.payment_status === parseInt(newStatus, 10)) {
      console.log("No status change detected. Skipping update.");
      toast.info("Statusi është i pandryshuar.");
      return;
    }
  
    try {
      const res = await axios.put("http://localhost:8800/api/porosite/status", {
        id,
        payment_status: parseInt(newStatus, 10),
      });
  
      console.log("API Response:", res.data);
  
      toast.success(res.data.message);
  
      fetchData();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Gabim në ndryshimin e statusit.");
    }
  };
  

  return (
    <div className="font-sans bg-[#7b8e76] min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-6 flex-grow">
        <div className="bg-[#bcc5b8] p-6 rounded-lg shadow-lg flex flex-col md:flex-row md:items-start gap-6">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <img
              className="w-32 md:w-48"
              src={`/assets/img/bookcovers/${libri.foto}`}
              alt={libri.titulli || "Libri pa titull"}
            />
          </div>
          <div className="flex-grow px-4 md:px-6 flex flex-col">
            <h1
              className="text-[#848a81] font-extrabold mb-4"
              style={{ fontSize: "2rem" }}
            >
              {libri.titulli}
            </h1>
            <h2 className="text-lg text-[#848a81] mb-4">
              nga{" "}
              <Link to={`/listaLibrave?autori=${libri.autori}`}>
                <span className="underline decoration-dotted">
                  {libri.autori}
                </span>
              </Link>
            </h2>
            <h3 className="text-[#848a81] text-2xl font-bold mb-4">
              {libri.cmimi}€
            </h3>
            <hr className="border-[#848a81] mb-4" />
            <h2 className="text-[#848a81] text-xl font-semibold mb-2">
              Përshkrimi
            </h2>
            <p className="text-[#848a81] text-lg mb-4">{libri.pershkrimi}</p>
            <div className="mt-8 mb-6">
              <h2 className="text-[#848a81] text-xl font-semibold mb-4">
                Detajet e produktit:
              </h2>
              <ul className="text-[#848a81] text-lg space-y-2">
                <li>
                  <span className="font-semibold">Botuesi:</span>{" "}
                  {libri.botuesi || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Data e botimit:</span>{" "}
                  {libri.data_botimit || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Gjuha:</span>{" "}
                  {libri.gjuha || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">Lloji:</span>{" "}
                  {libri.lloji || "N/A"}
                </li>
                <li>
                  <span className="font-semibold">EAN/UPC:</span>{" "}
                  {libri.ean_upc || "N/A"}
                </li>
              </ul>
            </div>
            <div
              style={{
                marginTop: "1rem",
                width: "fit-content",
                alignSelf: "start",
              }}
            >
              <button
                className="bg-[#7b8e76] text-white px-6 py-2 text-lg rounded-lg transition-colors duration-200 hover:bg-[#6d7b69]"
                onClick={addToCart}
              >
                Shto në shportë
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Libri;
