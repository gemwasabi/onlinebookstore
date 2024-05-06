import express from "express";
import { shtoLiber, merrLibrat, merrLibrin, shlyejLibrin, editoLibrin } from "../controllers/librat.js";

const router = express.Router();

router.get("/", merrLibrat);
router.get("/:id", merrLibrin);
router.post("/", shtoLiber);
router.delete("/:id", shlyejLibrin);
router.put("/:id", editoLibrin);

export default router;
