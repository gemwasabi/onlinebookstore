import { db } from "../db.js";

export const shtoLiber = (req, res) => {
  const { currentUser, libriId, quantity } = req.body;

  const q = `
    INSERT INTO shporta (perdoruesi_id, libri_id, quantity)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE quantity = quantity + 1;
  `;

  const values = [currentUser.id, libriId, quantity || 1];

  db.query(q, values, (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Libri u shtua me sukses në shportë.");
  });
};


export const merrLibrat = (req, res) => {
  const q = `
    SELECT librat.*, shporta.quantity, shporta.id as shporta_id
    FROM shporta
    LEFT JOIN librat ON shporta.libri_id = librat.id
    WHERE shporta.perdoruesi_id = ?
  `;

  const perdoruesiId = req.query.userId;

  if (!perdoruesiId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(q, [perdoruesiId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const updateQuantity = (req, res) => {
  const { cartItemId, quantity } = req.body;

  const q = "UPDATE shporta SET quantity = ? WHERE id = ?";

  db.query(q, [quantity, cartItemId], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Sasia u përditësua me sukses.");
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

export const llogaritTotali = (req, res) => {
  const q = `
    SELECT SUM(librat.cmimi) AS total
    FROM shporta
    LEFT JOIN librat ON shporta.libri_id = librat.id
    WHERE shporta.perdoruesi_id = ?
  `;

  const perdoruesiId = req.query.userId;

  if (!perdoruesiId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  db.query(q, [perdoruesiId], (err, data) => {
    if (err) return res.json(err);

    const total = data[0].total || 0;
    return res.status(200).json({ total });
  });
};
