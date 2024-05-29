import express from "express";
import {
  editoTufen,
  merrTufen,
  merrTufat,
//   shlyejTufen,
  shtoTufe,
  merrTufatMeLibra,
} from "../controllers/tufat.js";

const router = express.Router();

router.get("/", merrTufat);
router.get("/tufatMeLibra", merrTufatMeLibra);
router.get("/:id", merrTufen);
router.post("/", shtoTufe);
// router.delete("/:id", shlyejTufen);
router.put("/:id", editoTufen);

export default router;