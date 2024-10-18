import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [librat, setLibrat] = useState([]);
  const [searchText, setSearchText] = useState("");

  const shlyejLibrin = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/librat/${id}`);
      fetchData();
      toast.success("Libri u shlye me sukses", {
        position: "top-right",
      });
    } catch (error) {
      console.log(error);
      toast.error("Ka ndodhur nje gabim gjate shlyerjes!", {
        position: "top-right",
      });
    }
  };

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/librat");
      setLibrat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { name: "#", selector: (row, index) => index + 1, sortable: true },
    { name: "Titulli", selector: (row) => row.titulli, sortable: true },
    { name: "Autori", selector: (row) => row.autori, sortable: true },
    { name: "ISBN", selector: (row) => row.isbn, sortable: true },
    { name: "Cmimi", selector: (row) => row.cmimi, sortable: true },
    { name: "Gjuha", selector: (row) => row.gjuha, sortable: true },
    {
      name: "Data Publikimit",
      selector: (row) => row.data_publikimit,
      sortable: true,
    },
    { name: "Tipi", selector: (row) => row.tipi, sortable: true },
    { name: "Pershkrimi", selector: (row) => row.pershkrimi, sortable: true },
    {
      name: "Foto",
      cell: (row) =>
        row.foto ? (
          <img
            src={`/assets/img/bookcovers/${row.foto}`}
            alt={row.titulli}
            style={{ width: "100px", height: "auto" }}
          />
        ) : null,
    },
    {
      name: "Aksion",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Link
            to={`/admin/editoLibrin/${row.id}`}
            className=""
            title="Edito"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 10px",
            }}
          >
            <i className="fas fa-pen text-primary" style={{ fontSize: "16px" }}></i>
          </Link>
          <span
            className=""
            onClick={() => shlyejLibrin(row.id)}
            title="Shlyej"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 10px",
            }}
          >
            <i className="fas fa-trash text-danger" style={{ fontSize: "16px" }}></i>
          </span>
        </div>
      ),
    },
  ];

  const filteredData = librat.filter(
    (liber) =>
      liber.titulli.toLowerCase().includes(searchText.toLowerCase()) ||
      liber.autori.toLowerCase().includes(searchText.toLowerCase()) ||
      liber.isbn.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <div className="d-flex justify-content-between mb-3">
              <Link to="/admin/shtoLiber" className="btn btn-info">
                + Shto Liber
              </Link>
              <input
                type="text"
                placeholder="Search..."
                onChange={(e) => setSearchText(e.target.value)}
                className="form-control"
                style={{ width: "300px" }}
              />
            </div>
            <DataTable
              columns={columns}
              data={filteredData}
              pagination
              paginationPerPage={10}
              paginationRowsPerPageOptions={[10, 20, 30]}
              subHeader
            />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Lista;
