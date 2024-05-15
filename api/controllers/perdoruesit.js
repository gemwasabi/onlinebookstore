import { db } from "../db.js";

export const merrPerdoruesit = (req, res) => {
  const q = "select * from perdoruesit";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrPerdoruesin = (req, res) => {
  const q = "select * from perdoruesit where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
};

export const shtoPerdorues = (req, res) => {
  const q = "insert into perdoruesit (emri, mbiemri, emaili, fjalekalimi) values (?)";

  const vlerat = [req.body.emri, req.body.pershkrimi];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Perdoruesi u shtua me sukses.");
  });
};

export const shlyejPerdoruesin = (req, res) => {
  const q = "delete from perdoruesit where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Perdoruesi u shlye me sukses!");
  });
};

export const editoPerdoruesin = (req, res) => {
  const { emri, mbiemri, emaili, fjalekalimi, id } = req.body;

  const q = `UPDATE perdoruesit SET emri = ?, mbiemri = ?, emaili = ?, fjalekalimi = ?, WHERE id = ?`;

  const vlerat = [emri, mbiemri, emaili, fjalekalimi, id];

  db.query(q, vlerat, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Perdoruesi u editua me sukses!");
  });
};