import express from "express";
import { shtoPorosi, merrPorosite } from "../controllers/porosite.js";

const router = express.Router();

router.get("/", merrPorosite);
router.post("/", shtoPorosi);

export default router;
