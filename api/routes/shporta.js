import express from "express";
import {
  shtoLiber,
  merrLibrat,
  shlyejLibrin,
  pastroShporten,
  llogaritTotali
} from "../controllers/shporta.js";

const router = express.Router();

router.post("/", shtoLiber);
router.get("/", merrLibrat);
router.delete("/pastro", pastroShporten);
router.delete("/:id", shlyejLibrin);
router.get("/totali", llogaritTotali);

export default router;
