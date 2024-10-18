import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const Edito = () => {
  const [inputs, setInputs] = useState({
    emri: "", // Ensure default value is an empty string
  });

  const [errors, setErrors] = useState({
    emri: "",
  });

  const navigate = useNavigate();
  const location = useLocation();
  const kategoriaID = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/kategorite/${kategoriaID}`
        );
        setInputs(res.data || { emri: "" }); // Ensure default values are set
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategory();
  }, [kategoriaID]);

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        await axios.put(
          `http://localhost:8800/api/kategorite/${kategoriaID}`,
          inputs
        );
        navigate("/admin/shfaqKategorite");
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
    return errors;
  };

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Forma per editim te kategorise</h5>
            <span className="text-danger">* Obligueshme</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Emri</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.emri && "is-invalid"}`}
                    placeholder="Emri"
                    onChange={handleChange}
                    name="emri"
                    value={inputs.emri || ""} // Ensure the value is always a string
                  />
                  {errors.emri && (
                    <div className="invalid-feedback">{errors.emri}</div>
                  )}
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Perditeso Kategorine
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edito;
