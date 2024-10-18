import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Edito = () => {
  const [inputs, setInputs] = useState({
    emri: "",
    mbiemri: "",
    emaili: "",
    grupi: "0", // Set a default value for grupi
    fjalekalimi: "",
  });

  const [errors, setErrors] = useState({
    emri: "",
    mbiemri: "",
    emaili: "",
    grupi: "",
    fjalekalimi: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const libriId = location.pathname.split("/")[3];

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        await axios.put("http://localhost:8800/api/perdoruesit", {
          ...inputs,
          perdoruesi_id: libriId, // Including current user's ID in the request body
        });
        navigate("/admin/shfaqPerdoruesit");
      } catch (err) {
        console.error("Error updating user:", err);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateInputs = (inputs) => {
    const errors = {};
    if (!inputs.emri) {
      errors.emri = "Emri eshte i detyrueshem";
    }
    if (!inputs.mbiemri) {
      errors.mbiemri = "Mbiemri eshte i detyrueshem";
    }
    if (!inputs.emaili) {
      errors.emaili = "Emaili eshte i detyrueshem";
    } else if (!/\S+@\S+\.\S+/.test(inputs.emaili)) {
      errors.emaili = "Emaili nuk eshte i vlefshem";
    }
    // Ensure the default value is acceptable
    if (!inputs.grupi) {
      errors.grupi = "Grupi eshte i detyrueshem";
    }
    if (!inputs.fjalekalimi) {
      errors.fjalekalimi = "Fjalekalimi eshte e detyrueshme";
    }
    return errors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/perdoruesit/${libriId}`
        );
        setInputs(res.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchData();
  }, [libriId]);

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Forma per editim te perdoruesit</h5>
            <span className="text-danger">* Obligueshme</span>
          </div>
          <div className="card-body">
            <form onSubmit={trajtoSubmit}>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Emri</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.emri && "is-invalid"}`}
                    placeholder="Emri"
                    onChange={trajtoNdryshimet}
                    name="emri"
                    value={inputs.emri}
                  />
                  {errors.emri && (
                    <div className="invalid-feedback">{errors.emri}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Mbiemri</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.mbiemri && "is-invalid"}`}
                    placeholder="Mbiemri"
                    onChange={trajtoNdryshimet}
                    name="mbiemri"
                    value={inputs.mbiemri}
                  />
                  {errors.mbiemri && (
                    <div className="invalid-feedback">{errors.mbiemri}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Email</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.emaili && "is-invalid"}`}
                    placeholder="Email"
                    onChange={trajtoNdryshimet}
                    name="emaili"
                    value={inputs.emaili}
                  />
                  {errors.emaili && (
                    <div className="invalid-feedback">{errors.emaili}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Grupi</label>
                <div className="col-sm-10">
                  <select
                    name="grupi"
                    onChange={trajtoNdryshimet}
                    className={`form-control ${errors.grupi && "is-invalid"}`}
                    value={inputs.grupi}
                  >
                    <option value="0">Perdorues</option>
                    <option value="1">Admin</option>
                  </select>
                  {errors.grupi && (
                    <div className="invalid-feedback">{errors.grupi}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Fjalekalimi</label>
                <div className="col-sm-10">
                  <input
                    type="password"
                    className={`form-control ${
                      errors.fjalekalimi && "is-invalid"
                    }`}
                    placeholder="Fjalekalimi"
                    onChange={trajtoNdryshimet}
                    name="fjalekalimi"
                  />
                  {errors.fjalekalimi && (
                    <div className="invalid-feedback">{errors.fjalekalimi}</div>
                  )}
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Ruaj Ndryshimet
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edito;
