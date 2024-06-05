import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ShtoSlider() {
  const [image, setImage] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError("Imazhi eshte i detyrueshem");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", image);
      console.log(image);
      await axios.post("http://localhost:8800/api/slider", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate("/admin/slider");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div className="card">
          <div className="card-header">
            <h5 className="card-title mb-0">Forma per shtim te slider</h5>
            <span className="text-danger">* Obligueshme</span>
          </div>
          <div className="card-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group row mb-3">
                <label className="col-sm-2 col-form-label">Imazhi</label>
                <div className="col-sm-10">
                  <input
                    type="file"
                    className={`form-control ${error && "is-invalid"}`}
                    onChange={handleImageChange}
                    name="image"
                    accept="image/jpeg, image/png"
                  />
                  {error && <div className="invalid-feedback">{error}</div>}
                </div>
              </div>
              <button className="btn btn-primary" type="submit">
                Shto Slider
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShtoSlider;
