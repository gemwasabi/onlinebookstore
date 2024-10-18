import express from "express";
import {
  editoPerdoruesin,
  merrPerdoruesin,
  merrPerdoruesit,
  shlyejProfilin,
  shtoPerdorues,
} from "../controllers/perdoruesit.js";

const router = express.Router();

router.get("/", merrPerdoruesit);
router.get("/:id", merrPerdoruesin);
router.post("/", shtoPerdorues);
router.delete("/:id", shlyejProfilin);
router.put("/", editoPerdoruesin);

export default router;
