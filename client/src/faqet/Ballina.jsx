import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import Slider from "react-slick";
import cover from "../assets/img/bookcover.jpg";
import chevronLeft from "../assets/img/chevron-left.png";
import chevronRight from "../assets/img/chevron-right.png";
import Autoslider from "../komponentet/Autoslider";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Ballina = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [kategorite, setKategorite] = useState([]);
  const [tufat, setTufat] = useState([]);
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resCategories = await axios.get(
          "http://localhost:8800/api/kategorite/random"
        );
        setKategorite(resCategories.data || []);

        const resTufat = await axios.get(
          "http://localhost:8800/api/tufat/random",
          {
            params: { limit: 3 },
          }
        );
        setTufat(resTufat.data || []);

        const resSlider = await axios.get("http://localhost:8800/api/slider");
        setSlider(
          Array.isArray(resSlider.data)
            ? resSlider.data.map((slide) => `/assets/img/slider/${slide.foto}`)
            : []
        );
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="w-screen bg-[#BDC6BA] min-h-screen p-5">
        Duke u shfaqur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen bg-[#d6a3a3] min-h-screen p-5">
        Ndodhi një error duke shfaqur të dhënat: {error.message}
      </div>
    );
  }

  // Merge tufat and kategorite in alternating order
  const combinedContent = [];
  let tufatIndex = 0;

  kategorite.forEach((kategori, index) => {
    if (index % 2 === 0 && tufatIndex < tufat.length) {
      combinedContent.push({ type: "tufa", data: tufat[tufatIndex] });
      tufatIndex++;
    }
    combinedContent.push({ type: "kategori", data: kategori });
  });

  if (tufatIndex < tufat.length) {
    combinedContent.push(
      ...tufat.slice(tufatIndex).map((tufa) => ({ type: "tufa", data: tufa }))
    );
  }

  const settings = (bookCount) => ({
    infinite: bookCount > 1,
    speed: 500,
    slidesToShow: bookCount > 5 ? 5 : bookCount,
    slidesToScroll: 1,
    autoplay: bookCount > 1,
    autoplaySpeed: 2000,
    nextArrow: <img src={chevronRight} alt="Next" className="w-8 h-8" />,
    prevArrow: <img src={chevronLeft} alt="Previous" className="w-8 h-8" />,
  });

  return (
    <>
      <Autoslider sliderImages={slider} />

      <div className="py-9">
        {combinedContent.map((content, index) =>
          content.type === "tufa" ? (
            <div
              key={`tufa-${index}`}
              className="w-full mx-auto lg:container my-5 shadow-lg"
            >
              <Link to={`/listaLibrave?tufa=${content.data.id}`}>
              <img
                src={`/assets/img/tufat/${content.data.foto}`}
                alt={content.data.emri}
                className="w-full h-auto object-cover rounded-md"
              />
              </Link>
            </div>
          ) : (
            <div
              key={`kategori-${index}`}
              className="w-full mx-auto lg:container py-4 px-5 bg-[#BDC6BA] shadow-lg my-5 border-3"
            >
              <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-[#817E82]">
                  {content.data.emri}
                </h1>
                <Link
                  className="text-[#817E82] text-lg underline"
                  to={"/listaLibrave?kategoria=" + content.data.id}
                >
                  Shfaq të gjitha ({content.data.librat.length})
                </Link>
              </div>
              <div className="relative">
                <Slider {...settings(content.data.librat.length)}>
                  {content.data.librat.map((libri, index) => (
                    <div key={index} className="p-2 relative group">
                      <Link
                        to={`/libri/${libri.id}`}
                        className="block relative"
                      >
                        <div className="relative">
                          <img
                            className="h-64 w-44 object-cover mx-auto rounded-md shadow-lg"
                            src={`/assets/img/bookcovers/${libri.foto}`}
                            alt={libri.titulli}
                          />
                        </div>
                      </Link>
                      <div className="text-center mt-2">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          {libri.titulli.length > 20
                            ? `${libri.titulli.slice(0, 20)}...`
                            : libri.titulli}
                        </p>
                        <Link to={"/listaLibrave?autori=" + libri.autori}>
                          <p className="text-xs text-gray-600">
                            {libri.autori}
                          </p>
                        </Link>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            </div>
          )
        )}
      </div>
    </>
  );
};

export default Ballina;
