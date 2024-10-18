import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component"; // Assuming you're using a library like react-data-table-component
import { Link } from "react-router-dom";

function CategoriesList() {
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/kategorite");
      setCategories(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Emri", selector: (row) => row.emri, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <Link
            to={`/admin/editoKategorine/${row.id}`}
            className=""
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
            className=""
            onClick={() => handleDelete(row.id)}
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
    },
  ];

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/kategorite/${id}`);
      fetchCategories();
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link to="/admin/shtoKategorine" className="btn btn-info mb-3">
              + Shto Kategori
            </Link>
            <DataTable columns={columns} data={categories} pagination />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CategoriesList;
