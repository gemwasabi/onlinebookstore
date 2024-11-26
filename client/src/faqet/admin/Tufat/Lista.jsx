import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [tufat, setTufat] = useState([]);
  const navigate = useNavigate();

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
      console.log("API Response Data:", res.data); // Debug: Log API response data

      // Ensure res.data is an array
      if (Array.isArray(res.data)) {
        setTufat(res.data);
      } else {
        console.error("Unexpected API response format:", res.data);
        setTufat([]); // Default to an empty array in case of unexpected format
      }
    } catch (error) {
      console.log(error);
      setTufat([]); // Default to an empty array in case of error
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
                  <th className="w-10" scope="col">
                    #
                  </th>
                  <th className="w-[70%]" scope="col">
                    Emri
                  </th>
                  <th className="w-20" scope="col">
                    Statusi
                  </th>
                  <th className="w-20" scope="col">
                    Aksion
                  </th>
                </tr>
              </thead>
              <tbody>
                {tufat.length > 0 ? (
                  tufat.map((tufa, index) => (
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
                        <div style={{ display: "flex", gap: "5px" }}>
                          <Link
                            to={`/admin/editoTufen/${tufa.id}`}
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
                            onClick={() => shlyejTufen(tufa.id)}
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
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Nuk ka të dhëna për të treguar.</td>
                  </tr>
                )}
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
