import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Shto() {
  const [inputs, setInputs] = useState({
    emri: "",
    tipi: "",
    isbn: "",
    autori: "",
    kategoria: "",
    pershkrimi: "",
    image: null, // Add image to the state
  });

  const [errors, setErrors] = useState({
    emri: "",
    tipi: "",
    isbn: "",
    autori: "",
    kategoria: "",
    pershkrimi: "",
    image: "", // Add image to the error state
  });

  const navigate = useNavigate();

  const trajtoNdryshimet = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") {
      setInputs((prev) => ({ ...prev, image: files[0] }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      try {
        const formData = new FormData();
        for (const key in inputs) {
          formData.append(key, inputs[key]);
        }

        await axios.post("http://localhost:8800/api/librat", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        navigate("/admin/librat/shfaqLibrat");
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
    if (!inputs.isbn) {
      errors.isbn = "ISBN eshte i detyrueshem";
    }
    if (!inputs.pershkrimi) {
      errors.pershkrimi = "Pershkrimi eshte i detyrueshem";
    }
    if (!inputs.kategoria) {
      errors.kategoria = "Kategoria eshte e detyrueshme";
    }
    if (!inputs.image) {
      errors.image = "Imazhi eshte i detyrueshem";
    }
    if (!inputs.autori) {
      errors.autori = "Autori eshte i detyrueshem";
    }
    if (!inputs.tipi) {
      errors.tipi = "Tipi eshte i detyrueshem";
    }
    return errors;
  };

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
            <h5 className="card-title mb-0">Forma per shtim te librit</h5>
            <span className="text-danger">* Obligueshme</span>
          </div>
          <div className="card-body">
            <form onSubmit={trajtoSubmit} encType="multipart/form-data">
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Titulli</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.emri && "is-invalid"}`}
                    placeholder="Titulli"
                    onChange={trajtoNdryshimet}
                    name="emri"
                  />
                  {errors.emri && (
                    <div className="invalid-feedback">{errors.emri}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Tipi</label>
                <div className="col-sm-10">
                  <select
                    name="tipi"
                    onChange={trajtoNdryshimet}
                    className={`form-control ${
                      errors.tipi && "is-invalid"
                    }`}
                  >
                    <option value="">Zgjedh Tipin</option>
                    <option value="0">Paperback</option>
                    <option value="1">Hardcover</option>
                  </select>
                  {errors.tipi && (
                    <div className="invalid-feedback">{errors.tipi}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">ISBN</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.isbn && "is-invalid"}`}
                    placeholder="ISBN"
                    onChange={trajtoNdryshimet}
                    name="isbn"
                  />
                  {errors.isbn && (
                    <div className="invalid-feedback">{errors.isbn}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Autori</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.autori && "is-invalid"}`}
                    placeholder="Autori"
                    onChange={trajtoNdryshimet}
                    name="autori"
                  />
                  {errors.autori && (
                    <div className="invalid-feedback">{errors.autori}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Kategoria</label>
                <div className="col-sm-10">
                  <select
                    name="kategoria"
                    onChange={trajtoNdryshimet}
                    className={`form-control ${
                      errors.kategoria && "is-invalid"
                    }`}
                  >
                    <option value="">Zgjedh kategorine</option>
                    {kategorite.map((kategoria) => (
                      <option key={kategoria.id} value={kategoria.id}>
                        {kategoria.emri}
                      </option>
                    ))}
                  </select>
                  {errors.kategoria && (
                    <div className="invalid-feedback">{errors.kategoria}</div>
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
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Imazhi</label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    className={`form-control ${errors.image && "is-invalid"}`}
                    onChange={trajtoNdryshimet}
                    name="image"
                    accept="image/jpeg, image/png"
                  />
                  {errors.image && (
                    <div className="invalid-feedback">{errors.image}</div>
                  )}
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Shto Librin
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Shto;
