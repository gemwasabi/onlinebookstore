import React, { useState } from "react";
import kopertina from "../../assets/img/alittlelife.png";

const CheckoutPage1 = ({ nextStep }) => {
    const initialBooks = [
        { id: 1, title: "A little life", author: "Hanya Yanagihara", price: 20.00, quantity: 1 },
        { id: 2, title: "A little life", author: "Hanya Yanagihara", price: 20.00, quantity: 1 },
        { id: 3, title: "A little life", author: "Hanya Yanagihara", price: 20.00, quantity: 1 },
        { id: 4, title: "A little life", author: "Hanya Yanagihara", price: 20.00, quantity: 1 },
    ];

    const [books, setBooks] = useState(initialBooks);

    const handleQuantityChange = (id, newQuantity) => {
        setBooks(books.map(book => book.id === id ? { ...book, quantity: newQuantity } : book));
    };

    return (
        <div className="min-h-screen bg-[#7B8E76] flex items-center justify-center p-4">
            <div className="w-full max-w-6xl bg-[#BCC5B8] shadow-lg rounded-lg p-0">
                <div className="flex flex-col lg:flex-row">
                    {/* Detajet personale */}
                    <div className="w-full lg:w-2/3 p-3">
                        <h2 className="text-xl text-left font-bold mb-2 text-[#757C73]">Detajet personale</h2>
                        <p className="text-[#757C73] mb-4"><span className="text-[#EA6464]">* </span> fushë obligative</p>
                        <br></br>
                        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
                                />
                                <label
                                    htmlFor="email"
                                    className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                                >
                                    Email Adresa
                                </label>
                            </div>
                        </form>
                    </div>

                    <div className="w-full lg:w-1/3 bg-[#D3DAD1] p-3 shadow-md rounded-lg lg:rounded-l-[1px] lg:mt-0">
                        <h2 className="text-2xl text-center font-bold mb-4 text-[#757C73]">Bleji librat</h2>
                        <div className="space-y-4 overflow-y-scroll" style={{ maxHeight: "180px" }}>
                            {books.map((book, index) => (
                                <div key={index} className="flex justify-between items-center border-b py-1">
                                    <div className="flex items-center">
                                        <img src={kopertina} alt="A little life" className="w-12 h-12 mr-4" />
                                        <div>
                                            <p className="text-sm text-[#697367] font-bold">{book.title}</p>
                                            <p className="text-[#727D6D] text-xs">{book.author}</p>
                                            <p className="text-[#EA6464] text-xs cursor-pointer">Largo</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col flex-wrap-reverse items-end">
                                        <p className="text-[#727D6D]">{(book.quantity * book.price).toFixed(2)}€</p>
                                        <input
                                            type="number"
                                            value={book.quantity}
                                            min="1"
                                            onChange={(e) => handleQuantityChange(book.id, parseInt(e.target.value))}
                                            className="w-12 text-center border border-gray-300 rounded mt-2"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="mt-4">
                            <p className="text-sm text-blue-500 cursor-pointer">Keni kupon?</p>
                            <div className="mt-2">
                                <div className="flex justify-between">
                                    <span>Nëntotali</span>
                                    <span>
                                        {books.reduce((acc, book) => acc + (book.price * book.quantity), 0).toFixed(2)}€
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Zbritje</span><span>0.00€</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Transporti</span><span>1.00€</span>
                                </div>
                                <div className="flex justify-between font-bold">
                                    <span>Totali</span>
                                    <span>
                                        {(books.reduce((acc, book) => acc + (book.price * book.quantity), 0) + 1.00).toFixed(2)}€
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center">
                            <button
                                className="mt-[116px] w-full rounded-[10px] bg-[#7B8E76] p-2 text-2xl text-[#BCC5B8] transition-all hover:shadow-[inset_0_10px_23px_-15px_rgba(0,0,0,1)]"
                                onClick={nextStep}
                            >
                                Hapi tjetër
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage1;