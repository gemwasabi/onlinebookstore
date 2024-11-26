import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

function Shto() {
  const [inputs, setInputs] = useState({
    emri: "",
    librat: [],
    statusi: "",
    foto: null,
  });

  const [errors, setErrors] = useState({
    emri: "",
    librat: "",
    statusi: "",
    foto: "",
  });

  const navigate = useNavigate();

  const trajtoNdryshimet = (selectedOptions, { name }) => {
    if (name === "librat") {
      setInputs((prev) => ({
        ...prev,
        [name]: selectedOptions.map((option) => option.value),
      }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: selectedOptions }));
    }
  };

  const trajtoSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validateInputs(inputs);
    if (Object.values(validationErrors).every((error) => !error)) {
      console.log(inputs);
      try {
        await axios.post("http://localhost:8800/api/tufat", inputs, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        navigate("/admin/tufat");
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
    if (inputs.librat.length === 0) {
      errors.librat = "Librat jane te detyrueshem";
    }
    if (!inputs.statusi) {
      errors.statusi = "Statusi eshte i detyrueshem";
    }
    if (!inputs.foto) {
      errors.foto = "Fotoja eshte e detyruesheme";
    }
    return errors;
  };

  const [libratOptions, setLibratOptions] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axios.get("http://localhost:8800/api/librat");
      setLibratOptions(
        res.data.map((libri) => ({
          value: libri.id,
          label: libri.titulli,
        }))
      );
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
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "emri" })
                    }
                    name="emri"
                  />
                  {errors.emri && (
                    <div className="invalid-feedback">{errors.emri}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Librat</label>
                <div className="col-sm-10">
                  <Select
                    name="librat"
                    options={libratOptions}
                    isMulti
                    closeMenuOnSelect={false}
                    onChange={trajtoNdryshimet}
                    className={`form-control p-0 ${
                      errors.librat && "is-invalid"
                    }`}
                  />
                  {errors.librat && (
                    <div className="invalid-feedback">{errors.librat}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Statusi</label>
                <div className="col-sm-10">
                  <select
                    name="statusi"
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "statusi" })
                    }
                    className={`form-control ${errors.statusi && "is-invalid"}`}
                  >
                    <option value="">Zgjedh statusin</option>
                    <option value="0">Aktive</option>
                    <option value="1">Jo Aktive</option>
                  </select>
                  {errors.statusi && (
                    <div className="invalid-feedback">{errors.statusi}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Foto</label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    className={`form-control ${errors.foto && "is-invalid"}`}
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.files[0], { name: "foto" })
                    }
                    name="foto"
                  />
                  {errors.foto && (
                    <div className="invalid-feedback">{errors.foto}</div>
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
