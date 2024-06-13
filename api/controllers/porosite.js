import { db } from "../db.js";

export const merrPorosite = (req, res) => {
  const q = "select * from porosite";

  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json(data);
  });
};

export const shtoPorosi = (req, res) => {
  const q =
    "insert into porosite (perdoruesi_id, totali, statusi, emrui_karteles, numri_karteles, data_skadimit, cvv, adresa_1, adresa_2, qyteti, kodi_postar, komenti_shtese) values (?)";

  const vlerat = [
    req.body.perdoruesi_id,
    0,
    0,
    req.body.emri_ne_kartele,
    req.body.numri_karteles,
    req.body.data_skadimit,
    req.body.cvv,
    req.body.adresa_1,
    req.body.adresa_2,
    req.body.qyteti,
    req.body.kodi_postar,
    req.body.koment,
  ];

  db.query(q, [vlerat], (err, data) => {
    if (err) return res.json(err);
    return res.status(200).json("Libri u shtua me sukses.");
  });
};
