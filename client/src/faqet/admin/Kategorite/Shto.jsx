import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Shto() {
  const [inputs, setInputs] = useState({
    emri: "",
    pershkrimi: "",
  });

  const [errors, setErrors] = useState({
    emri: "",
    pershkrimi: "",
  });

  const navigate = useNavigate();

  const trajtoNdryshimet = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
        console.log(inputs);
      try {
        await axios.post("http://localhost:8800/api/kategorite", inputs);
        navigate("/admin/kategorite/shfaqKategorite");
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
      errors.emri = "Emri eshte i detyrueshem";
    }
    if (!inputs.pershkrimi) {
      errors.pershkrimi = "Pershkrimi eshte i detyrueshem";
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
              <label className="col-sm-2 col-form-label">Pershkrimi</label>
              <div className="col-sm-10">
                <textarea
                  className={`form-control ${
                    errors.pershkrimi && "is-invalid"
                  }`}
                  placeholder="Pershkrimi"
                  onChange={trajtoNdryshimet}
                  name="pershkrimi"
                  rows="3"
                ></textarea>
                {errors.pershkrimi && (
                  <div className="invalid-feedback">{errors.pershkrimi}</div>
                )}
              </div>
            </div>
            <button
              className="btn btn-primary"
              type="submit"
              onClick={trajtoSubmit}
            >
              Shto Kategorine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shto;
