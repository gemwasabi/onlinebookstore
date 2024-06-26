import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import CategoryLinks from "../faqet/KategoriLink";
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
  const [tufat, setTufat] = useState([]);
  const [slider, setSlider] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resTufat = await axios.get(
          "http://localhost:8800/api/tufat/tufatMeLibra"
        );
        const resSlider = await axios.get("http://localhost:8800/api/slider");

        if (Array.isArray(resTufat.data)) {
          setTufat(resTufat.data);
        } else {
          setTufat([]);
        }

        if (Array.isArray(resSlider.data)) {
          setSlider(resSlider.data.map(slide => `/assets/img/slider/${slide.foto}`));
        } else {
          setSlider([]);
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
    return (
      <div className="w-screen bg-[#BDC6BA] min-h-screen p-5">
        Duke u shfaqur...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-screen bg-[#d6a3a3] min-h-screen p-5">
        Ndodhi nje error duke shfaqur librat: {error.message}
      </div>
    );
  }

  const books_two = [
    {
      title: "Another Last Call: Poems on Addiction and Deliverance",
      author: "Kathy Acker & Paul Zelevansky",
      price: "$20.41",
      originalPrice: "24.95",
      imgSrc: cover,
    },
    {
      title: "Drunk Mom: A Memoir",
      author: "Jowita Bydlowska",
      price: "16.74",
      originalPrice: "18.00",
      imgSrc: cover,
    },
    // ... other books
  ];

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <img src={chevronRight} alt="Next" className="w-8 h-8" />,
    prevArrow: <img src={chevronLeft} alt="Previous" className="w-8 h-8" />,
  };

  return (
    <>
    <CategoryLinks />
      <Autoslider sliderImages={slider} />

      <div className="bg-[#7B8E76] py-9">
        {tufat.map((tufa, index) => (
          <div
            className="w-full mx-auto lg:container p-10 bg-[#BDC6BA] rounded-2xl shadow sm:rounded-none my-5"
            key={index}
          >
            <div className="flex flex-col md:flex-row justify-between mb-4">
              <h2 className="text-xl md:text-2xl font-bold text-[#282c26]">
                {tufa.emri}
              </h2>
              <Link
                className="text-purple-700 text-lg"
                to={"/pamjaTufes/" + tufa.id}
              >
                Shfaq të gjitha ({tufa.librat.length})
              </Link>
            </div>
            <div className="relative">
              <Slider {...settings}>
                {tufa.librat.map((libri, index) => (
                  <div key={index} className="p-2">
                    <Link to={`/libri/${libri.id}`}>
                      <img
                        className="h-64 w-44 object-cover mx-auto"
                        src={`/assets/img/bookcovers/${libri.foto}`}
                        alt={libri.title}
                      />
                    </Link>
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        ))}
        <div className="w-full mx-auto lg:container p-5 bg-[#BDC6BA] my-10">
          <div className="mb-8 flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[#817E82]">
              Recovery: A Journey Toward Wholeness & Balance
            </h1>
            <a href="#" className="text-[#0D78B4] font-semibold">
              View all (95)
            </a>
          </div>

          <div className="grid grid-cols-1 min-w-[300px] lg:grid-cols-4 md:grid-cols-2 gap-4 lg:gap-4 md:gap-4">
            {books_two.map((book, index) => (
              <div
                key={index}
                className="m-2 group p-5 bg-white/10 rounded-lg flex flex-col items-center justify-center gap-2 relative after:absolute after:h-full after:bg-[#7B8E76] z-20 shadow-lg after:-z-20 after:w-full after:inset-0 after:rounded-lg transition-all duration-300 hover:transition-all hover:duration-300 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden cursor-pointer after:-translate-y-full after:hover:translate-y-0 [&amp;_p]:delay-200 [&amp;_p]:transition-all"
              >
                <img
                  className="w-40 h-40 object-contain rounded-md min-h-40 min-w-40"
                  src={book.imgSrc}
                  alt={book.title}
                />
                <p className="cardtxt font-semibold justify-center text-[#817E82] tracking-wider group-hover:text-gray-700 text-sm h-16 w-auto overflow-hidden">
                  {book.title}
                </p>
                <p className="text-[#5e5d5f] text-xs line-through">
                  ${book.originalPrice}
                </p>
                <p className="blueberry font-semibold text-gray-600 text-xs">
                  Çmimi i zbritur: ${book.price}
                </p>
                <div className="ordernow flex flex-row justify-center items-center w-full">
                  <p className="btun4 lg:inline-flex items-center gap-3 group-hover:bg-white/10 bg-[#BDC6BA] shadow-[10px_10px_150px_#ff9f0d] cursor-pointer py-2 px-4 text-sm font-semibold rounded-full butn">
                    Bleje tani
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Ballina;
