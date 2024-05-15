import express from "express";
import {
  shtoKategori,
  merrKategorite,
  merrKategorine,
  shlyejKategorine,
  editoKategorine,
} from "../controllers/kategorite.js";

const router = express.Router();

router.get("/", merrKategorite);
router.get("/:id", merrKategorine);
router.post("/", shtoKategori);
router.delete("/:id", shlyejKategorine);
router.put("/:id", editoKategorine);

export default router;
