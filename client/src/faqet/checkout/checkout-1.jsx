import React, { useContext, useState, useEffect } from "react";
import axios from "axios";
import kopertina from "../../assets/img/alittlelife.png";
import { AuthContext } from "../../context/authContext";
import { toast, ToastContainer } from "react-toastify";

const CheckoutPage1 = ({ prevStep, nextStep }) => {
  const [books, setBooks] = useState([]);
  const { currentUser, ckycu } = useContext(AuthContext);

  const fetchBooks = async () => {
    try {
      const response = await axios.get("http://localhost:8800/api/shporta", {
        params: {
          userId: currentUser.id,
        },
      });
      if (Array.isArray(response.data)) {
        setBooks(response.data);
      } else {
        setBooks([]);
      }
    } catch (error) {
      console.error("Error fetching books:", error);
    }
  };

  const handleQuantityChange = (id, newQuantity) => {
    setBooks(
      books.map((book) =>
        book.id === id ? { ...book, quantity: newQuantity } : book
      )
    );
  };

  const handleLargoLibrin = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/shporta/${id}`);
      fetchBooks();
      toast.success("Libri u shlye me sukses", {
        position: "top-right",
      });
    } catch (error) {
      console.error("Error removing book:", error);
      toast.error("Ka ndodhur nje gabim gjate shlyerjes!", {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <div className="min-h-screen bg-[#7B8E76] flex items-center justify-center lg:p-4 md:p-4">
      <div className="w-full max-w-6xl bg-[#BCC5B8] shadow-lg rounded-lg p-0 sm:p-3">
        <div className="flex flex-col lg:flex-row sm:flex-col">
          <div className="w-full lg:w-2/3 p-3 mb-0">
            <h2 className="text-lg lg:text-2xl text-left font-bold mb-2 text-[#757C73]">
              Detajet e kartelës{" "}
            </h2>
            <p className="text-[#757C73] mb-4">
              <span className="text-[#EA6464]">* </span> fushë obligative
            </p>
            <br></br>
            <form className="grid grid-cols-1 md:grid-cols-2 p-3 gap-5">
              <div className="relative">
                <input
                  type="text"
                  name="emri"
                  className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                  placeholder=" "
                />
                <label
                  htmlFor="emri"
                  className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                  value={currentUser.emri}
                >
                  Emri
                </label>
              </div>
              <div className="relative">
                <input
                  type="text"
                  name="mbiemri"
                  className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                  placeholder=" "
                  value={currentUser.mbiemri}
                />
                <label
                  htmlFor="mbiemri"
                  className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                >
                  Mbiemri
                </label>
              </div>
              <div className="relative">
                <input
                  type="tel"
                  name="telefoni"
                  className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                  placeholder=" "
                  value={currentUser.telefoni}
                />
                <label
                  htmlFor="telefoni"
                  className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                >
                  Numri i telefonit
                </label>
              </div>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                  placeholder=" "
                  value={currentUser.email}
                />
                <label
                  htmlFor="email"
                  className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                >
                  Email Adresa
                </label>
              </div>
            </form>
            <div className="hidden absolute pb-6 bottom-0 mb-[-30px] lg:mb-[-100px] md:mb-[140px]">
              <a
                className="p-2 text-xl lg:text-2xl text-[#727D6D] align-center text-center hover:text-[#BCC5B8] cursor-pointer"
                onClick={prevStep}
              >
                Shko prapa
              </a>
            </div>
          </div>
          <div className="w-full lg:w-1/3 bg-[#D3DAD1] p-3 mt-[80px] shadow-md rounded-lg lg:rounded-l-[1px] lg:mt-0">
            <h2 className="text-2xl text-center font-bold mb-4 text-[#757C73]">
              Bleji librat
            </h2>
            <div
              className="space-y-4 overflow-y-scroll"
              style={{ maxHeight: "180px" }}
            >
              {books.map((book, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center border-b py-1"
                >
                  <div className="flex items-center">
                    <img
                      src={`/assets/img/bookcovers/${book.foto}`}
                      alt="A little life"
                      className="w-12 h-12 mr-4"
                    />
                    <div>
                      <p className="text-sm text-[#697367] font-bold">
                        {book.emri}
                      </p>
                      <p className="text-[#727D6D] text-xs">{book.autori}</p>
                      <p
                        className="text-[#EA6464] text-xs cursor-pointer"
                        onClick={() => handleLargoLibrin(book.shporta_id)}
                      >
                        Largo
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col flex-wrap-reverse items-end">
                    <p className="text-[#727D6D]">
                      {(book.quantity * book.price).toFixed(2)}€
                    </p>
                    <input
                      type="number"
                      value="1"
                      min="1"
                      onChange={(e) =>
                        handleQuantityChange(book.id, parseInt(e.target.value))
                      }
                      className="w-12 text-center border border-gray-300 rounded mt-2"
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <p className="text-sm text-blue-500 cursor-pointer">
                Keni kupon?
              </p>
              <div className="mt-2">
                <div className="flex justify-between">
                  <span>Nëntotali</span>
                  <span>
                    {books
                      .reduce(
                        (acc, book) => acc + book.price * book.quantity,
                        0
                      )
                      .toFixed(2)}
                    €
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Zbritje</span>
                  <span>0.00€</span>
                </div>
                <div className="flex justify-between">
                  <span>Transporti</span>
                  <span>1.00€</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Totali</span>
                  <span>
                    {(
                      books.reduce(
                        (acc, book) => acc + book.price * book.quantity,
                        0
                      ) + 1.0
                    ).toFixed(2)}
                    €
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-col justify-center mt-6">
              <button
                className="rounded-[10px] bg-[#7B8E76] p-2 text-xl lg:text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
                onClick={nextStep}
              >
                Hapi tjetër
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default CheckoutPage1;
