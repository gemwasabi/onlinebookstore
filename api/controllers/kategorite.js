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
  const q = "insert into kategorite (emri) values (?)";

  const vlerat = [req.body.emri];

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
  const { emri, id } = req.body;

  // Ensure there is no trailing comma in the SQL query
  const q = `UPDATE kategorite SET emri = ? WHERE id = ?`;

  const vlerat = [emri, id];

  db.query(q, vlerat, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Kategoria u editua me sukses!");
  });
};

export const merrKategoriteRandom = (req, res) => {
  // Fetch 4 random categories
  const q = `
    SELECT * FROM kategorite
    ORDER BY RAND()
    LIMIT 4
  `;

  db.query(q, (err, categories) => {
    if (err) return res.json(err);

    // If no categories, return empty array
    if (categories.length === 0) return res.status(200).json([]);

    // Extract category IDs
    const categoryIds = categories.map((category) => category.id);

    // Fetch books associated with these categories
    const qBooks = `
      SELECT b.*, lk.kategoria_id
      FROM librat b
      JOIN librat_kategorite lk ON b.id = lk.libri_id
      WHERE lk.kategoria_id IN (?)
    `;

    db.query(qBooks, [categoryIds], (err, books) => {
      if (err) return res.json(err);
      // Group books by categories
      const categoriesWithBooks = categories.map((category) => ({
        ...category,
        librat: books.filter((book) => book.kategoria_id === category.id),
      }));

      return res.status(200).json(categoriesWithBooks);
    });
  });
};
