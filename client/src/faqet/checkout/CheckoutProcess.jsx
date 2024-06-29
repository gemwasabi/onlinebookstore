import { useState, useContext, useEffect } from "react";
import c1 from "../../assets/img/progress-bar/c1.svg";
import c2 from "../../assets/img/progress-bar/c2.svg";
import c3 from "../../assets/img/progress-bar/c3.svg";
import check from "../../assets/img/progress-bar/check.svg";
import { AuthContext } from "../../context/authContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { redirect, useNavigate } from "react-router-dom";

const CheckoutProcess = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const { currentUser, ckycu } = useContext(AuthContext);
  const [books, setBooks] = useState([]);
  const navigate = useNavigate();

  const [errors, setErrors] = useState({});

  const [inputs, setInputs] = useState({
    emri: currentUser ? currentUser.emri : "",
    mbiemri: currentUser ? currentUser.mbiemri : "",
    numri_telefonit: "",
    emaili: currentUser ? currentUser.emaili : "",
    emri_ne_kartele: "",
    numri_karteles: "",
    data_skadimit: "",
    cvv: "",
    adresa_1: "",
    adresa_2: "",
    qyteti: "",
    kodi_postar: "",
    koment: "",
    perdoruesi_id: currentUser ? currentUser.id : "",
  });

  useEffect(() => {
    if (!currentUser) {
      navigate("/");
    }
  }, [currentUser, navigate]);

  const trajtoNdryshimet = (e) => {
    const { name, value } = e.target;
    setInputs((prevInputs) => ({
      ...prevInputs,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const isValid = validateInputs();
    if (isValid) {
      try {
        await axios.post("http://localhost:8800/api/porosite", inputs);
        await axios.delete("http://localhost:8800/api/shporta/pastro", {
          params: {
            userId: currentUser.id,
          },
        });
        navigate("/");
      } catch (err) {
        console.error("Error submitting form:", err);
        toast.error("Ka ndodhur një gabim gjatë dorëzimit!", {
          position: "top-right",
        });
      }
    } else {
      toast.error("Ju lutem korrigjoni fushat e dërgimit!", {
        position: "top-right",
      });
    }
  };


  const validateInputs = () => {
    const newErrors = {};
    if (currentStep === 1) {
      if (!inputs.emri || inputs.emri.length < 2 || /\d/.test(inputs.emri)) {
        newErrors.emri = 'Emri duhet të ketë të paktën 2 karaktere dhe nuk duhet të përmbajë numra';
      }
      if (!inputs.mbiemri || inputs.mbiemri.length < 2 || /\d/.test(inputs.mbiemri)) {
        newErrors.mbiemri = 'Mbiemri duhet të ketë të paktën 2 karaktere dhe nuk duhet të përmbajë numra';
      }
      if (!/^\d+$/.test(inputs.numri_telefonit)) {
        newErrors.numri_telefonit = 'Numri i telefonit duhet të përmbajë vetëm numra';
      }
      if (!/\S+@\S+\.\S+/.test(inputs.emaili)) {
        newErrors.emaili = 'Email adresa duhet të jetë e vlefshme';
      }
    } else if (currentStep === 2) {
      if (!inputs.emri_ne_kartele || /\d/.test(inputs.emri_ne_kartele) || inputs.emri_ne_kartele.split(' ').length < 2) {
        newErrors.emri_ne_kartele = 'Emri në kartelë duhet të ketë të paktën 2 fjalë dhe nuk duhet të përmbajë numra';
      }
      if (!/^\d{16}$/.test(inputs.numri_karteles)) {
        newErrors.numri_karteles = 'Numri i kartelës duhet të ketë 16 numra';
      }
      if (!/^\d{3}$/.test(inputs.cvv)) {
        newErrors.cvv = 'CVV duhet të ketë 3 numra';
      }
      if (new Date(inputs.data_skadimit) <= new Date()) {
        newErrors.data_skadimit = 'Data e skadimit duhet të jetë pas datës së sotme';
      }
    } else if (currentStep === 3) {
      if (!inputs.adresa_1) {
        newErrors.adresa_1 = 'Adresa 1 është fushë obligative';
      }
      if (!/^\d{6}$/.test(inputs.kodi_postar)) {
        newErrors.kodi_postar = 'Kodi postar duhet të ketë 6 numra';
      }
      if (!inputs.qyteti) {
        newErrors.qyteti = 'Qyteti është fushë obligative';
      }
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  

  useEffect(() => {
    fetchBooks();
  }, []);

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

  const nextStep = () => {
    if (currentStep < 3) {
      if (validateInputs()) {
        setCurrentStep((prevStep) => prevStep + 1);
      } else {
        toast.error("Ju lutem korrigjoni fushat e dërgimit!", {
          position: "top-right",
        });
      }
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    setCurrentStep((prevStep) => Math.max(prevStep - 1, 1));
  };

  return (
    <div className="min-h-screen overflow-y-hidden m-4 items-center flex flex-col p-2">
      <ProgressBar currentStep={currentStep} />
      <div className="w-4/5">
        <div className="bg-[#7B8E76] flex justify-center">
          <div className="w-full bg-[#BCC5B8] shadow-lg rounded-lg p-0 sm:p-3">
            <div className="flex flex-col lg:flex-row">
              <div className={`w-full lg:w-2/3 p-3 mb-0 ${currentStep === 1 ? "" : "hidden"}`} id="detajetPersonale">
                <h2 className="text-lg lg:text-2xl text-left font-bold mb-2 text-[#757C73]">
                  Detajet e kartelës{" "}
                </h2>
                <p className="text-[#757C73] mb-4">
                  <span className="text-[#EA6464]">*</span> fushë obligative
                </p>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 p-3 gap-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="emri"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                      value={inputs.emri}
                    />
                    <label
                      htmlFor="emri"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Emri
                    </label>
                    {errors.emri && (
                      <span className="text-red-500">{errors.emri}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="mbiemri"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                      value={inputs.mbiemri}
                    />
                    <label
                      htmlFor="mbiemri"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Mbiemri
                    </label>
                    {errors.mbiemri && (
                      <span className="text-red-500">{errors.mbiemri}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="numri_telefonit"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      value={inputs.numri_telefonit}
                      onChange={trajtoNdryshimet}
                    />

                    <label
                      htmlFor="telefoni"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Numri i telefonit
                    </label>
                    {errors.numri_telefonit && (
                      <span className="text-red-500">
                        {errors.numri_telefonit}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="email"
                      name="emaili"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                      value={inputs.emaili}
                    />
                    <label
                      htmlFor="email"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Email Adresa
                    </label>
                    {errors.emaili && (
                      <span className="text-red-500">{errors.emaili}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`w-full lg:w-2/3 p-3 mb-0 ${currentStep === 2 ? "" : "hidden"}`} id="detajetKarteles">
                <h2 className="text-lg lg:text-2xl text-left font-bold mb-2 text-[#757C73]">
                  Detajet e kartelës{" "}
                </h2>
                <p className="text-[#757C73] mb-4">
                  <span className="text-[#EA6464]">*</span> fushë obligative
                </p>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 p-3 gap-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="emri_ne_kartele"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="emri_ne_kartele"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Emri në kartelë
                    </label>
                    {errors.emri_ne_kartele && (
                      <span className="text-red-500">
                        {errors.emri_ne_kartele}
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="number"
                      name="numri_karteles"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="numri_karteles"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Numri i kartelës
                    </label>
                    {errors.numri_karteles && (
                      <span className="text-red-500">
                        {errors.numri_karteles}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="date"
                      name="data_skadimit"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="data_skadimit"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Data e skadimit
                    </label>
                    {errors.data_skadimit && (
                      <span className="text-red-500">
                        {errors.data_skadimit}
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="cvv"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="cvv"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      CVV
                    </label>
                    {errors.cvv && (
                      <span className="text-red-500">{errors.cvv}</span>
                    )}
                  </div>
                </div>
              </div>

              <div className={`w-full lg:w-2/3 p-3 mb-0 ${currentStep === 3 ? "" : "hidden"}`} id="detajetAdreses">
                <h2 className="text-lg lg:text-2xl text-left font-bold mb-2 text-[#757C73]">
                  Detajet e kartelës{" "}
                </h2>
                <p className="text-[#757C73] mb-4">
                  <span className="text-[#EA6464]">*</span> fushë obligative
                </p>
                <br />
                <div className="grid grid-cols-1 md:grid-cols-2 p-3 gap-5">
                  <div className="relative">
                    <input
                      type="text"
                      name="adresa_1"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="adresa_1"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[14px] md:text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Adresa 1
                    </label>
                    {errors.adresa_1 && (
                      <span className="text-red-500">{errors.adresa_1}</span>
                    )}
                  </div>

                  <div className="relative">
                    <input
                      type="text"
                      name="adresa_2"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="adresa_2"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[14px] md:text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Adresa 2
                    </label>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="qyteti"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="qyteti"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[14px] md:text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Qyteti
                    </label>
                    {errors.qyteti && (
                      <span className="text-red-500">{errors.qyteti}</span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="number"
                      name="kodi_postar"
                      className="peer h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="kodi_postar"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[14px] md:text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Kodi postar
                    </label>
                    {errors.kodi_postar && (
                      <span className="text-red-500">{errors.kodi_postar}</span>
                    )}
                  </div>
                  <div className="relative col-span-1 md:col-span-2 lg:col-span-2 lg:col-start-1">
                    <textarea
                      name="koment"
                      className="peer h-32 lg:h-14 w-full rounded-[10px] border-2 border-[#757C73] bg-inherit px-[16px] pt-2 text-base md:text-lg transition-colors duration-100 focus:border-[#51584F] focus:outline-none focus:ring-0"
                      placeholder=" "
                      onChange={trajtoNdryshimet}
                    />
                    <label
                      htmlFor="koment"
                      className="absolute left-0 ml-[20px] -translate-y-4 bg-[#BCC5B8] px-3 text-[14px] md:text-[20px] text-[#757C73] peer-focus:text-[#51584F]"
                    >
                      Koment
                    </label>
                  </div>
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
                          <p className="text-[#727D6D] text-xs">
                            {book.autori}
                          </p>
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
                            handleQuantityChange(
                              book.id,
                              parseInt(e.target.value)
                            )
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
                  {currentStep !== 1 && (
                    <div className="text-center">
                      <a
                        className="p-2 text-xl lg:text-2xl text-[#727D6D] align-center text-center hover:text-[#BCC5B8] cursor-pointer"
                        onClick={prevStep}
                      >
                        Shko prapa
                      </a>
                    </div>
                  )}
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
      </div>
    </div>
  );
};

const ProgressBar = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center z-10 relative m-4 w-4/5">
      <Step number={1} currentStep={currentStep} icon={c1} />
      <Line currentStep={currentStep} />
      <Step number={2} currentStep={currentStep} icon={c2} />
      <Line currentStep={currentStep} />
      <Step number={3} currentStep={currentStep} icon={c3} />
    </div>
  );
};

const Step = ({ number, currentStep, icon }) => {
  const isCompleted = number < currentStep;
  const isActive = number === currentStep;

  let iconElement = null;
  if (isCompleted) {
    iconElement = (
      <img
        src={check}
        alt={`Step ${number} done`}
        className="w-8 h-8 cursor-pointer"
      />
    );
  } else {
    iconElement = (
      <img
        src={icon}
        alt={`Step ${number}`}
        className="w-8 h-8 cursor-pointer bg-[#96A493] p-1 rounded-full"
      />
    );
  }

  return (
    <div className={`step relative ${isCompleted ? "completed" : ""}`}>
      {iconElement}
      <div
        className="caption absolute bottom-full left-1/2 transform -translate-x-1/2 opacity-0 pointer-events-none bg-white text-gray-700 px-2 py-1 rounded shadow-sm transition-opacity duration-300"
        style={{ backgroundColor: isActive ? "#4CAF50" : "#96A493" }}
      >
        Step {number}
      </div>
    </div>
  );
};

const Line = ({ currentStep }) => {
  return (
    <div className="line flex-1 h-1 bg-[#96A493] mx-2 relative">
      <div
        className={`connector absolute top-0 bottom-0 left-0 ${currentStep >= 2 ? "bg-green-500" : "bg-[#96A493]"
          }`}
      ></div>
    </div>
  );
};

export default CheckoutProcess;
