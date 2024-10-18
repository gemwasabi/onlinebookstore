import { db } from "../db.js";
import bcrypt from 'bcrypt';

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
  const q =
    "insert into perdoruesit (emri, mbiemri, emaili, fjalekalimi, grupi) values (?)";

  const vlerat = [
    req.body.emri,
    req.body.mbiemri,
    req.body.emaili,
    req.body.fjalekalimi,
    req.body.grupi,
  ];

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
  const { emri, mbiemri, emaili, fjalekalimi, perdoruesi_id } = req.body;

  // Check if the user is authenticated and authorized to update
  if (!perdoruesi_id) return res.status(400).json("User ID is required.");

  // Check if the user exists
  const q = "SELECT * FROM perdoruesit WHERE id = ?";
  db.query(q, [perdoruesi_id], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) return res.status(404).json("User not found.");

    let query =
      "UPDATE perdoruesit SET emri = ?, mbiemri = ?, emaili = ? WHERE id = ?";
    let values = [emri, mbiemri, emaili, perdoruesi_id];

    if (fjalekalimi) {
      // Hash the new password if provided
      const saltRounds = 10;
      const salt = bcrypt.genSaltSync(saltRounds);
      const hash = bcrypt.hashSync(fjalekalimi, salt);

      query =
        "UPDATE perdoruesit SET emri = ?, mbiemri = ?, emaili = ?, fjalekalimi = ? WHERE id = ?";
      values = [emri, mbiemri, emaili, hash, perdoruesi_id];
    }

    db.query(query, values, (err, result) => {
      if (err) return res.json(err);
      return res.status(200).json("User updated successfully.");
    });
  });
};

// Delete user and related records
export const shlyejProfilin = (req, res) => {
  const userId = req.params.id;

  // Start a transaction
  db.beginTransaction((err) => {
    if (err) return res.status(500).json(err);

    // Delete related kartelat records
    db.query(
      "DELETE FROM kartelat WHERE perdoruesi_id = ?",
      [userId],
      (err) => {
        if (err) return db.rollback(() => res.status(500).json(err));

        // Delete related adresat records
        db.query(
          "DELETE FROM adresat WHERE perdoruesi_id = ?",
          [userId],
          (err) => {
            if (err) return db.rollback(() => res.status(500).json(err));

            // Finally, delete the user profile
            db.query(
              "DELETE FROM perdoruesit WHERE id = ?",
              [userId],
              (err) => {
                if (err) return db.rollback(() => res.status(500).json(err));

                // Commit the transaction
                db.commit((err) => {
                  if (err) return db.rollback(() => res.status(500).json(err));
                  return res
                    .status(200)
                    .json("Profil dhe të dhënat e lidhura u fshinë me sukses.");
                });
              }
            );
          }
        );
      }
    );
  });
};
