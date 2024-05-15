import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [kategorite, setKategorite] = useState([]);

  const shlyejKategorine = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/kategorite/${id}`);
      fetchData();
      toast.success("Kategoria u shlye me sukses", {
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
      const res = await axios.get("http://localhost:8800/api/kategorite");
      setKategorite(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link
              to="/admin/kategorite/shtoKategori"
              className="btn btn-info mb-3"
            >
              + Shto Kategori
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emri</th>
                  <th scope="col">Pershkrimi</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {kategorite.map((kategoria, index) => (
                  <tr key={kategoria.id}>
                    <th scope="row">{kategoria.id}</th>
                    <td>{kategoria.emri}</td>
                    <td>{kategoria.pershkrimi}</td>
                    <td>
                      <Link
                        to={"/admin/kategorite/editoKategorine/" + kategoria.id}
                        className="btn btn-info"
                      >
                        Edito
                      </Link>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => shlyejKategorine(kategoria.id)}
                      >
                        Shlyej
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer /> {/* To render toast notifications */}
    </div>
  );
}

export default Lista;
