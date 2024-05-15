import { db } from "../db.js";

export const merrPerdoruesit = (req, res) => {
  const q = "select * from perdoruesit";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};