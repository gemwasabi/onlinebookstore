import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../../context/authContext";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { FaTrashAlt, FaPlusCircle, FaMinusCircle } from "react-icons/fa";
import "../../../public/checkout.css";

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

  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

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
      };

      const isCardValid = () => {
        const cardElement = elements.getElement(CardElement);
        return cardElement && !cardElement.empty;
      };

      const isValid = isShippingInfoValid() && isCardValid();
      setIsPayButtonDisabled(!isValid);
    };

    validateForm();
  }, [shippingInfo, selectedAddressId, newAddress, elements, savedAddresses]);

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

    if (selectedId !== "new") {
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
          throw new Error(error?.message || "Pagesa juaj me Stripe deshtoi.");
        }

        await saveOrder(paymentIntent.id, 1); // Stripe 
        setPaymentStatus("Payment successful!");
      } else {
        await saveOrder(null, 0); // Cash
        setPaymentStatus("Pagesa juaj ishte e suksesshme, do te paguani tek postieri.");
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
    const shippingDetails =
      selectedAddressId === "new"
        ? { ...newAddress }
        : savedAddresses.find((address) => address.id === parseInt(selectedAddressId));

    if (!shippingDetails) {
      setPaymentStatus("Detajet e adresës nuk janë të sakta.");
      return;
    }

    const orderData = {
      userId,
      totalAmount,
      cartItems,
      shippingInfo: shippingDetails,
      transportMethod: transportMethod === "pickup" ? 0 : 1, // 0 for pickup, 1 for transport
      paymentIntentId,
      paymentMethod: method, // 1: Stripe, 0: Cash
    };

    try {
      await axios.post("http://localhost:8800/api/porosite/ruaj-porosine", orderData);
    } catch (error) {
      throw new Error("Gabim gjatë ruajtjes së porosisë.");
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



  if (!userId) {
    return <p>Ju lutem kyçyni para se të vazhdoni me blerjen.</p>;
  }
  return (
    <div className="payment-container">
      <h2>Checkout</h2>

      <div className="cart-items">
        {cartItems.length === 0 ? (
          <p>Shporta juaj eshte bosh.</p>
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
                <p>Çmimi: ${item.cmimi}</p>
                <div className="quantity-controls">
                  <FaMinusCircle onClick={() => handleQuantityChange(item.id, -1)} />
                  <span>{item.quantity}</span>
                  <FaPlusCircle onClick={() => handleQuantityChange(item.id, 1)} />
                </div>
              </div>
              <FaTrashAlt onClick={() => handleRemoveBook(item.shporta_id)} />
            </div>
          ))
        )}
      </div>


      <div className="user-info">
        <h3>User Information</h3>
        <input
          type="text"
          name="name"
          value={shippingInfo.name}
          placeholder="Emri juaj"
          onChange={handleInputChange}
          style={{ borderColor: shippingInfo.name.trim() === "" ? "red" : "" }}
        />
        <input
          type="email"
          name="email"
          value={shippingInfo.email}
          placeholder="Email"
          onChange={handleInputChange}
          style={{ borderColor: shippingInfo.email.trim() === "" ? "red" : "" }}
        />
      </div>

      <div className="address-info">
        <h3>Adresa e transportit</h3>
        <select
          value={selectedAddressId}
          onChange={handleAddressChange}
        >
          <option value="">Select an Address</option>
          {savedAddresses.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.adresa}, ${address.qyteti}, ${address.shteti} (${address.kodi_postar})`}
            </option>
          ))}
          <option value="new">Shto nje adrese te re</option>
        </select>


        {selectedAddressId === "new" && (
          <div className="new-address-form">
            <input
              type="text"
              name="shteti"
              value={newAddress.shteti}
              placeholder="Shteti"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.shteti.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="qyteti"
              value={newAddress.qyteti}
              placeholder="Qyteti"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.qyteti.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="adresa"
              value={newAddress.adresa}
              placeholder="Adresa"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.adresa.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="kodi_postar"
              value={newAddress.kodi_postar}
              placeholder="Kodi postar"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.kodi_postar.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="telefoni"
              value={newAddress.telefoni}
              placeholder="Telefoni"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.telefoni.trim() === "" ? "red" : "" }}
            />
            <button onClick={handleAddNewAddress}>Shto adresën e re</button>
          </div>)}
      </div>
      <div className="transport-method">
        <h3>Metoda e Transportit</h3>
        <select value={transportMethod} onChange={(e) => setTransportMethod(e.target.value)}>
          <option value="pickup">Merre vet (0€)</option>
          <option value="transport">Transporto (2€)</option>
        </select>
      </div>

      <div className="payment-method">
        <h3>Metoda e pageses</h3>
        <select value={paymentMethod} onChange={handlePaymentMethodChange}>
          <option value="stripe">Paguaj me kartele (Stripe)</option>
          <option value="cash">Paguaj me para ne dore</option>
        </select>
      </div>
      <div className="payment-status">
        <h3>Statusi i pageses: {paymentStatus || "N/A"}</h3>
      </div>


      <div className="payment-section">
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        <CardElement />
        <button onClick={handlePayment} disabled={isPayButtonDisabled}>
          Paguaj
        </button>
      </div>
      {paymentStatus && <p>{paymentStatus}</p>}

    </div>);
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;