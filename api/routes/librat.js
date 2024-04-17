import express from "express";
import { shtoLiber, shlyejLiber } from "../controllers/librat.js";

const router = express.Router();

router.post("/shto", shtoLiber);

export default router;
