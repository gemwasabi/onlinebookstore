import React, { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";
import axios from "axios";
import CardAccordion from "./CardAccordion"; // Updated import to use CardAccordion
import SfondiSiderbar from "./SfondiSiderbar";

const UserSettings = () => {
  const [cards, setCards] = useState([]); // Renamed from addresses to cards
  const [error, setError] = useState("");
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser.id) {
      fetchCards(); // Updated to fetch cards
    } else {
      setError("User not logged in");
    }
  }, [currentUser]);

  const fetchCards = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8800/api/kartela/${currentUser.id}` // Adjusted endpoint to cards
      );
      setCards(response.data);
    } catch (err) {
      setError("Failed to fetch cards");
      console.error(err);
    }
  };

  const shtoKartelen = async (newCard) => {
    // Renamed from shtoAdresen to shtoKartelen
    try {
      await axios.post("http://localhost:8800/api/kartela", {
        ...newCard,
        perdoruesi_id: currentUser.id,
      });
      alert("Kartela u shtua me sukses.");
      fetchCards(); // Refetch cards after addition
    } catch (err) {
      const errorMessage = err.response
        ? err.response.data
          ? err.response.data
          : "Një gabim ndodhi gjatë përpjekjes për të shtuar kartelën."
        : "Një gabim ndodhi gjatë përpjekjes për të shtuar kartelën.";

      setError(errorMessage);
      console.error("Error adding card:", errorMessage);
    }
  };

  const editoKartelen = async (index, updatedCard) => {
    // Renamed from editoAdresen to editoKartelen
    const cardId = cards[index].id;
    try {
      await axios.put(
        `http://localhost:8800/api/kartela/${cardId}`,
        updatedCard
      );
      alert("Kartela u editua me sukses.");
      fetchCards(); // Refetch cards after update
    } catch (err) {
      setError(err.response.data);
      console.error(err);
    }
  };

  const shlyejKartelen = async (index) => {
    // Renamed from shlyejAdresen to shlyejKartelen
    const cardId = cards[index].id;
    try {
      await axios.delete(`http://localhost:8800/api/kartela/${cardId}`);
      alert("Kartela u shlye me sukses.");
      fetchCards(); // Refetch cards after deletion
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
        <CardAccordion key={0} card={{}} isNew={true} onAdd={shtoKartelen} />
        {cards.map((card, index) => (
          <CardAccordion
            key={card.id}
            card={card}
            index={index}
            onEdit={editoKartelen}
            onDelete={shlyejKartelen}
          />
        ))}
      </div>
    </div>
  );
};

export default UserSettings;
