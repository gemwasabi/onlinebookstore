import express from "express";
import {
  shtoLiber,
  merrLibrat,
  shlyejLibrin,
  pastroShporten
} from "../controllers/shporta.js";

const router = express.Router();

router.post("/", shtoLiber);
router.get("/", merrLibrat);
router.delete("/pastro", pastroShporten);
router.delete("/:id", shlyejLibrin);

export default router;
