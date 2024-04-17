import { db } from "../db.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const regjistrohu = (req, res) => {
  //kontrollo a ekziston perdoruesi me qato tdhana

  const q = "select * from perdoruesit where emaili = ?";

  db.query(q, [req.body.emaili], (err, data) => {
    if (err) return res.json(err);

    if (data.length)
      return res.status(409).json("Një llogari me këtë email ekziston!");

    //hash fjalekalimin dhe krijuo perdorues
    const saltRounds = 10;
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(req.body.fjalekalimi, salt);

    const q = "insert into perdoruesit (emaili, fjalekalimi) VALUES (?)";

    const vlerat = [req.body.emaili, hash];

    db.query(q, [vlerat], (err, data) => {
      if (err) return res.json(err);
      return res.status(200).json("Perdoruesi u krijua me sukses.");
    });
  });
};

export const kycu = (req, res) => {
  //kontrollo a ekziston perdoruesi

  const q = "select * from perdoruesit where emaili = ?";
  db.query(q, [req.body.emaili], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0)
      return res.status(404).json("Përdoruesi nuk ekziston!");

    //kontrollo fjalekalimin
    const fjalekalimiKontrolluar = bcrypt.compareSync(
      req.body.fjalekalimi,
      data[0].fjalekalimi
    );

    if (!fjalekalimiKontrolluar)
      return res.status(400).json("Detajet e shkruara nuk janë të sakta!");

    const token = jwt.sign({ id: data[0].id }, "foobarbaz");
    const { fjalekalimi, ...other } = data[0];
    res
      .cookie("tokeni", token, {
        // httpOnly: true,
      })
      .status(200)
      .json(other);
  });
};

export const ckycu = (req, res) => {};
