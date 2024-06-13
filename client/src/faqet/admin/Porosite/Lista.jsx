import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [porosite, setPorosite] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/porosite");
      setPorosite(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { name: '#', selector: (row, index) => index + 1, sortable: true },
    { name: 'Perdoruesi', selector: row => row.perdoruesi_id, sortable: true },
    { name: 'Data', selector: row => row.data, sortable: true },
    { name: 'Totali', selector: row => row.totali, sortable: true },
    { name: 'Statusi', selector: row => row.statusi, sortable: true },
    { name: 'Adresa 1', selector: row => row.adresa_1, sortable: true },
    { name: 'Adresa 2', selector: row => row.adresa_2, sortable: true },
    { name: 'Qyteti', selector: row => row.qyteti, sortable: true },
    { name: 'Kodi Postar', selector: row => row.kodi_postar, sortable: true },
    { name: 'Komenti Shtese', selector: row => row.konenti_shtese, sortable: true },
    { name: 'Aksion', cell: row => <button>Action</button> }
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <DataTable
              columns={columns}
              data={porosite}
              pagination
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Lista;
