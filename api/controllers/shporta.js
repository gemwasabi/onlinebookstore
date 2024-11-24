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
  const bookId = req.params.id;
  console.log("Delete request for item ID:", bookId); 
  const q = "DELETE FROM shporta WHERE id = ?";

  db.query(q, [bookId], (err, data) => {
    if (err) {
      console.error("Error deleting item from database:", err);
      return res.status(500).json({ error: "Error deleting item from database." });
    }

    if (data.affectedRows === 0) {
      console.warn("No rows affected. Item may not exist.");
      return res.status(404).json({ error: "Item not found in the database." });
    }

    console.log("Item successfully deleted.");
    return res.status(200).json({ message: "Item successfully deleted." });
  });
};

export const pastroShporten = (req, res) => {
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const q = "DELETE FROM shporta WHERE perdoruesi_id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error clearing the cart:", err);
      return res.status(500).json({ error: "Failed to clear the cart." });
    }
    return res.status(200).json({ message: "Cart cleared successfully." });
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
