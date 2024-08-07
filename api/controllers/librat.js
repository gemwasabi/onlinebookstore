import { db } from "../db.js";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.resolve(__dirname, "../client/public/assets/img/bookcovers/")
    );
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

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
  const filename = req.file ? req.file.filename : null;
  const q =
    "insert into librat (emri, isbn, pershkrimi, kategoria_id, foto) values (?)";

  const vlerat = [
    req.body.emri,
    req.body.isbn,
    req.body.pershkrimi,
    req.body.kategoria,
    filename,
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
  let filename = null;

  if (req.file) {
    filename = req.file.filename;
  }

  const q = `
    UPDATE librat
    SET emri = ?, pershkrimi = ?, isbn = ?, kategoria_id = ?, foto = ?
    WHERE id = ?
  `;

  const vlerat = [emri, pershkrimi, isbn, kategoria_id, filename, id];

  db.query(q, vlerat, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u editua me sukses!");
  });
};

export const kerkoLibrat = (req, res) => {
  const searchTerm = req.query.query;
  const q = `
    SELECT l.*, k.emri as emri_kategorise
    FROM librat l
    LEFT JOIN kategorite k ON k.id = l.kategoria_id
    WHERE l.emri LIKE ? OR l.pershkrimi LIKE ?
  `;
  const values = [`%${searchTerm}%`, `%${searchTerm}%`];

  db.query(q, values, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json({ results: data });
  });
};
