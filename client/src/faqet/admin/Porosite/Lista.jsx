import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  console.log("Lista component rendered");
  const { currentUser, ckycu } = useContext(AuthContext);
  const [porosite, setPorosite] = useState([]);

  const fetchData = async () => {
    console.log("Fetching data...");
    try {
      const res = await axios.get("http://localhost:8800/api/porosite");
      setPorosite(res.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };


  useEffect(() => {
    console.log("useEffect triggered to fetch data");
    fetchData();
  }, []);

  useEffect(() => {
    console.log("Updated Porosite Data:", porosite);
  }, [porosite]);

  const handleStatusChange = async (id) => {
    console.log("Updating order with ID:", id);
    try {
      const res = await axios.put("http://localhost:8800/api/porosite/status", { id });
      console.log("API Response:", res.data);
      toast.success(res.data.message);
      fetchData();
    } catch (error) {
      console.error("Error updating payment status:", error);
      toast.error("Gabim në ndryshimin e statusit.");
    }
  };

  const columns = [
    { name: "#", selector: (row, index) => index + 1, sortable: true },
    { name: "Data", selector: (row) => row.data, sortable: true },
    {
      name: "Perdoruesi",
      selector: (row) => row.perdoruesi,
      sortable: true,
    },
    { name: "Totali", selector: (row) => row.totali + "€", sortable: true },
    { name: "Qyteti", selector: (row) => row.qyteti, sortable: true },
    {
      name: "Statusi",
      selector: (row, index) => {
        console.log("Rendering Dropdown for ID:", row.id);
        return (
          <select
            key={`status-${row.id}-${index}`}
            value={row.payment_status || 0}
            onChange={() => {
              console.log("Dropdown changed for ID:", row.id);
              handleStatusChange(row.id);
            }}
            className="form-control"
          >
            <option value={0}>Jo e paguar</option>
            <option value={1}>Paguar</option>
          </select>
        );
      },
      sortable: true,
    },
    {
      name: "Aksion",
      cell: (row, index) => (
        <Link
          key={`action-${row.id}-${index}`}
          to={`http://localhost:5173/admin/porosia/${row.id}`}
          className="btn btn-info"
        >
          Shfaq
        </Link>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <DataTable
              columns={columns}
              data={porosite.map((row, index) => ({
                ...row,
                unique_id: `${row.id}-${index}`,
              }))}
              pagination
              keyField="unique_id"
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Lista;
