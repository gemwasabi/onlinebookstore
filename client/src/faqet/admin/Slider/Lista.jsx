import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/authContext";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

  return (
    <div className="row">
      <div className="col-12">
        <div className="card">
          <div className="card-body">
            <Link to="/admin/shtoSlider" className="btn btn-info mb-3">
              + Shto Foto
            </Link>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">Foto</th>
                  <th scope="col">Aksion</th>
                </tr>
              </thead>
              <tbody>
                {slider.map((s, index) => (
                  <tr key={s.id}>
                    <th scope="row">{index + 1}</th>
                    <td>
                      <img
                        src={`/assets/img/slider/${s.foto}`}
                        alt="Slider"
                        style={{
                          width: "100px",
                          height: "auto",
                          objectFit: "cover",
                        }}
                      />
                    </td>
                    <td>
                      <button
                        className="btn btn-danger"
                        onClick={() => shlyejSlider(s.id)}
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
