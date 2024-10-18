import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import axios from "axios";
import DataTable from "react-data-table-component";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [slider, setSlider] = useState([]);

  const shlyejSlider = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/slider/${id}`);
      fetchData();
      toast.success("Fotoja u shlye me sukses", {
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
      const res = await axios.get("http://localhost:8800/api/slider");
      if (Array.isArray(res.data)) {
        setSlider(res.data);
      } else {
        setSlider([]);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const columns = [
    { name: "#", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Foto",
      selector: (row) => (
        <img
          src={`/assets/img/slider/${row.foto}`}
          alt="Slider"
          style={{
            width: "100px",
            height: "auto",
            objectFit: "cover",
          }}
        />
      ),
      sortable: false,
    },
    {
      name: "Aksion",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <button
            className=""
            onClick={() => shlyejSlider(row.id)}
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
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link to="/admin/shtoSlider" className="btn btn-info mb-3">
              + Shto Foto
            </Link>
            <DataTable columns={columns} data={slider} pagination />
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Lista;
