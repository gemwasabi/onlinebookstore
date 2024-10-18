import React, { useContext, useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";

function Shto() {
  const [inputs, setInputs] = useState({
    emri: "",
    mbiemri: "",
    emaili: "",
    grupi: "",
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

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        await axios.post("http://localhost:8800/api/perdoruesit", inputs);
        navigate("/admin/shfaqPerdoruesit");
      } catch (err) {
        console.log(err);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateInputs = (inputs) => {
    const errors = {};
    if (!inputs.emri) {
      errors.emri = "Titulli eshte i detyrueshem";
    }
    if (!inputs.mbiemri) {
      errors.mbiemri = "Mbiemri eshte i detyrueshem";
    }
    if (!inputs.emaili) {
      errors.emaili = "Emaili eshte i detyrueshem";
    }
    if (!inputs.grupi) {
      errors.grupi = "Grupi eshte i detyrueshem";
    }
    if (!inputs.fjalekalimi) {
      errors.fjalekalimi = "Fjalekalimi eshte e detyrueshme";
    }
    return errors;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Forma per shtim te librit</h5>
            <span className="text-danger">* Obligueshme</span>
          </div>
          <div className="card-body">
            <div className="form-group row mb-3">
              <label className="col-sm-2 col-form-label">Emri</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className={`form-control ${errors.emri && "is-invalid"}`}
                  placeholder="Emri"
                  onChange={trajtoNdryshimet}
                  name="emri"
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
                  className={`form-control ${errors.email && "is-invalid"}`}
                  placeholder="Email"
                  onChange={trajtoNdryshimet}
                  name="emaili"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email}</div>
                )}
              </div>
            </div>
            <div className="form-group row mb-3">
              <label className="col-sm-2 col-form-label">Grupi</label>
              <div className="col-sm-10">
                <select
                  name="grupi"
                  id=""
                  onChange={trajtoNdryshimet}
                  className={`form-control ${errors.grupi && "is-invalid"}`}
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
            <button
              className="btn btn-primary"
              type="submit"
              onClick={trajtoSubmit}
            >
              Shto Librin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shto;
