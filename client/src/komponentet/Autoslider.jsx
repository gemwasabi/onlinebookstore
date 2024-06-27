import React from "react";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const Autoslider = ({ sliderImages }) => {
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

  if (sliderImages.length === 1) {
    return (
      <div className="w-full min-h-[600px] h-[600px]">
        <img
          src={sliderImages[0]}
          alt="Single Slide"
          className="w-full h-full object-cover filter grayscale"
        />
      </div>
    );
  }

  return (
    <div className="w-full">
      <Slider {...settings}>
        {sliderImages.map((image, index) => (
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
