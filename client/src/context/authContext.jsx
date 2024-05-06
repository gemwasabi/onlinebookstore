import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("perdoruesi") || null)
  );

  const kycu = async (inputs) => {
    const res = await axios.post("http://localhost:8800/api/auth/kycu", inputs);
    setCurrentUser(res.data);
  };

  const ckycu = async (inputs) => {
    await axios.post("http://localhost:8800/api/auth/ckycu");
    setCurrentUser(null);
  };

  useEffect(() => {
    localStorage.setItem("perdoruesi", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, kycu, ckycu }}>
      {children}
    </AuthContext.Provider>
  );
};
