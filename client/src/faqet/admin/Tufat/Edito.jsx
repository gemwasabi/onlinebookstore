import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

const Edito = () => {
  const [inputs, setInputs] = useState({
    emri: "",
    librat: [],
    statusi: "",
  });

  const [errors, setErrors] = useState({
    emri: "",
    librat: "",
    statusi: "",
  });

  const [books, setBooks] = useState([]); // All possible books
  const navigate = useNavigate();
  const location = useLocation();
  const tufaId = location.pathname.split("/")[3];

  const trajtoNdryshimet = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (selectedOptions) => {
    setInputs((prev) => ({
      ...prev,
      librat: selectedOptions
        ? selectedOptions.map((option) => option.value)
        : [],
    }));
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        await axios.put(`http://localhost:8800/api/tufat/${tufaId}`, {
          ...inputs,
          id: tufaId,
        });
        navigate("/admin/tufat");
      } catch (err) {
        console.error(err);
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
    if (inputs.librat.length === 0) {
      errors.librat = "Librat jane te detyrueshem";
    }
    if (inputs.statusi === "") {
      errors.statusi = "Statusi eshte i detyrueshem";
    }
    return errors;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8800/api/tufat/${tufaId}`
        );
        setInputs({
          emri: res.data.emri,
          librat: res.data.librat.map((book) => book.id), // Ensure librat contains the book IDs
          statusi: res.data.statusi,
        });
      } catch (error) {
        console.error(error);
      }
    };

    const fetchBooks = async () => {
      try {
        const res = await axios.get(`http://localhost:8800/api/librat`);
        setBooks(res.data); // Set all possible books
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
    fetchBooks();
  }, [tufaId]);

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
              <label className="col-sm-2 col-form-label">Titulli</label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className={`form-control ${errors.emri && "is-invalid"}`}
                  placeholder="Titulli"
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
              <label className="col-sm-2 col-form-label">Statusi</label>
              <div className="col-sm-10">
                <select
                  name="statusi"
                  onChange={trajtoNdryshimet}
                  value={inputs.statusi}
                  className={`form-control ${errors.statusi && "is-invalid"}`}
                >
                  <option value="">Zgjedh Statusin</option>
                  <option value="0">Aktiv</option>
                  <option value="1">Jo Aktiv</option>
                </select>
                {errors.statusi && (
                  <div className="invalid-feedback">{errors.statusi}</div>
                )}
              </div>
            </div>
            <div className="form-group row mb-3">
              <label className="col-sm-2 col-form-label">Librat</label>
              <div className="col-sm-10">
                <Select
                  isMulti
                  name="librat"
                  closeMenuOnSelect={false}
                  options={books.map((book) => ({
                    value: book.id,
                    label: book.emri,
                  }))}
                  value={books
                    .filter((book) => inputs.librat.includes(book.id))
                    .map((book) => ({
                      value: book.id,
                      label: book.emri,
                    }))}
                  onChange={handleSelectChange}
                  className={`basic-multi-select ${
                    errors.librat && "is-invalid"
                  }`}
                  classNamePrefix="select"
                />
                {errors.librat && (
                  <div className="invalid-feedback">{errors.librat}</div>
                )}
              </div>
            </div>

            <button
              className="btn btn-primary"
              type="submit"
              onClick={trajtoSubmit}
            >
              Perditeso Tufen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Edito;
