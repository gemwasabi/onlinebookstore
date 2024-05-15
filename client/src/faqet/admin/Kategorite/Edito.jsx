import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Edito = () => {
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
  const location = useLocation();

  const kategoriaID = location.pathname.split("/")[4];

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        await axios.put(
          "http://localhost:8800/api/kategorite/" + kategoriaID,
          inputs
        );
        navigate("/admin/kategorite/shfaqKategorite");
      } catch (err) {
        // setError(err.response.data);
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

  const [libri, setLibrin] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(
        "http://localhost:8800/api/kategorite/" + kategoriaID
      );
      try {
        setLibrin(res.data);
        setInputs(res.data); // Update inputs with fetched data
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [kategoriaID]);

  const [kategorite, setKategorite] = useState([]);

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
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Forma per editim te kategorise</h5>
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
                  value={inputs.emri}
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
                  value={inputs.pershkrimi}
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
              Perditeso Kategorine
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edito;
