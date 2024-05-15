import { db } from "../db.js";

export const merrKategorite = (req, res) => {
  const q = "select * from kategorite";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrKategorine = (req, res) => {
  const q = "select * from kategorite where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
};

export const shtoKategori = (req, res) => {
  const q = "insert into kategorite (emri, pershkrimi) values (?)";

  const vlerat = [req.body.emri, req.body.pershkrimi];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kategoria u shtua me sukses.");
  });
};

export const shlyejKategorine = (req, res) => {
  const q = "delete from kategorite where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kategoria u shlye me sukses!");
  });
};

export const editoKategorine = (req, res) => {
  const { emri, pershkrimi, id } = req.body;

  const q = `UPDATE kategorite SET emri = ?, pershkrimi = ? WHERE id = ?`;

  const vlerat = [emri, pershkrimi, id];

  db.query(q, vlerat, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kategoria u editua me sukses!");
  });
};
