import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";

function Lista() {
  const { currentUser, ckycu } = useContext(AuthContext);
  const [librat, setPerdoruesit] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/perdoruesit");
        setPerdoruesit(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link to="/admin/perdoruesit/shtoPerdorues" className="btn btn-info mb-3">
              + Shto Perdorues
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Emri</th>
                  <th scope="col">Mbiemri</th>
                  <th scope="col">Emaili</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {librat.map((libri, index) => (
                  <tr key={libri.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{libri.emri}</td>
                    <td>{libri.mbiemri}</td>
                    <td>{libri.emaili}</td>
                    <td>
                      <button className="btn btn-info">Edito</button>{" "}
                      <button className="btn btn-danger">Shlyej</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Lista;
