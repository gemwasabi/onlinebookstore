import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [perdoruesit, setPerdoruesit] = useState([]);

  const shlyejPerdoruesin = async (id) => {
    try {
      await axios.delete(`http://localhost:8800/api/perdoruesit/${id}`);
      fetchData();
      toast.success("Perdoruesi u shlye me sukses", {
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
      const res = await axios.get("http://localhost:8800/api/perdoruesit");
      setPerdoruesit(res.data);
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
            <Link to="/admin/shtoPerdorues" className="btn btn-info mb-3">
              + Shto Perdorues
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emri</th>
                  <th scope="col">Mbiemri</th>
                  <th scope="col">Emaili</th>
                  <th scope="col">Grupi</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {perdoruesit.map((perdoruesi, index) => (
                  <tr key={perdoruesi.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{perdoruesi.emri}</td>
                    <td>{perdoruesi.mbiemri}</td>
                    <td>{perdoruesi.emaili}</td>
                    <td>{perdoruesi.grupi == 0 ? "Perdorues" : "Admin"}</td>
                    <td>
                      <div style={{ display: "flex", gap: "5px" }}>
                        <Link
                          to={`/admin/editoPerdoruesin/${perdoruesi.id}`}
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
                          onClick={() => shlyejPerdoruesin(perdoruesi.id)}
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
