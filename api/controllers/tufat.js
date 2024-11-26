import { db } from "../db.js";

export const merrTufat = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null; // Parse the limit parameter
  const q = `
    SELECT id, emri, foto, statusi
    FROM tufat
    ${limit ? `LIMIT ${limit}` : ""}; -- Add LIMIT only if limit is provided
  `;

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrTufatRandom = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit, 10) : null; // Parse the limit parameter
  const q = `
    SELECT id, emri, foto, statusi
    FROM tufat
    ORDER BY RAND()
    ${limit ? `LIMIT ${limit}` : ""} -- Add LIMIT only if limit is provided
  `;

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrTufatMeLibra = (req, res) => {
  const q = `SELECT * FROM tufat WHERE statusi = 0`;

  db.query(q, (err, tufatData) => {
    if (err) return res.json(err);

    // Extract Tufat IDs
    const tufatIds = tufatData.map((tufa) => tufa.id);

    const q2 = `
      SELECT tufa_id, librat.*
      FROM tufat_detal
      LEFT JOIN librat ON librat.id = tufat_detal.libri_id
      WHERE tufa_id IN (?)
    `;

    db.query(q2, [tufatIds], (err, booksData) => {
      if (err) return res.json(err);

      // Organize books by Tufat ID
      const tufatBooksMap = {};
      booksData.forEach((book) => {
        if (!tufatBooksMap[book.tufa_id]) {
          tufatBooksMap[book.tufa_id] = [];
        }
        tufatBooksMap[book.tufa_id].push(book);
      });

      // Merge Tufat Data with Books Data
      const tufatWithBooks = tufatData.map((tufa) => {
        return {
          ...tufa,
          librat: tufatBooksMap[tufa.id] || [], // Attach books data to each Tufat entry
        };
      });

      return res.status(200).json(tufatWithBooks);
    });
  });
};

export const merrTufen = (req, res) => {
  const q1 = "SELECT * FROM tufat WHERE id = ?";
  const q2 = `
    SELECT librat.*
    FROM tufat_detal 
    LEFT JOIN librat ON librat.id = tufat_detal.libri_id 
    WHERE tufa_id = ?
  `;

  db.query(q1, [req.params.id], (err, tufaData) => {
    if (err) return res.json(err);

    if (tufaData.length === 0) {
      return res.status(404).json("Tufa not found.");
    }

    db.query(q2, [req.params.id], (err, booksData) => {
      if (err) return res.json(err);

      const tufa = {
        ...tufaData[0],
        librat: booksData,
      };

      return res.status(200).json(tufa);
    });
  });
};

export const shtoTufe = (req, res) => {
  const q1 = "INSERT INTO tufat (emri, statusi, foto) VALUES (?, ?, ?)";
  const { emri, statusi, librat } = req.body;
  const filename = req.file ? req.file.filename : null;

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json("Transaction start failed.");
    }

    // Insert the new bundle
    db.query(q1, [emri, statusi, filename], (err, result) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json(err);
        });
      }

      const tufaId = result.insertId; // Get the ID of the inserted bundle

      // Insert each book into tufat_detal
      const q2 = "INSERT INTO tufat_detal (tufa_id, libri_id) VALUES ?";
      const values = librat.map((libriId) => [tufaId, libriId]);

      db.query(q2, [values], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json(err);
          });
        }

        db.commit((err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json("Transaction commit failed.");
            });
          }

          res.status(200).json("Tufa u shtua me sukses.");
        });
      });
    });
  });
};

export const editoTufen = (req, res) => {
  const { emri, statusi, librat, id } = req.body;

  console.log(req.body);

  const q1 = `UPDATE tufat SET emri = ?, statusi = ? WHERE id = ?`;
  const vlerat = [emri, statusi, id];

  const q2 = `DELETE FROM tufat_detal WHERE tufa_id = ?`;
  const q3 = `INSERT INTO tufat_detal (tufa_id, libri_id) VALUES ?`;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json("Transaction start failed.");

    // Update the tufa
    db.query(q1, vlerat, (err, data) => {
      if (err) {
        return db.rollback(() => {
          res.status(500).json(err);
        });
      }

      // Delete the existing tufa_detal entries
      db.query(q2, [id], (err) => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json(err);
          });
        }

        // Prepare values for the new tufa_detal entries with correct tufa_id
        const values = librat.map((libriId) => [id, libriId]);

        // Insert the new tufa_detal entries
        db.query(q3, [values], (err) => {
          if (err) {
            return db.rollback(() => {
              res.status(500).json(err);
            });
          }

          db.commit((err) => {
            if (err) {
              return db.rollback(() => {
                res.status(500).json("Transaction commit failed.");
              });
            }

            res.status(200).json("Tufa u editua me sukses!");
          });
        });
      });
    });
  });
};

export const shlyejTufen = (req, res) => {
  const tufatId = req.params.id;

  const deleteTufatDetal = `DELETE FROM tufat_detal WHERE tufa_id = ?`;
  const deleteTufat = `DELETE FROM tufat WHERE id = ?`;

  db.query(deleteTufatDetal, [tufatId], (err1, data1) => {
    if (err1) return res.json(err1);

    db.query(deleteTufat, [tufatId], (err2, data2) => {
      if (err2) return res.json(err2);

      return res.status(200).json("Libri u shlye me sukses!");
    });
  });
};
