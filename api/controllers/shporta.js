import { db } from "../db.js";

export const shtoLiber = (req, res) => {
  const q = "insert into shporta (perdoruesi_id, libri_id) values (?)";

  const vlerat = [req.body.currentUser.id, req.body.libriId];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shtua me sukses.");
  });
};
