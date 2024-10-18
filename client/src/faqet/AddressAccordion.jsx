import React, { useState } from "react";
const AddressAccordion = ({
  address,
  index,
  isNew,
  onAdd,
  onEdit,
  onDelete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputs, setInputs] = useState({
    shteti: address.shteti || "",
    qyteti: address.qyteti || "",
    adresa: address.adresa || "",
    kodi_postar: address.kodi_postar || "",
    telefoni: address.telefoni || "",
  });

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (isNew) {
      onAdd(inputs); // Call the add function with the new address data
    } else {
      onEdit(index, inputs); // Call the edit function with the updated address data
    }
  };

  return (
    <div className="mb-4 border border-gray-300 rounded-lg">
      <div
        onClick={handleToggle}
        className="cursor-pointer p-4 bg-gray-200 flex justify-between items-center"
      >
        <span>{isNew ? "Shto Adresen" : `Adresa #${index + 1}`}</span>
        <span>{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <div className="p-4 bg-white">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Shteti
            </label>
            <input
              type="text"
              name="shteti"
              value={inputs.shteti}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Qyteti
            </label>
            <input
              type="text"
              name="qyteti"
              value={inputs.qyteti}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Adresa
            </label>
            <input
              type="text"
              name="adresa"
              value={inputs.adresa}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Kodi Postar
            </label>
            <input
              type="text"
              name="kodi_postar"
              value={inputs.kodi_postar}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Telefoni
            </label>
            <input
              type="text"
              name="telefoni"
              value={inputs.telefoni}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg p-2"
            />
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-blue-500 text-white p-2 rounded-lg"
            >
              {isNew ? "Shto Adresen" : "Edito Adresen"}
            </button>
            {!isNew && (
              <button
                onClick={() => onDelete(index)}
                className="bg-red-500 text-white p-2 rounded-lg"
              >
                Shlyej Adresen
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddressAccordion;
