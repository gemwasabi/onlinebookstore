import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FaTrashAlt, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import "../../assets/checkout.css";

const stripePromise = loadStripe("pk_test_51QLXIjP5BZIXEFPC5YFUg55tpo7nlz5eUIeOYbHuTkr9ezE4B35iAA6BCb3tGh4Qm9lGykpZvrFKEs9tUvzaumFC007HU9r3xc");

const PaymentForm = () => {
  const { currentUser } = useContext(AuthContext);
  const userId = currentUser?.id;
  const stripe = useStripe();
  const elements = useElements();
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [shippingInfo, setShippingInfo] = useState({
    name: currentUser?.emri || "",
    email: currentUser?.emaili || "",
  });
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [newAddress, setNewAddress] = useState({
    shteti: "",
    qyteti: "",
    adresa: "",
    kodi_postar: "",
    telefoni: "",
  });
  const [isPayButtonDisabled, setIsPayButtonDisabled] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState(1);
  const [transportMethod, setTransportMethod] = useState("pickup"); // "merrevet" ose "transport"


  useEffect(() => {
    const baseTotal = cartItems.reduce((total, item) => total + item.cmimi * item.quantity, 0);
    const transportCost = transportMethod === "transport" ? 2 : 0;
    setTotalAmount(baseTotal + transportCost);
  }, [cartItems, transportMethod]);


  useEffect(() => {
    const fetchCart = async () => {
      try {
        const cartResponse = await axios.get(`http://localhost:8800/api/shporta?userId=${userId}`);
        console.log("Cart Items:", cartResponse.data);

        const itemsWithQuantity = cartResponse.data.map((item) => ({
          ...item,
          quantity: 1,
        }));
        setCartItems(itemsWithQuantity);

        const calculateTotal = (items) =>
          items.reduce((total, item) => total + item.cmimi * item.quantity, 0);
        setTotalAmount(calculateTotal(itemsWithQuantity));
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const fetchAddresses = async () => {
      try {
        const addressResponse = await axios.get(`http://localhost:8800/api/adresat/${userId}`);
        setSavedAddresses(addressResponse.data);
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchCart();
    if (userId) fetchAddresses();
  }, [userId]);

  useEffect(() => {
    const calculateTotal = (items) =>
      items.reduce((total, item) => total + item.cmimi * item.quantity, 0);
    setTotalAmount(calculateTotal(cartItems));
  }, [cartItems]);

  useEffect(() => {
    const validateForm = () => {
      const isShippingInfoValid = () => {
        if (transportMethod === "transport") {
          if (selectedAddressId === "new") {
            const { shteti, qyteti, adresa, kodi_postar, telefoni } = newAddress;
            return (
              shteti.trim() !== "" &&
              qyteti.trim() !== "" &&
              adresa.trim() !== "" &&
              kodi_postar.trim() !== "" &&
              telefoni.trim() !== ""
            );
          }
          const selectedAddress = savedAddresses.find(
            (address) => address.id === parseInt(selectedAddressId)
          );
          return (
            selectedAddress &&
            selectedAddress.adresa.trim() !== "" &&
            selectedAddress.qyteti.trim() !== "" &&
            selectedAddress.kodi_postar.trim() !== ""
          );
        }
        return true; 
      };

      const isCardValid = () => {
        if (paymentMethod === 1) {
          const cardElement = elements?.getElement(CardElement);
          return cardElement && !cardElement.empty && !cardElement.invalid;
        }
        return true;
      };

      setIsPayButtonDisabled(!(isShippingInfoValid() && isCardValid()));
    };

    validateForm();
  }, [
    shippingInfo,
    selectedAddressId,
    newAddress,
    elements,
    savedAddresses,
    transportMethod,
    paymentMethod,
  ]);


  const handleCardChange = (event) => {
    if (paymentMethod === 1) {
      setIsPayButtonDisabled(event.empty || !!event.error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddNewAddress = async () => {
    if (
      newAddress.shteti.trim() === "" ||
      newAddress.qyteti.trim() === "" ||
      newAddress.adresa.trim() === "" ||
      newAddress.kodi_postar.trim() === "" ||
      newAddress.telefoni.trim() === ""
    ) {
      alert("Please fill in all the address fields.");
      return;
    }

    try {
      const response = await axios.post("http://localhost:8800/api/adresat", {
        ...newAddress,
        perdoruesi_id: userId,
      });
      alert("New address added successfully!");
      setSavedAddresses((prev) => [...prev, response.data]);
      setNewAddress({ shteti: "", qyteti: "", adresa: "", kodi_postar: "", telefoni: "" });
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  const handleAddressChange = (e) => {
    const selectedId = e.target.value;
    setSelectedAddressId(selectedId);

    if (selectedId !== "new" || transportMethod === "pickup") {
      setNewAddress({
        shteti: "",
        qyteti: "",
        adresa: "",
        kodi_postar: "",
        telefoni: "",
      });
    }
  };

  const handleQuantityChange = (bookId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const clearCart = async () => {
    try {
      await axios.delete(`http://localhost:8800/api/shporta/pastro`, {
        params: { userId },
      });
      setCartItems([]);
    } catch (error) {
      console.error("Error clearing the cart:", error);
      alert("Failed to clear the cart. Please try again.");
    }
  };

  const handlePayment = async () => {
    setPaymentStatus("Processing...");

    try {
      if (paymentMethod === 1) {
        const secretResponse = await axios.post("http://localhost:8800/api/porosite/pagesa", {
          amount: totalAmount,
          currency: "eur",
        });

        const cardElement = elements?.getElement(CardElement);
        const { error, paymentIntent } = await stripe.confirmCardPayment(secretResponse.data.clientSecret, {
          payment_method: { card: cardElement },
        });

        if (error || paymentIntent.status !== "succeeded") {
          throw new Error(error?.message || "Stripe payment failed.");
        }

        await saveOrder(paymentIntent.id, 1); // Stripe
        setPaymentStatus("Payment successful!");
      } else {
        await saveOrder(null, 0); // Cash
        setPaymentStatus("Your payment was successful. Pay on delivery.");
      }

      await clearCart();
      resetFormState();
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus(`Payment failed: ${error.message}`);
    }
  };

  const resetFormState = () => {
    setShippingInfo({
      name: currentUser?.emri || "",
      email: currentUser?.emaili || "",
    });
    setSelectedAddressId("");
    setNewAddress({
      shteti: "",
      qyteti: "",
      adresa: "",
      kodi_postar: "",
      telefoni: "",
    });
    setPaymentStatus("");
    setTotalAmount(0);
    setCartItems([]);
  };

  const saveOrder = async (paymentIntentId, method) => {
    let shippingDetails = {};
  
    if (transportMethod === "transport") {
      shippingDetails =
        selectedAddressId === "new"
          ? { ...newAddress }
          : savedAddresses.find((address) => address.id === parseInt(selectedAddressId));
  
      if (!shippingDetails) {
        setPaymentStatus("Please select or provide a valid address.");
        return;
      }
    } else {
      shippingDetails = {
        adresa: "E merr ne dyqan",
        qyteti: "Prishtine",
        kodi_postar: "00000",
        telefoni: "00000000",
        shteti: "Kosova",
      };
    }
  
    shippingDetails.email = shippingInfo.email;
  
    const orderData = {
      userId,
      totalAmount,
      cartItems,
      shippingInfo: shippingDetails,
      transportMethod: transportMethod === "pickup" ? 0 : 1,
      paymentIntentId,
      paymentMethod: method,
    };
  
    try {
      await axios.post("http://localhost:8800/api/porosite/ruaj-porosine", orderData);
    } catch (error) {
      throw new Error("Error saving order.");
    }
  };

  const handleRemoveBook = async (bookId) => {
    const confirmDelete = window.confirm("A jeni te sigurte qe doni ta fshini librin?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`http://localhost:8800/api/shporta/${bookId}`);
      console.log("Book deleted:", response.data);
      setCartItems((prevItems) => prevItems.filter((book) => book.shporta_id !== bookId));
    } catch (error) {
      console.error("Error removing book:", error);
      alert("Ndodhi nje gabim gjate fshirjes se librit. Ju lutem provoni perseri.");
    }
    setCartItems((prevItems) => prevItems.filter((book) => book.shporta_id !== bookId));

  };

  const calculateTransportDate = (daysToAdd) => {
    const today = new Date();
    const futureDate = new Date(today.setDate(today.getDate() + daysToAdd));
    const options = { day: "2-digit", month: "long", year: "numeric" };
    return futureDate.toLocaleDateString("sq-AL", options);
  };


  if (!userId) {
    return <p>Ju lutem kyçyni para se të vazhdoni me blerjen.</p>;
  }
  return (
    <div className="payment-container">

      <h2 className="text-xl pb-2 text-white">Shporta</h2>
      <div className="checkout-layout">
        <div className="products-section">
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              cartItems.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.foto ? `/assets/img/bookcovers/${item.foto}` : "default-image.jpg"}
                    alt={item.titulli || "Book Cover"}
                    className="book-image"
                  />
                  <div className="book-info">
                    <h4>{item.titulli}</h4>
                    <p>Price: ${item.cmimi}</p>
                    <div className="quantity-controls">
                      <FaMinusCircle onClick={() => handleQuantityChange(item.id, -1)} />
                      <span>{item.quantity}</span>
                      <FaPlusCircle onClick={() => handleQuantityChange(item.id, 1)} />
                    </div>
                    <p>Total: ${(item.cmimi * item.quantity).toFixed(2)}</p>
                  </div>
                  <FaTrashAlt onClick={() => handleRemoveBook(item.shporta_id)} />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="info-section">
          <div className="user-info">
            <h3 className="mb-1 text-pretty font-bold">Detajet e pagesës</h3>
            <label>Emri</label>
            <input
              type="text"
              name="name"
              value={shippingInfo.name}
              placeholder="Emri juaj"
              onChange={handleInputChange}
            />
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={shippingInfo.email}
              placeholder="Emaili juaj"
              onChange={handleInputChange}
            />
          </div>

          <div className="transport-method">
            <h3>Metoda e transportit</h3>
            <div className="transport-toggle">
              <button
                className={`toggle-btn ${transportMethod === "pickup" ? "active" : ""}`}
                onClick={() => setTransportMethod("pickup")}
              >
                Merre Vet
              </button>
              <button
                className={`toggle-btn ${transportMethod === "transport" ? "active" : ""}`}
                onClick={() => setTransportMethod("transport")}
              >
                Transporto (2€)
              </button>
            </div>

            {transportMethod === "pickup" && (
              <div className="pickup-info">
                <h4 className="mb-1">Eja merre në:</h4>
                <p>Rruga Jakov Xoxa, Prishtinë</p>
                <p>Orari: 09:00 - 20:00</p>
                <p>Numri i telefonit: 044123123</p>
              </div>
            )}

            {transportMethod === "transport" && (
              <div className="address-info">
                <h4>Data e arritjes</h4>
                <p>
                  Porosia juaj do të arrij mes ditëve{" "}
                  <strong>{calculateTransportDate(5)}</strong> dhe{" "}
                  <strong>{calculateTransportDate(7)}</strong>.
                </p>
                <h4>Shipping Address</h4>
                <select value={selectedAddressId} onChange={handleAddressChange}>
                  <option value="">Select an Address</option>
                  {savedAddresses.map((address) => (
                    <option key={address.id} value={address.id}>
                      {`${address.adresa}, ${address.qyteti}, ${address.shteti} (${address.kodi_postar})`}
                    </option>
                  ))}
                  <option value="new">Add a New Address</option>
                </select>
                {selectedAddressId === "new" && (
                  <div className="new-address-form">
                    <input type="text" name="shteti" value={newAddress.shteti} placeholder="State" onChange={handleNewAddressChange} />
                    <input type="text" name="qyteti" value={newAddress.qyteti} placeholder="City" onChange={handleNewAddressChange} />
                    <input type="text" name="adresa" value={newAddress.adresa} placeholder="Address" onChange={handleNewAddressChange} />
                    <input type="text" name="kodi_postar" value={newAddress.kodi_postar} placeholder="Postal Code" onChange={handleNewAddressChange} />
                    <input type="text" name="telefoni" value={newAddress.telefoni} placeholder="Phone" onChange={handleNewAddressChange} />
                    <button onClick={handleAddNewAddress}>Add New Address</button>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="payment-method">
            <h3>Metoda e pageses</h3>
            <div className="payment-toggle">
              <button
                className={`payment-btn ${paymentMethod === 0 ? "active" : ""}`}
                onClick={() => {
                  setPaymentMethod(0);
                  setIsPayButtonDisabled(false); 
                }}
              >
                Cash
              </button>
              <button
                className={`payment-btn ${paymentMethod === 1 ? "active" : ""}`}
                onClick={() => {
                  setPaymentMethod(1);
                  const cardElement = elements?.getElement(CardElement);
                  setIsPayButtonDisabled(!cardElement || cardElement.empty || cardElement.invalid);
                }}
              >
                Stripe
              </button>
            </div>
            {paymentMethod === 0 && (
              <div className="cash-info">
                <p>Postieri do e kete nje terminal POS me vete, ne rast se doni te paguani me kartele.</p>
              </div>
            )}

            {paymentMethod === 1 && (
              <div className="stripe-info">
                <h4 className="mb-2">Paguani me Stripe</h4>
                <CardElement onChange={handleCardChange} />
              </div>
            )}
          </div>


          <div className="payment-section">
            <h3>Total: ${totalAmount.toFixed(2)}</h3>
            {paymentMethod === 1 && (
              <button onClick={handlePayment} disabled={isPayButtonDisabled}>
                Pay with Stripe
              </button>
            )}
            {paymentMethod === 0 && (
              <button onClick={handlePayment} disabled={isPayButtonDisabled}>
                Confirm Cash Payment
              </button>
            )}
          </div>


          {paymentStatus && <p className="payment-status">{paymentStatus}</p>}
        </div>
      </div>
    </div>

  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;