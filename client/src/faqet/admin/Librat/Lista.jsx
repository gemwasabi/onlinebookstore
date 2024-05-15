import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [librat, setLibrat] = useState([]);

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

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link to="/admin/librat/shtoLiber" className="btn btn-info mb-3">
              + Shto Liber
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emri</th>
                  <th scope="col">ISBN</th>
                  <th scope="col">Kategoria</th>
                  <th scope="col">Pershkrimi</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {librat.map((libri, index) => (
                  <tr key={libri.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{libri.emri}</td>
                    <td>{libri.isbn}</td>
                    <td>{libri.emri_kategorise}</td>
                    <td>{libri.pershkrimi}</td>
                    <td>
                      <Link to={'/admin/librat/editoLibrin/' + libri.id} className="btn btn-info">Edito</Link>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => shlyejLibrin(libri.id)}
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
      <ToastContainer />
    </div>
  );
}

export default Lista;
