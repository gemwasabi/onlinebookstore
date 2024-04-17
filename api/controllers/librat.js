import { db } from "../db.js";

export const shtoLiber = (req, res) => {
  const q = "insert into librat (emri, isbn, pershkrimi) values (?)";

  const vlerat = [req.body.emri, req.body.isbn, req.body.pershkrimi];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shtua me sukses.");
  });
};

export const shlyejLiber = (req, res) => {
  res.json("libri u shlye!");
};
