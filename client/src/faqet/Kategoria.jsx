import  {useContext, useState, useEffect } from "react";
import {useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/authContext";
import {ToastContainer } from "react-toastify";
import Select from 'react-select';

const Kategoria = () => {
  const [librat, setLibrat] = useState([]);
  const [filteredLibrat, setFilteredLibrat] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(8);
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const libratResponse = await axios.get("http://localhost:8800/api/librat");
        setLibrat(libratResponse.data || []);
        setFilteredLibrat(libratResponse.data || []);

        const categoriesResponse = await axios.get("http://localhost:8800/api/kategorite");
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const selectedCategory = params.get('kategoria');
    if (selectedCategory) {
      setSelectedCategories([{ value: selectedCategory, label: selectedCategory }]);
    }
  }, [location]);

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredLibrat(librat);
    } else {
      setFilteredLibrat(
        librat.filter((libri) =>
          selectedCategories.some((category) => category.value === libri.emri_kategorise)
        )
      );
    }
  }, [selectedCategories, librat]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredLibrat.slice(indexOfFirstBook, indexOfLastBook);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCategoryChange = (selectedOptions) => {
    setSelectedCategories(selectedOptions || []);
  };

  const options = categories
    .map((category) => ({
      value: category.emri,
      label: category.emri,
    }))
    .filter((option) => !selectedCategories.some((category) => category.value === option.value));

  return (
    <div className="min-h-screen flex flex-col justify-center bg-[#7B8E76] p-2">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          <h1 className="text-white text-2xl mb-4 lg:mb-0 mt-0">
            {selectedCategories.length > 0
              ? `Kategoriat: ${selectedCategories.map(cat => cat.label).join(', ')}`
              : "Të gjitha kategoritë"}
          </h1>
          <div className="mb-4 lg:mb-0 lg:ml-auto w-full lg:w-auto">
            <Select
              options={options}
              onChange={handleCategoryChange}
              placeholder="Zgjedh kategoritë"
              isMulti
              className="w-full lg:w-64 z-30"
            />
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 min-w-[300px] lg:grid-cols-4 md:grid-cols-2 gap-4 lg:gap-4 md:gap-4">
          {currentBooks.map((libri, index) => (
            <div
              key={index}
              className="m-2 group p-5 bg-white/10 rounded-lg flex flex-col items-center justify-center gap-2 relative after:absolute after:h-full after:bg-[#7B8E76] z-20 shadow-lg after:-z-20 after:w-full after:inset-0 after:rounded-lg transition-all duration-300 hover:transition-all hover:duration-300 after:transition-all after:duration-500 after:hover:transition-all after:hover:duration-500 overflow-hidden cursor-pointer after:-translate-y-full after:hover:translate-y-0 [&amp;_p]:delay-200 [&amp;_p]:transition-all"
            >
              <img
                className="w-40 h-40 object-contain rounded-md min-h-40 min-w-40"
                src={`/assets/img/bookcovers/${libri.foto}`}
                alt={libri.emri}
              />
              <p className="cardtxt font-semibold justify-center text-[#817E82] tracking-wider group-hover:text-gray-700 text-sm h-16 w-auto overflow-hidden">
                {libri.emri}
              </p>
              <div className="ordernow flex flex-row justify-center items-center w-full">
                <p
                  className="btun4 lg:inline-flex items-center gap-3 group-hover:bg-white/10 bg-[#BDC6BA] shadow-[10px_10px_150px_#ff9f0d] cursor-pointer py-2 px-4 text-sm font-semibold rounded-full butn"
                  onClick={() => navigate(`/libri/${libri.id}`)}
                  >
                    Detajet
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 mb-2 flex justify-center">
          {currentPage > 1 && (
            <button
              className="px-3 py-1 bg-[#BDC6BA] text-white rounded-md mr-2"
              onClick={() => paginate(currentPage - 1)}
            >
              Prapa
            </button>
          )}
          {filteredLibrat.length > booksPerPage && currentBooks.length === booksPerPage && (
            <button
              className="px-3 py-1 bg-[#BDC6BA] text-white rounded-md"
              onClick={() => paginate(currentPage + 1)}
            >
              Tjetra
            </button>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Kategoria;
