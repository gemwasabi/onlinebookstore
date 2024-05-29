import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import cover from "../assets/img/bookcover.jpg";
import chevronLeft from "../assets/img/chevron-left.png";
import chevronRight from "../assets/img/chevron-right.png";
import Autoslider from "../komponentet/Autoslider";

const Ballina = () => {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [tufat, setTufat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/tufat");
        if (Array.isArray(res.data)) {
          setTufat(res.data);
        } else {
          setTufat([]);
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

  const books = [
    { title: "Rest Deck", src: cover },
    { title: "But What Will People Say?", src: cover },
    { title: "Burnout", src: cover },
    { title: "The Body Keeps the Score", src: cover },
    { title: "The Body is Not an Apology", src: cover },
    { title: "Good Inside", src: cover },
    { title: "The Anxious Generation", src: cover },
    { title: "The Anxious Generation", src: cover },
    { title: "The Anxious Generation", src: cover },
    { title: "The Anxious Generation", src: cover },
    { title: "The Anxious Generation", src: cover },
    { title: "The Anxious Generation", src: cover },
    // Add more books as needed
  ];

  const books_two = [
    {
      title: "Another Last Call: Poems on Addiction and Deliverance",
      author: "Kathy Acker & Paul Zelevansky",
      price: "$20.41",
      originalPrice: "$24.95",
      imgSrc: cover,
    },
    {
      title: "Drunk Mom: A Memoir",
      author: "Jowita Bydlowska",
      price: "$16.74",
      originalPrice: "$18.00",
      imgSrc: cover,
    },
    {
      title: "Another Last Call: Poems on Addiction and Deliverance",
      author: "Kathy Acker & Paul Zelevansky",
      price: "$20.41",
      originalPrice: "$24.95",
      imgSrc: cover,
    },
    {
      title: "Drunk Mom: A Memoir",
      author: "Jowita Bydlowska",
      price: "$16.74",
      originalPrice: "$18.00",
      imgSrc: cover,
    },
    {
      title: "Another Last Call: Poems on Addiction and Deliverance",
      author: "Kathy Acker & Paul Zelevansky",
      price: "$20.41",
      originalPrice: "$24.95",
      imgSrc: cover,
    },
    {
      title: "Drunk Mom: A Memoir",
      author: "Jowita Bydlowska",
      price: "$16.74",
      originalPrice: "$18.00",
      imgSrc: cover,
    },
    {
      title: "Another Last Call: Poems on Addiction and Deliverance",
      author: "Kathy Acker & Paul Zelevansky",
      price: "$20.41",
      originalPrice: "$24.95",
      imgSrc: cover,
    },
    {
      title: "Drunk Mom: A Memoir",
      author: "Jowita Bydlowska",
      price: "$16.74",
      originalPrice: "$18.00",
      imgSrc: cover,
    },
    // Add more book objects as needed
  ];

  return (
    <>
      <Autoslider></Autoslider>

      <div className="bg-[#7B8E76] py-9">
        <div className="w-full mx-auto lg:container p-10 bg-[#BDC6BA] rounded-2xl shadow sm:rounded-none">
          <div className="flex flex-col md:flex-row justify-between">
            <h2 className="text-xl md:text-2xl font-bold mb-4 text-[#282c26]">
              Mental Health Books for Tough Days, Good Days, and Every Day
              In-Between
            </h2>
            <a href="#!" className="text-purple-700 text-lg">
              Shfaq të gjitha (28)
            </a>
          </div>
          <div className="relative flex items-center">
            <button className="absolute -left-16 p-3 m-3 rounded-full z-10 hidden lg:block">
              <img src={chevronLeft} alt="Previous" />
            </button>
            <div className="flex overflow-x-auto scrollbar-hide space-x-4 py-2">
              {books.map((book, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 transform transition-transform hover:scale-105 hover:shadow-lg"
                >
                  <Link to={`/libri/${book.id}`}>
                    <img
                      className="h-64 w-44 object-cover"
                      src={book.src}
                      alt={book.title}
                    />
                  </Link>
                </div>
              ))}
            </div>
            <button className="absolute -right-16 p-3 m-3 rounded-full z-10 hidden lg:block">
              <img src={chevronRight} alt="Next" />
            </button>
          </div>
        </div>

        <div className="w-full mx-auto lg:container p-5 bg-[#BDC6BA] my-10">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Recovery: A Journey Toward Wholeness & Balance
            </h1>
          </div>

          <div className="text-right mb-4">
            <a href="#" className="text-purple-900 font-semibold">
              View all (95)
            </a>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {books_two.map((book, index) => (
              <div key={index} className="flex-shrink-0 flex">
                <div className="flex justify-between">
                  <img
                    className="h-44 w-22 object-cover"
                    src={book.imgSrc}
                    alt={book.title}
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-purple-900">
                      {book.title}
                    </h2>
                    <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                    <div className="text-lg font-bold text-purple-900">
                      {book.price}{" "}
                      <span className="line-through text-red-600">
                        {book.originalPrice}
                      </span>
                    </div>
                  </div>
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
