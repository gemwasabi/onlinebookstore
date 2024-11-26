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
      const res = await axios.get("http://localhost:8800/api/librat/simple");
      setLibrat(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    {
      name: "#",
      selector: (row, index) => index + 1,
      sortable: true,
      style: { width: "50px" },
    },
    {
      name: "Titulli",
      selector: (row) => row.titulli,
      sortable: true,
      style: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Autori",
      selector: (row) => row.autori,
      sortable: true,
      style: {
        maxWidth: "150px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "ISBN",
      selector: (row) => row.isbn,
      sortable: true,
      style: {
        maxWidth: "150px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    {
      name: "Cmimi",
      selector: (row) => row.cmimi,
      sortable: true,
      style: { width: "100px" },
    },
    {
      name: "Gjuha",
      selector: (row) => row.gjuha,
      sortable: true,
      style: { width: "120px" },
    },
    {
      name: "Data Publikimit",
      selector: (row) => row.data_publikimit,
      sortable: true,
      style: { width: "150px" },
    },
    {
      name: "Tipi",
      selector: (row) => row.tipi,
      sortable: true,
      style: { width: "100px" },
    },
    {
      name: "Pershkrimi",
      selector: (row) => row.pershkrimi,
      sortable: true,
      style: {
        maxWidth: "200px",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
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
      style: { width: "120px" },
    },
    {
      name: "Aksion",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Link
            to={`/admin/editoLibrin/${row.id}`}
            title="Edito"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 10px",
            }}
          >
            <i
              className="fas fa-pen text-primary"
              style={{ fontSize: "16px" }}
            ></i>
          </Link>
          <span
            onClick={() => shlyejLibrin(row.id)}
            title="Shlyej"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "5px 10px",
            }}
          >
            <i
              className="fas fa-trash text-danger"
              style={{ fontSize: "16px" }}
            ></i>
          </span>
        </div>
      ),
      style: { width: "150px" },
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
