import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

import sliderpic1 from "../assets/img/slider/cover.webp"; // Replace with your image paths
import sliderpic2 from "../assets/img/slider/cover-2.png";
import sliderpic3 from "../assets/img/slider/cover-3.png";

const Autoslider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
  };

  const images = [sliderpic1, sliderpic2, sliderpic3]; // Add as many images as you need

  return (
    <div className="w-full">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div key={index} className="w-full min-h-[600px] h-[600px]">
            <img
              src={image}
              alt={`Slide ${index}`}
              className="w-full h-full object-cover filter grayscale"
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Autoslider;
