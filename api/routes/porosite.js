import express from "express";
import { krijoPagesen } from "../controllers/porosite.js";

const router = express.Router();

router.post("/pagesa", krijoPagesen);

export default router;
