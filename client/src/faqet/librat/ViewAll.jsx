import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { Link } from "react-router-dom";

const ViewAll = () => {
  const [books, setBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 100]);
  const [filters, setFilters] = useState({
    category: [],
    author: [],
    year: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [currentPage, setCurrentPage] = useState(1); // Current page state
  const [totalPages, setTotalPages] = useState(1); // Total pages state
  const [booksPerPage] = useState(20); // Number of books per page

  const fetchBooks = (currentFilters) => {
    setBooks([]);
    console.log(priceRange);
    axios
      .get("http://localhost:8800/api/librat", {
        params: {
          page: currentPage,
          limit: booksPerPage,
          category: currentFilters.category.join(","),
          author: currentFilters.author.join(","),
          year: currentFilters.year,
          priceMin: priceRange[0],
          priceMax: priceRange[1],
        },
      })
      .then((response) => {
        setBooks(response.data.books); // Update books state
        setTotalPages(response.data.totalPages); // Update totalPages state
      })
      .catch((error) => {
        console.error("Error fetching books:", error);
      });
  };

  // Fetch books and filter data (categories, authors) on initial load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get("kategoria");
    const author = params.get("autori");

    if (category) {
      filters.category = category.split(",").map(Number); // Assume `category` is a comma-separated list of IDs
    }

    if (author) {
      filters.author = author.split(","); // Assume `author` is a comma-separated list of names
    }

    // Fetch categories
    axios
      .get("http://localhost:8800/api/kategorite")
      .then((response) => setCategories(response.data))
      .catch((error) => console.error("Error fetching categories:", error));

    // Fetch authors
    axios
      .get("http://localhost:8800/api/librat/merrAutoret")
      .then((response) => {
        setAuthors(response.data.authors || []);
      })
      .catch((error) => console.error("Error fetching authors:", error));

    // Fetch books initially
    fetchBooks(filters);
  }, []); // Empty dependency array means this will only run once on component mount

  const handleFilterChange = (selectedOptions, name) => {
    const newFilters = {
      ...filters,
      [name]: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    };
    setFilters(newFilters);

    // Reset current page when filters change
    setCurrentPage(1); // or set it to whatever page you want to start from
    fetchBooks(newFilters);
  };

  useEffect(() => {
    // Fetch books whenever filters change or page change
    fetchBooks(filters);
  }, [filters, currentPage, priceRange]); // Fetch books when filters or current page change

  return (
    <div className="min-h-screen">
      {/* Mobile filter toggle button */}
      <button
        onClick={() => setShowFilters(!showFilters)}
        className="lg:hidden p-4 bg-blue-500 text-white w-full text-center"
      >
        {showFilters ? "Hide Filters" : "Show Filters"}
      </button>

      <div className="flex flex-col lg:flex-row lg:min-h-screen">
        {/* Left Side: Filters */}
        <div
          className={`lg:w-1/4 p-4 bg-[#7B8E76] ${
            showFilters ? "block" : "hidden lg:block"
          }`}
        >
          <h2 className="text-3xl font-bold text-[#c3c9be] mb-4">Filterat</h2>

          {/* Category Filter */}
          <div className="mb-4">
            <label htmlFor="category" className="block text-lg text-white">
              Kategoritë
            </label>
            <Select
              isMulti
              id="category"
              name="category"
              options={categories.map((category) => ({
                value: category.id,
                label: category.emri,
              }))}
              value={categories
                .filter((category) => filters.category.includes(category.id)) // Match selected IDs with the categories
                .map((category) => ({
                  value: category.id,
                  label: category.emri,
                }))}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "category")
              }
              className="w-full"
            />
          </div>

          {/* Author Filter */}
          <div className="mb-4">
            <label htmlFor="author" className="block text-lg text-white">
              Autori
            </label>
            <Select
              isMulti
              id="author"
              name="author"
              options={authors.map((author) => ({
                value: author.autori,
                label: author.autori,
              }))}
              value={filters.author.map((author) => ({
                value: author,
                label: author,
              }))}
              onChange={(selectedOptions) =>
                handleFilterChange(selectedOptions, "author")
              }
              className="w-full"
            />
          </div>

          {/* Year Filter */}
          <div className="mb-4">
            <label htmlFor="year" className="block text-lg text-white">
              Viti i Publikimit
            </label>
            <input
              type="text"
              id="year"
              name="year"
              className="w-full p-2 border rounded-md"
              value={filters.year}
              placeholder="Shkruaj vitin..."
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
            />
          </div>

          {/* Price Range Filter */}
          <div className="mb-4">
            <label className="block text-lg text-white">Rangu i Çmimit</label>

            {/* Display current price range values */}
            <div className="text-white text-sm mb-2">
              Çmimi: {priceRange[0]}$ - {priceRange[1]}$
            </div>

            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[0]}
              onChange={(e) => setPriceRange([+e.target.value, priceRange[1]])}
              className="w-full"
            />
            <input
              type="range"
              min="0"
              max="100"
              value={priceRange[1]}
              onChange={(e) => setPriceRange([priceRange[0], +e.target.value])}
              className="w-full"
            />
          </div>
        </div>

        {/* Right Side: Books */}
        <div className="lg:w-3/4 p-4 bg-[#BCC5B8]">
          <h1 className="text-3xl font-bold text-[#817E82]">Lista e librave</h1>
          <small className="text-pretty text-sm text-[#817E82]/75">
            Ky është sektori i listës së librave. Rezultati varet nga filtrat e
            zgjedhur në tabin e filtrave.
          </small>
          {/* Pagination Controls */}
          <div className="pagination mt-4 text-center">
            <span
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`cursor-pointer ${
                currentPage === 1 ? "text-gray-400" : "text-black"
              } text-2xl`}
            >
              &#8249; {/* Left chevron */}
            </span>
            <span className="mx-2">{`Faqja ${currentPage} nga ${totalPages}`}</span>
            <span
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              className={`cursor-pointer ${
                currentPage === totalPages ? "text-gray-400" : "text-black"
              } text-2xl`}
            >
              &#8250; {/* Right chevron */}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="border border-gray-200 p-4 rounded-md shadow-lg"
              >
                <div className="flex justify-center mb-4">
                  <Link to={`/libri/${book.id}`}>
                    <img
                      src={`/assets/img/bookcovers/${book.foto}`}
                      alt={book.emri}
                      className="h-64 w-44 object-cover"
                    />
                  </Link>
                </div>
                <Link to={`/libri/${book.id}`}>
                  <h3 className="text-lg font-semibold text-gray-500">
                    {book.titulli}
                  </h3>
                </Link>
                {/* <Link to={`/listaLibrave?autori=${book.autori}`}> */}
                  <p className="text-sm text-gray-500">{book.autori}</p>
                {/* </Link>/ */}
                <p className="mt-2">Format: {book.tipi}</p>
                <p className="text-lg font-semibold">{book.cmimi} $</p>
                {book.oldPrice && (
                  <p className="text-sm text-gray-500 line-through">
                    ${book.oldPrice}
                  </p>
                )}
                <div className="mt-4">
                  <button
                    type="submit"
                    className="w-full rounded-[10px] bg-[#7B8E76] p-2 text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
                  >
                    shto në shportë
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <div className="pagination mt-4 text-center">
            <span
              onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
              className={`cursor-pointer ${
                currentPage === 1 ? "text-gray-400" : "text-black"
              } text-2xl`}
            >
              &#8249; {/* Left chevron */}
            </span>
            <span className="mx-2">{`Faqja ${currentPage} nga ${totalPages}`}</span>
            <span
              onClick={() =>
                setCurrentPage(Math.min(currentPage + 1, totalPages))
              }
              className={`cursor-pointer ${
                currentPage === totalPages ? "text-gray-400" : "text-black"
              } text-2xl`}
            >
              &#8250; {/* Right chevron */}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewAll;
