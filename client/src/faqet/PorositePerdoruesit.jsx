import React, { useState } from "react";
import SfondiSidebar from "./SfondiSiderbar";

const OrdersPage = () => {
  const porositeMock = Array.from({ length: 30 }, (_, index) => ({
    porosiId: 130 - index,
    dataPorosise: `2024-11-${30 - (index % 30)}`,
    totali: (Math.random() * 100).toFixed(2),
    metodaTransporti: index % 2 === 0 ? "Transport" : "Merre vetë",
    artikujt: [
      { titulliLibrit: "Kodi i Da Vinçit", sasia: 1, cmimi: "12.99" },
      { titulliLibrit: "Arti i Luftës", sasia: 2, cmimi: "7.50" },
      ...(index % 3 === 0
        ? [{ titulliLibrit: "Lufta dhe Paqja", sasia: 1, cmimi: "15.00" }]
        : []),
    ],
  }));

  const [porosite] = useState(porositeMock);
  const [faqjaAktuale, caktoFaqjaAktuale] = useState(1);
  const porositePerFaqe = 10;

  const indeksiFunditPorosise = faqjaAktuale * porositePerFaqe;
  const indeksiParePorosise = indeksiFunditPorosise - porositePerFaqe;
  const porositeAktuale = porosite.slice(indeksiParePorosise, indeksiFunditPorosise);
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
        {porosite.length === 0 ? (
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
                      {new Date(porosi.dataPorosise).toLocaleDateString("sq-AL")}
                    </td>
                    <td className="p-4">€{parseFloat(porosi.totali).toFixed(2)}</td>
                    <td className="p-4">{porosi.metodaTransporti}</td>
                    <td className="p-4">
                      <ul className="list-disc list-inside text-[#727D6D]">
                        {porosi.artikujt.map((artikull, index) => (
                          <li key={index}>
                            {artikull.titulliLibrit} ({artikull.sasia}x €{artikull.cmimi})
                          </li>
                        ))}
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
                  className={`mx-2 px-4 py-2 rounded-lg ${
                    faqjaAktuale === i + 1
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
