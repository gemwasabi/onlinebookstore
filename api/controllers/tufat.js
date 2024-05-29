import { db } from "../db.js";

export const merrTufat = (req, res) => {
  const q = `
  select * from tufat
  `;

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const merrTufen = (req, res) => {
  const q1 = "SELECT * FROM tufat WHERE id = ?";
  const q2 = `
    SELECT librat.id AS libri_id, librat.emri AS libri_emri 
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
        librat: booksData.map((row) => ({
          id: row.libri_id,
          emri: row.libri_emri,
        })),
      };

      return res.status(200).json(tufa);
    });
  });
};

export const shtoTufe = (req, res) => {
  const { emri, statusi, librat } = req.body;

  const q1 = "INSERT INTO tufat (emri, statusi) VALUES (?, ?)";

  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json("Transaction start failed.");
    }

    // Insert the new bundle
    db.query(q1, [emri, statusi], (err, result) => {
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
