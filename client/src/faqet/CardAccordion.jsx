import React, { useState } from "react";

const CardAccordion = ({ card, index, isNew, onAdd, onEdit, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    numri_karteles: card.numri_karteles || "",
    tipi_karteles: card.tipi_karteles || "",
    data_skadimit: card.data_skadimit || "",
    adresa_faturimit: card.adresa_faturimit || "",
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (isNew) {
      onAdd(inputs); // Call the add function with the new card data
    } else {
      onEdit(index, inputs); // Call the edit function with the updated card data
    }
  };

  return (
    <div className="mb-4 border border-gray-300 rounded-lg">
      <div
        onClick={handleToggle}
        className="cursor-pointer p-4 bg-gray-200 flex justify-between items-center"
      >
        <span>{isNew ? "Shto Kartelen" : `Kartela #${index + 1}`}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Numri Karteles
            </label>
            <input
              type="text"
              name="numri_karteles"
              value={inputs.numri_karteles}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Tipi Karteles
            </label>
            <input
              type="text"
              name="tipi_karteles"
              value={inputs.tipi_karteles}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Data Skadimit
            </label>
            <input
              type="date"
              name="data_skadimit"
              value={inputs.data_skadimit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Adresa Faturimit
            </label>
            <input
              type="text"
              name="adresa_faturimit"
              value={inputs.adresa_faturimit}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              {isNew ? "Shto Kartelen" : "Edito Kartelen"}
            </button>
            {!isNew && (
              <button
                onClick={() => onDelete(index)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                Shlyej Kartelen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CardAccordion;
