import { db } from "../db.js";

export const shtoLiber = (req, res) => {
  const q = "insert into shporta (perdoruesi_id, libri_id) values (?)";

  const vlerat = [req.body.currentUser.id, req.body.libriId];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shtua me sukses.");
  });
};

export const merrLibrat = (req, res) => {
  const q = `
    SELECT librat.*, shporta.id as shporta_id
    FROM  shporta 
    LEFT JOIN librat ON shporta.libri_id = librat.id
    WHERE shporta.perdoruesi_id = ?
  `;

  const perdoruesiId = 1;

  db.query(q, [perdoruesiId], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const shlyejLibrin = (req, res) => {
  const q = "delete from shporta where id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("test test!");
  });
};

export const pastroShporten = (req, res) => {
  const q = "DELETE FROM shporta WHERE perdoruesi_id = ?";

  db.query(q, [req.query.userId], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Shporta u pastrua me sukses!");
  });
};
