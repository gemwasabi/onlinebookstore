import React, { useState } from "react";

const Accordion = ({ title, answer }) => {
  const [accordionOpen, setAccordionOpen] = useState(false);

  return (
    <div className="bg-[#A7B1A4] rounded-lg shadow-lg mb-4">
      <button
        onClick={() => setAccordionOpen(!accordionOpen)}
        className="accordion-button w-full text-left p-4 font-semibold text-lg focus:outline-none flex justify-between"
      >
        <span className="text-[#5a6856]">{title}</span>
        <svg
          className="fill-gray-600 shrink-0 ml-8"
          width="16"
          height="16"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center transition duration-200 ease-out ${
              accordionOpen ? "rotate-90" : ""
            }`}
          />
          <rect
            y="7"
            width="16"
            height="2"
            rx="1"
            className={`transform origin-center rotate-90 transition duration-200 ease-out ${
              accordionOpen ? "rotate-90" : ""
            }`}
          />
        </svg>
      </button>
      <div
        className={`accordion-content p-4 text-gray-700 ${
          accordionOpen ? "block" : "hidden"
        }`}
      >
        {answer}
      </div>
    </div>
  );
};

export default Accordion;
