import { db } from "../db.js";

// Get all addresses for a user
export const merrAdresat = (req, res) => {
  const q = "SELECT * FROM adresat WHERE perdoruesi_id = ?";

  db.query(q, [req.params.perdoruesi_id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

// Get a single address
export const merrAdresen = (req, res) => {
  const q = "SELECT * FROM adresat WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
};

// Add a new address
export const shtoAdrese = (req, res) => {
  const { perdoruesi_id, shteti, qyteti, adresa, kodi_postar, telefoni } =
    req.body;
  const q =
    "INSERT INTO adresat (perdoruesi_id, shteti, qyteti, adresa, kodi_postar, telefoni) VALUES (?)";

  const vlerat = [perdoruesi_id, shteti, qyteti, adresa, kodi_postar, telefoni];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Adresa u shtua me sukses.");
  });
};

// Edit an existing address
export const editoAdresen = (req, res) => {
  const addressId = req.params.id; // Extract the ID from request parameters
  const { shteti, qyteti, adresa, kodi_postar, telefoni } = req.body;

  // Prepare SQL query to update the address
  const q = `UPDATE adresat SET shteti = ?, qyteti = ?, adresa = ?, kodi_postar = ?, telefoni = ? WHERE id = ?`;

  const values = [shteti, qyteti, adresa, kodi_postar, telefoni, addressId];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error occurred." });
    }
    return res.status(200).json("Adresa u editua me sukses!");
  });
};

// Delete an address
export const shlyejAdrese = (req, res) => {
  const q = "DELETE FROM adresat WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Adresa u shlye me sukses!");
  });
};
