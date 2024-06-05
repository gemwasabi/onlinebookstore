import { db } from "../db.js";

export const merrSlider = (req, res) => {
  const q = "SELECT * FROM slider";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const shtoSlider = (req, res) => {
  const filename = req.file ? req.file.filename : null;
  const q = "INSERT INTO slider (foto) VALUES (?)";

  const vlerat = [filename];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Slider image added successfully.");
  });
};

export const shlyejSlider = (req, res) => {
  const q = "DELETE FROM slider WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Slider image deleted successfully!");
  });
};
