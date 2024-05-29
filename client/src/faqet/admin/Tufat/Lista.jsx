import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [tufat, setTufat] = useState([]);

  const shlyejTufen = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/tufat/${id}`);
      fetchData();
      toast.success("Tufa u shlye me sukses", {
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
      const res = await axios.get("http://localhost:8800/api/tufat");
      setTufat(res.data);
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
            <Link to="/admin/shtoTufe" className="btn btn-info mb-3">
              + Shto Tufë
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emri</th>
                  <th scope="col">Statusi</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {tufat.map((tufa, index) => (
                  <tr key={tufa.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{tufa.emri}</td>
                    <td>
                      {tufa.statusi === 0 ? (
                        <span className="badge bg-success">Aktive</span>
                      ) : (
                        <span className="badge bg-secondary">Jo Aktive</span>
                      )}
                    </td>
                    <td>
                      <Link
                        to={"/admin/editoTufen/" + tufa.id}
                        className="btn btn-info"
                      >
                        Edito
                      </Link>{" "}
                      <button
                        className="btn btn-danger"
                        onClick={() => shlyejTufen(tufa.id)}
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
