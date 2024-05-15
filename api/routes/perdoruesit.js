import express from "express";
import {
  editoPerdoruesin,
  merrPerdoruesin,
  merrPerdoruesit,
  shlyejPerdoruesin,
  shtoPerdorues,
} from "../controllers/perdoruesit.js";

const router = express.Router();

router.get("/", merrPerdoruesit);
router.get("/:id", merrPerdoruesin);
router.post("/", shtoPerdorues);
router.delete("/:id", shlyejPerdoruesin);
router.put("/:id", editoPerdoruesin);

export default router;