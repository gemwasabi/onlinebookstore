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
  const [clientSecret, setClientSecret] = useState("");
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


  useEffect(() => {
    const fetchCartAndSecret = async () => {
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

        const secretResponse = await axios.post("http://localhost:8800/api/porosite/pagesa", {
          amount: calculateTotal(itemsWithQuantity),
          currency: "euro",
        });

        setClientSecret(secretResponse.data.clientSecret);
      } catch (error) {
        console.error("Error setting up payment:", error);
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
    fetchCartAndSecret();
    if (userId) fetchAddresses();
  }, [userId]);

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
      alert("New address added!");
      setSavedAddresses((prev) => [...prev, response.data]);
      setNewAddress({ shteti: "", qyteti: "", adresa: "", kodi_postar: "", telefoni: "" });
    } catch (error) {
      console.error("Error adding new address:", error);
    }
  };

  useEffect(() => {
    const calculateTotal = (items) =>
      items.reduce((total, item) => total + item.cmimi * item.quantity, 0);
    setTotalAmount(calculateTotal(cartItems));
  }, [cartItems]);


  const handleQuantityChange = (bookId, change) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === bookId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingInfo({ ...shippingInfo, [name]: value });
  };

  useEffect(() => {
    setShippingInfo((prevInfo) => ({
      ...prevInfo,
      name: currentUser?.emri || "",
      email: currentUser?.emaili || "",
    }));
  }, [currentUser]);


  const handlePayment = async () => {
    if (!stripe || !elements || !clientSecret) return;

    setPaymentStatus("Processing...");

    const cardElement = elements.getElement(CardElement);

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });

    if (error) {
      setPaymentStatus(`Payment failed: ${error.message}`);
    } else if (paymentIntent.status === "succeeded") {
      setPaymentStatus("Payment successful!");
      console.log("PaymentIntent:", paymentIntent);
    }
  };

  if (!userId) {
    return <p>Ju lutem kyçyni para se të vazhdoni me blerjen. </p>;
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
        />
        <input
          type="email"
          name="email"
          value={shippingInfo.email}
          placeholder="Email"
          onChange={handleInputChange}
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
            />
            <input
              type="text"
              name="qyteti"
              value={newAddress.qyteti}
              placeholder="City"
              onChange={handleNewAddressChange}
            />
            <input
              type="text"
              name="adresa"
              value={newAddress.adresa}
              placeholder="Address"
              onChange={handleNewAddressChange}
            />
            <input
              type="text"
              name="kodi_postar"
              value={newAddress.kodi_postar}
              placeholder="Postal Code"
              onChange={handleNewAddressChange}
            />
            <input
              type="text"
              name="telefoni"
              value={newAddress.telefoni}
              placeholder="Phone"
              onChange={handleNewAddressChange}
            />
            <button onClick={handleAddNewAddress}>Add Address</button>
          </div>
        )}
      </div>

      <div className="payment-section">
        <h3>Total: ${totalAmount.toFixed(2)}</h3>
        <CardElement />
        <button onClick={handlePayment} disabled={!stripe || !clientSecret}>
          Pay
        </button>
      </div>

      {paymentStatus && <p>{paymentStatus}</p>}
    </div>
  );
};

const PaymentPage = () => (
  <Elements stripe={stripePromise}>
    <PaymentForm />
  </Elements>
);

export default PaymentPage;
