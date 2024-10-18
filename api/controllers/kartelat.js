import { db } from "../db.js";

// Get all cards for a user
export const merrKartelat = (req, res) => {
  const q = "SELECT * FROM kartelat WHERE perdoruesi_id = ?";

  db.query(q, [req.params.userId], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

// Get a single card
export const merrKartelen = (req, res) => {
  const q = "SELECT * FROM kartelat WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data[0]);
  });
};

// Add a new card
export const shtoKartelen = (req, res) => {
  const {
    numri_karteles,
    tipi_karteles,
    data_skadimit,
    adresa_faturimit,
    perdoruesi_id,
  } = req.body;
  const q =
    "INSERT INTO kartelat (numri_karteles, tipi_karteles, data_skadimit, adresa_faturimit, perdoruesi_id) VALUES (?)";

  const values = [
    numri_karteles,
    tipi_karteles,
    data_skadimit,
    adresa_faturimit,
    perdoruesi_id,
  ];

  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kartela u shtua me sukses.");
  });
};

// Edit an existing card
export const editoKartelen = (req, res) => {
  const cardId = req.params.id; // Extract the ID from request parameters
  const { numri_karteles, tipi_karteles, data_skadimit, adresa_faturimit } =
    req.body;

  // Prepare SQL query to update the card
  const q = `UPDATE kartelat SET numri_karteles = ?, tipi_karteles = ?, data_skadimit = ?, adresa_faturimit = ? WHERE id = ?`;

  const values = [
    numri_karteles,
    tipi_karteles,
    data_skadimit,
    adresa_faturimit,
    cardId,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      return res.status(500).json({ error: "Database error occurred." });
    }
    return res.status(200).json("Kartela u editua me sukses!");
  });
};

// Delete a card
export const shlyejKartelen = (req, res) => {
  const q = "DELETE FROM kartelat WHERE id = ?";

  db.query(q, [req.params.id], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kartela u shlye me sukses!");
  });
};
