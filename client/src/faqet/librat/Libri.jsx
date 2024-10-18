import { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../context/authContext";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";

const Libri = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [libri, setLibrin] = useState({});
  const location = useLocation();
  const libriId = location.pathname.split("/")[2];
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:8800/api/librat/" + libriId
        );
        setLibrin(res.data);
        window.scroll(0, 0);
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
      toast.error("Ka ndodhur nje gabim gjatë procesit!", {
        position: "top-right",
      });
    }
  };

  return (
    <div className="font-sans bg-[#7b8e76] min-h-screen flex flex-col">
      <div className="container mx-auto p-4 flex-grow">
        <div className="flex flex-col md:flex-row items-start">
          <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-4">
            <img
              className="w-32 md:w-48"
              src={`/assets/img/bookcovers/${libri.foto}`}
              alt={libri.titulli || "Libri pa titull"}
            />
          </div>
          <div className="bg-[#bcc5b8] px-6 py-3 rounded-lg shadow-lg flex-grow min-h-full">
            <h1 className="text-[#848a81] text-2xl md:text-3xl font-bold mb-2">
              {libri.titulli}
            </h1>
            <h2 className="text-lg md:text-xl text-[#848a81] mb-4">
              nga {libri.autori}
            </h2>
            <div className="flex space-x-4 mb-6">
              <button
                className="bg-[#7b8e76] text-white px-4 py-2 rounded-lg flex items-center justify-center transition-colors duration-200 hover:bg-[#6d7b69]"
                onClick={addToCart}
              >
                <img
                  src="https://res.cloudinary.com/dhjdnejbo/image/upload/v1716846152/solar_bag-bold_2_nwtgvx.svg"
                  alt="Add to Cart"
                  className="h-5 w-5 mr-2"
                />
                Shto në shportë
              </button>
            </div>
            <h2 className="text-2xl font-semibold mb-2 text-[#848a81]">
              Pershkrimi:
            </h2>
            <p className="text-[#848a81] mb-6">{libri.pershkrimi}</p>
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
                  <li>{libri.cmimi ? `${libri.cmimi}€` : "N/A"}</li>
                  <li>{libri.botuesi || "N/A"}</li>
                  <li>{libri.data_botimit || "N/A"}</li>
                  <li>{libri.nr_faqeve || "N/A"}</li>
                  <li>{libri.dimensionet || "N/A"}</li>
                  <li>{libri.gjuha || "N/A"}</li>
                  <li>{libri.lloji || "N/A"}</li>
                  <li>{libri.ean_upc || "N/A"}</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Libri;
