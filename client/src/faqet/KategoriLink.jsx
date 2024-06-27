import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const CategoryLinks = () => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8800/api/kategorite"
        );
        console.log("Fetched categories data:", response.data); // Log the response data
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setCategories([]); // Set to an empty array if the data is not an array
        }
      } catch (error) {
        console.log(error);
        setCategories([]); // Set to an empty array in case of error
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/kategoria?kategoria=${category}`);
  };

  return (
    <div className="bg-[#879C82] border-t-2 border-dashed border-[#7B8E76] flex justify-center items-center space-x-4 h-14 sticky top-10 z-50 ">
      <Link to="/kategoria" className="px-3 py-2 text-[#282c26] ">
        Të gjitha kategoritë
      </Link>
      {categories.slice(0, 6).map((category) => (
        <button
          key={category.id}
          onClick={() => handleCategoryClick(category.emri)}
          className="px-3 py-2 hover:underline text-[#282c26]"
        >
          {category.emri}
        </button>
      ))}
    </div>
  );
};

export default CategoryLinks;
