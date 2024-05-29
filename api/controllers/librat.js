import { db } from "../db.js";

export const merrLibrat = (req, res) => {
  const q = `
  select l.*, k.emri as emri_kategorise
  from librat l
  left join kategorite k on k.id = l.kategoria_id
  `;

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrLibrin = (req, res) => {
  const q = "select * from librat where id = ?";
  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
};

export const shtoLiber = (req, res) => {
  const q =
    "insert into librat (emri, isbn, pershkrimi, kategoria_id) values (?)";

  const vlerat = [
    req.body.emri,
    req.body.isbn,
    req.body.pershkrimi,
    req.body.kategoria,
  ];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shtua me sukses.");
  });
};

export const shlyejLibrin = (req, res) => {
  const q = "delete from librat where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shlye me sukses!");
  });
};

export const editoLibrin = (req, res) => {
  const { emri, isbn, pershkrimi, kategoria_id, id } = req.body;
  const q = `UPDATE librat SET emri = ?, pershkrimi = ?, isbn = ?, kategoria_id = ? WHERE id = ?`;

  const vlerat = [emri, pershkrimi, isbn, kategoria_id, id];

  db.query(q, vlerat, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u editua me sukses!");
  });
};
