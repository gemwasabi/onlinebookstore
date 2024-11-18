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
        const { name, email } = shippingInfo;
        return name.trim() !== "" && email.trim() !== "";
      };

      const isAddressValid = () => {
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
        return selectedAddressId !== "";
      };

      const isCardValid = () => {
        const cardElement = elements.getElement(CardElement);
        return cardElement && !cardElement.empty;
      };

      const isValid = isShippingInfoValid() && isAddressValid() && isCardValid();
      setIsPayButtonDisabled(!isValid);
    };

    validateForm();
  }, [shippingInfo, selectedAddressId, newAddress, elements]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  const handleNewAddressChange = (e) => {
    const { name, value } = e.target;
    setNewAddress({ ...newAddress, [name]: value });
  };

  const handleAddNewAddress = async () => {
    try {
      const response = await axios.post("http://localhost:8800/api/adresat", {
        ...newAddress,
        perdoruesi_id: userId,
      });
      alert("Adresa e re u shtua!");
      setSavedAddresses((prev) => [...prev, response.data]);
      setNewAddress({ shteti: "", qyteti: "", adresa: "", kodi_postar: "", telefoni: "" });
    } catch (error) {
      console.error("Error adding new address:", error);
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

  const handlePayment = async () => {
    if (!stripe || !elements) return;
  
    setPaymentStatus("Processing...");
  
    try {
      const secretResponse = await axios.post("http://localhost:8800/api/porosite/pagesa", {
        amount: totalAmount,
        currency: "eur",
      });
  
      const cardElement = elements.getElement(CardElement);
  
      const { error, paymentIntent } = await stripe.confirmCardPayment(secretResponse.data.clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });
  
      if (error) {
        setPaymentStatus(`Payment failed: ${error.message}`);
      } else if (paymentIntent.status === "succeeded") {
        setPaymentStatus("Payment successful!");
        console.log("PaymentIntent:", paymentIntent);
  
        // Save the order
        await saveOrder(paymentIntent.id);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setPaymentStatus("Payment failed. Please try again.");
    }
  };
  
  const saveOrder = async (paymentIntentId) => {
    if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
      setPaymentStatus("Please complete all required shipping information.");
      return;
    }
  
    try {
      const response = await axios.post("http://localhost:8800/api/porosite/ruaj-porosine", {
        userId,
        totalAmount,
        cartItems,
        shippingInfo: {
          address: shippingInfo.address,
          address2: shippingInfo.address2 || "",
          city: shippingInfo.city,
          postalCode: shippingInfo.postalCode,
          comment: shippingInfo.comment || "",
        },
        paymentIntentId,
      });
  
      console.log("Order saved:", response.data);
      setPaymentStatus("Order saved successfully!");
    } catch (error) {
      console.error("Error saving order:", error);
      setPaymentStatus("Error saving order.");
    }
  };
  

  if (!userId) {
    return <p>Ju lutem kyçyni para se të vazhdoni me blerjen.</p>;
  }
  return (
    <div className="payment-container">
      <h2>Checkout</h2>

      <div className="cart-items">
        {cartItems.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.foto || "default-image.jpg"} alt={item.title} className="book-image" />
            <div className="book-info">
              <h4>{item.titulli}</h4>
              <p>Çmimi: ${item.cmimi}</p>
              <div className="quantity-controls">
                <FaMinusCircle onClick={() => handleQuantityChange(item.id, -1)} />
                <span>{item.quantity}</span>
                <FaPlusCircle onClick={() => handleQuantityChange(item.id, 1)} />
              </div>
            </div>
            <FaTrashAlt onClick={() => setCartItems(cartItems.filter((book) => book.id !== item.id))} />
          </div>
        ))}
      </div>

      <div className="user-info">
        <h3>User Information</h3>
        <input
          type="text"
          name="name"
          value={shippingInfo.name}
          placeholder="Full Name"
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
        <h3>Shipping Address</h3>
        <select
          value={selectedAddressId}
          onChange={(e) => setSelectedAddressId(e.target.value)}
        >
          <option value="">Select an Address</option>
          {savedAddresses.map((address) => (
            <option key={address.id} value={address.id}>
              {`${address.adresa}, ${address.qyteti}, ${address.shteti} (${address.kodi_postar})`}
            </option>
          ))}
          <option value="new">Add New Address</option>
        </select>

        {selectedAddressId === "new" && (
          <div className="new-address-form">
            <input
              type="text"
              name="shteti"
              value={newAddress.shteti}
              placeholder="Country"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.shteti.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="qyteti"
              value={newAddress.qyteti}
              placeholder="City"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.qyteti.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="adresa"
              value={newAddress.adresa}
              placeholder="Address"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.adresa.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="kodi_postar"
              value={newAddress.kodi_postar}
              placeholder="Postal Code"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.kodi_postar.trim() === "" ? "red" : "" }}
            />
            <input
              type="text"
              name="telefoni"
              value={newAddress.telefoni}
              placeholder="Phone"
              onChange={handleNewAddressChange}
              style={{ borderColor: newAddress.telefoni.trim() === "" ? "red" : "" }}
            />
            <button onClick={handleAddNewAddress}>Shto adresën e re</button>
          </div>)}
      </div>

      <div className="payment-section">
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        <CardElement />
        <button onClick={handlePayment} disabled={isPayButtonDisabled}>
          Pay
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
