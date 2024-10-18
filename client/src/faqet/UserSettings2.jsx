import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import AddressAccordion from "./AddressAccordion";
import SfondiSiderbar from "./SfondiSiderbar";

const UserSettings = () => {
  const [addresses, setAddresses] = useState([]);
  const [error, setError] = useState("");
  const { currentUser, ckycu } = useContext(AuthContext);

  useEffect(() => {
    // Simulate fetching current user from local storage
    if (currentUser.id) {
      // setCurrentUser(user);
      fetchAddresses(currentUser.id);
    } else {
      setError("User not logged in");
    }
  }, []);

  const fetchAddresses = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/adresat/${currentUser.id}`
      );
      setAddresses(response.data);
    } catch (err) {
      setError("Failed to fetch addresses");
      console.error(err);
    }
  };

  const shtoAdresen = async (newAddress) => {
    try {
      await axios.post("http://localhost:8800/api/adresat", {
        ...newAddress,
        perdoruesi_id: currentUser.id,
      });
      alert("Adresa u shtua me sukses.");
      fetchAddresses();
    } catch (err) {
      // Ensure `err.response` exists and handle the error properly
      const errorMessage = err.response
        ? err.response.data
          ? err.response.data
          : "Një gabim ndodhi gjatë përpjekjes për të shtuar adresën."
        : "Një gabim ndodhi gjatë përpjekjes për të shtuar adresën.";

      setError(errorMessage);
      console.error("Error adding address:", errorMessage);
    }
  };

  const editoAdresen = async (index, updatedAddress) => {
    const addressId = addresses[index].id;
    try {
      await axios.put(
        `http://localhost:8800/api/adresat/${addressId}`,
        updatedAddress
      );
      alert("Adresa u editua me sukses.");
      fetchAddresses();
    } catch (err) {
      setError(err.response.data);
      console.error(err);
    }
  };

  const shlyejAdresen = async (index) => {
    const addressId = addresses[index].id;
    try {
      await axios.delete(`http://localhost:8800/api/adresat/${addressId}`);
      alert("Adresa u shlye me sukses.");
      fetchAddresses();
    } catch (err) {
      setError(err.response.data);
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#8E9A83]">
      <SfondiSiderbar />

      <div className="flex-1 p-4 lg:p-10 bg-[#BCC5B8] flex flex-col">
        {error && <div className="text-red-500">{error}</div>}
        <AddressAccordion
          key={0}
          address={{}}
          isNew={true}
          onAdd={shtoAdresen}
        />
        {addresses.map((address, index) => (
          <AddressAccordion
            key={address.id}
            address={address}
            index={index}
            onEdit={editoAdresen}
            onDelete={shlyejAdresen}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
