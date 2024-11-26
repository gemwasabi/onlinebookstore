import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import SfondiSidebar from "./SfondiSiderbar";
import { AuthContext } from "../context/authContext";

const OrdersPage = () => {
  const [porosite, setPorosite] = useState([]);
  const [faqjaAktuale, caktoFaqjaAktuale] = useState(1);
  const [loading, setLoading] = useState(true); // Handle loading state
  const [error, setError] = useState(null); // Handle errors
  const { currentUser } = useContext(AuthContext);

  const porositePerFaqe = 10;

  useEffect(() => {
    const fetchPorosite = async () => {
      if (!currentUser?.id) {
        console.warn("No currentUser found, skipping fetch.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `http://localhost:8800/api/porosite/${currentUser.id}`
        );
        console.log("Fetched orders:", response.data);
        setPorosite(response.data || []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Ka ndodhur një gabim gjatë ngarkimit të porosive.");
      } finally {
        setLoading(false);
      }
    };

    fetchPorosite();
  }, [currentUser]);

  // Pagination logic
  const indeksiFunditPorosise = faqjaAktuale * porositePerFaqe;
  const indeksiParePorosise = indeksiFunditPorosise - porositePerFaqe;
  const porositeAktuale = porosite.slice(
    indeksiParePorosise,
    indeksiFunditPorosise
  );
  const totalFaqe = Math.ceil(porosite.length / porositePerFaqe);

  const ndryshoFaqen = (numriFaqes) => {
    caktoFaqjaAktuale(numriFaqes);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#7B8E76]">
      {/* Sidebar */}
      <SfondiSidebar />

      {/* Main Content */}
      <div className="flex-1 p-6 lg:p-10 bg-[#BCC5B8]">
        {loading ? (
          <p className="text-[#757C73]">Po ngarkohen porositë...</p>
        ) : error ? (
          <p className="text-[#D9534F]">{error}</p>
        ) : porosite.length === 0 ? (
          <p className="text-[#757C73]">Nuk u gjet asnjë porosi.</p>
        ) : (
          <>
            <table className="w-full table-auto bg-[#D3DAD1] shadow-lg rounded-lg">
              <thead>
                <tr className="bg-[#7B8E76] text-white text-left">
                  <th className="p-4">ID e Porosisë</th>
                  <th className="p-4">Data</th>
                  <th className="p-4">Totali (€)</th>
                  <th className="p-4">Metoda e Transportit</th>
                  <th className="p-4">Statusi i Pagesës</th>
                  <th className="p-4">Artikujt</th>
                </tr>
              </thead>
              <tbody>
  {porositeAktuale.map((porosi) => (
    <tr
      key={porosi.porosiId}
      className="border-t hover:bg-[#BCC5B8] transition-colors"
    >
      <td className="p-4">{porosi.porosiId}</td>
      <td className="p-4">
        {porosi.data
          ? new Date(porosi.data).toLocaleDateString("sq-AL")
          : "Data e panjohur"}
      </td>
      <td className="p-4">
        €{porosi.totali ? parseFloat(porosi.totali).toFixed(2) : "0.00"}
      </td>
      <td className="p-4">
        {porosi.transport_method === 0
          ? "E merr ne dyqan"
          : porosi.transport_method === 1
          ? "Posta"
          : "E panjohur"}
      </td>
      <td className="p-4">
        {porosi.payment_status === 1
          ? "Paguar"
          : porosi.payment_status === 0
          ? "Jo e paguar"
          : "Status i panjohur"}
      </td>
      <td className="p-4">
        <ul className="list-disc list-inside text-[#727D6D]">
          {Array.isArray(porosi.artikujt) && porosi.artikujt.length > 0 ? (
            porosi.artikujt.map((artikull, index) => (
              <li key={index}>
                {artikull.titulliLibrit || "Artikull i panjohur"} ({artikull.sasia}x €
                {artikull.cmimi})
              </li>
            ))
          ) : (
            <li>Nuk ka artikuj në këtë porosi.</li>
          )}
        </ul>
      </td>
    </tr>
  ))}
</tbody>


            </table>

            {/* Pagination */}
            <div className="pagination mt-6 flex justify-center items-center">
              <button
                onClick={() => ndryshoFaqen(faqjaAktuale - 1)}
                disabled={faqjaAktuale === 1}
                className="mx-2 px-4 py-2 bg-[#757C73] text-white rounded-lg hover:bg-[#51584F] disabled:opacity-50"
              >
                Para
              </button>
              {[...Array(totalFaqe)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => ndryshoFaqen(i + 1)}
                  className={`mx-2 px-4 py-2 rounded-lg ${faqjaAktuale === i + 1
                      ? "bg-[#7B8E76] text-white"
                      : "bg-[#BCC5B8] text-[#51584F] hover:bg-[#757C73]"
                    }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                onClick={() => ndryshoFaqen(faqjaAktuale + 1)}
                disabled={faqjaAktuale === totalFaqe}
                className="mx-2 px-4 py-2 bg-[#757C73] text-white rounded-lg hover:bg-[#51584F] disabled:opacity-50"
              >
                Pas
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
