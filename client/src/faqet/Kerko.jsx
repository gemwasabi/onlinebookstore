import { useState, useEffect } from "react";
import axios from "axios";
import logo from "../assets/img/lype.svg";
import scroll from "../assets/img/scroll.svg";
import search from "../assets/img/Book.svg";
import { Link } from "react-router-dom";

const Kerko = () => {
  const [isActive, setIsActive] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = async (query) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:8800/api/librat/kerko?query=${query}`
      );
      setSearchResults(response.data.results || []);
    } catch (error) {
      console.error("Error fetching search results:", error);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  return (
    <div className="w-screen bg-[#7B8E76]">
      {!isActive && (
        <div
          className={`flex justify-center transition-opacity duration-500 ${
            isActive ? "opacity-0" : "opacity-100"
          }`}
        >
          <img
            className="mt-40 absolute text-center"
            src={logo}
            alt="Logoja Lype"
          />
        </div>
      )}
      <div
        id="search-section"
        className={`min-h-screen w-screen relative flex flex-col items-center ${
          isActive ? "justify-start" : "justify-center"
        }`}
      >
        <div
          className={`relative w-full max-w-[800px] ${isActive ? "mt-5" : ""}`}
        >
          <input
            type="text"
            className="text-[30px] transition-colors h-[80px] duration-200 w-full rounded-[100px] border-4 border-[#ADBBAA] bg-[#BDC6BA] hover:drop-shadow-md p-2 outline-none placeholder:p-2 placeholder:text-left placeholder:font-sans placeholder:text-[#858B83] text-[#747474] px-5 hover:border-[#FFFFFF] hover:shadow focus:shadow focus:border-[#FFFFFF]"
            placeholder="kërko këtu..."
            onFocus={() => setIsActive(true)}
            onBlur={() => setIsActive(false)}
            onKeyUp={(e) => setSearchTerm(e.target.value)}
          />
          {!isActive && (
            <img
              className="w-[60px] h-[60px] absolute right-0 top-0 mt-[10px] mr-8"
              src={search}
              alt="search ikona"
            />
          )}

          {searchTerm && isActive && (
            <div className="overflow-y-auto max-h-[calc(100vh-200px)] w-full bg-[#bcc6bb] rounded-lg shadow-lg mt-2">
              {searchResults.map((result, index) => (
                <Link
                  key={index}
                  to={`/libri/${result.id}`}
                  className="hover:no-underline"
                >
                  <div className="flex justify-between items-center py-4 px-2 hover:bg-[#ADBBAA] transition-colors cursor-pointer">
                    <div className="flex">
                      <img
                        src={`/assets/img/bookcovers/${result.foto}`}
                        alt={result.titulli}
                        className="w-16 h-20 mr-4"
                      />
                      <div>
                        <h2 className="text-xl text-[#768075] font-bold no-underline">
                          {result.titulli}
                        </h2>
                        <p className="text-sm text-[#768075] no-underline">
                          Nga {result.autori}
                        </p>
                      </div>
                    </div>
                    <div className="text-[#768075] font-bold text-xl">
                      <h2 className="text-xl text-[#768075] font-bold no-underline pr-10">
                        {result.cmimi_vjeter ? (
                          <>
                            <span>{result.cmimi}€</span>{" "}
                            <span style={{ textDecoration: "line-through" }}>
                              <s>{result.cmimi_vjeter}€</s>
                            </span>
                          </>
                        ) : (
                          <span>{result.cmimi}€</span>
                        )}
                      </h2>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {!isActive && (
          <img
            className={`w-10 h-10 absolute bottom-0 mb-4 self-center ${
              !isActive ? "animate-bounce" : ""
            }`}
            src={scroll}
            alt="scroll ikona"
          />
        )}
      </div>
    </div>
  );
};

export default Kerko;
