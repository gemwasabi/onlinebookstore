import express from "express";
import { shtoPorosi } from "../controllers/porosite.js";

const router = express.Router();

router.post("/", shtoPorosi);

export default router;
