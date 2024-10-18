import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { toast, ToastContainer } from "react-toastify";

function Shto() {
  const [inputs, setInputs] = useState({
    titulli: "",
    autori: "",
    isbn: "",
    pershkrimi: "",
    cmimi: "",
    gjuha: "",
    data_publikimit: "",
    tipi: "",
    foto: null,
    kategoria: [], // New field for categories
  });

  const [errors, setErrors] = useState({
    titulli: "",
    autori: "",
    isbn: "",
    pershkrimi: "",
    cmimi: "",
    gjuha: "",
    data_publikimit: "",
    tipi: "",
    foto: "",
    kategoria: "", // New field for categories
  });

  const [kategoriaOptions, setKategoriaOptions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/kategorite");
        setKategoriaOptions(
          res.data.map((category) => ({
            value: category.id,
            label: category.emri,
          }))
        );
      } catch (error) {
        console.log(error);
      }
    };

    fetchCategories();
  }, []);

  const trajtoNdryshimet = (selectedOptions, { name }) => {
    if (name === "kategoria") {
      setInputs((prev) => ({
        ...prev,
        [name]: selectedOptions
          ? selectedOptions.map((option) => option.value)
          : [],
      }));
    } else {
      setInputs((prev) => ({ ...prev, [name]: selectedOptions }));
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

        const response = await axios.post(
          "http://localhost:8800/api/librat",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.status === 200) {
          toast.success("Libri u shtua me sukses.", {
            position: "top-right",
          });
          navigate("/admin/shfaqLibrat");
        }
      } catch (err) {
        if (err.response) {
          const errorMsg = err.response.data.message || "Ka ndodhur nje gabim.";
          toast.error(errorMsg, {
            position: "top-right",
          });
        } else {
          toast.error(
            "Gabim në lidhjen me serverin. Ju lutem provoni përsëri.",
            {
              position: "top-right",
            }
          );
        }
      }
    } else {
      setErrors(validationErrors);
    }
  };

  const validateInputs = (inputs) => {
    const errors = {};
    if (!inputs.titulli) {
      errors.titulli = "Titulli eshte i detyrueshem";
    }
    if (!inputs.isbn) {
      errors.isbn = "ISBN eshte i detyrueshem";
    }
    if (!inputs.pershkrimi) {
      errors.pershkrimi = "Pershkrimi eshte i detyrueshem";
    }
    if (!inputs.cmimi) {
      errors.cmimi = "Cmimi eshte i detyrueshem";
    }
    if (!inputs.gjuha) {
      errors.gjuha = "Gjuha eshte e detyrueshme";
    }
    if (!inputs.data_publikimit) {
      errors.data_publikimit = "Data e publikimit eshte e detyrueshme";
    }
    if (!inputs.tipi) {
      errors.tipi = "Tipi eshte i detyrueshem";
    }
    if (!inputs.foto) {
      errors.foto = "Foto eshte e detyrueshme";
    }
    if (inputs.kategoria.length === 0) {
      errors.kategoria = "Kategoriat jane te detyrueshme";
    }
    if (!inputs.autori) {
      errors.autori = "Autori eshte i detyrueshem";
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
            <form onSubmit={trajtoSubmit} encType="multipart/form-data">
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Titulli</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.titulli && "is-invalid"}`}
                    placeholder="Titulli"
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "titulli" })
                    }
                    name="titulli"
                  />
                  {errors.titulli && (
                    <div className="invalid-feedback">{errors.titulli}</div>
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
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "autori" })
                    }
                    name="autori"
                  />
                  {errors.autori && (
                    <div className="invalid-feedback">{errors.autori}</div>
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
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "isbn" })
                    }
                    name="isbn"
                  />
                  {errors.isbn && (
                    <div className="invalid-feedback">{errors.isbn}</div>
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
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "pershkrimi" })
                    }
                    name="pershkrimi"
                    rows="3"
                  ></textarea>
                  {errors.pershkrimi && (
                    <div className="invalid-feedback">{errors.pershkrimi}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Cmimi</label>
                <div className="col-sm-10">
                  <input
                    type="number"
                    step="0.01"
                    className={`form-control ${errors.cmimi && "is-invalid"}`}
                    placeholder="Cmimi"
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "cmimi" })
                    }
                    name="cmimi"
                  />
                  {errors.cmimi && (
                    <div className="invalid-feedback">{errors.cmimi}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Gjuha</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.gjuha && "is-invalid"}`}
                    placeholder="Gjuha"
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "gjuha" })
                    }
                    name="gjuha"
                  />
                  {errors.gjuha && (
                    <div className="invalid-feedback">{errors.gjuha}</div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">
                  Data e Publikimit
                </label>
                <div className="col-sm-10">
                  <input
                    type="date"
                    className={`form-control ${
                      errors.data_publikimit && "is-invalid"
                    }`}
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, {
                        name: "data_publikimit",
                      })
                    }
                    name="data_publikimit"
                  />
                  {errors.data_publikimit && (
                    <div className="invalid-feedback">
                      {errors.data_publikimit}
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Tipi</label>
                <div className="col-sm-10">
                  <input
                    type="text"
                    className={`form-control ${errors.tipi && "is-invalid"}`}
                    placeholder="Tipi"
                    onChange={(e) =>
                      trajtoNdryshimet(e.target.value, { name: "tipi" })
                    }
                    name="tipi"
                  />
                  {errors.tipi && (
                    <div className="invalid-feedback">{errors.tipi}</div>
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
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Kategori</label>
                <div className="col-sm-10">
                  <Select
                    isMulti
                    closeMenuOnSelect={false}
                    options={kategoriaOptions}
                    onChange={(selectedOptions) =>
                      trajtoNdryshimet(selectedOptions, { name: "kategoria" })
                    }
                    value={kategoriaOptions.filter((option) =>
                      inputs.kategoria.includes(option.value)
                    )}
                  />
                  {errors.kategoria && (
                    <div className="invalid-feedback">{errors.kategoria}</div>
                  )}
                </div>
              </div>
              <button type="submit" className="btn btn-primary">
                Shto Libër
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default Shto;
