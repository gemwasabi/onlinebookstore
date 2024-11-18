import express from "express";
import { krijoPagesen, saveOrder } from "../controllers/porosite.js";

const router = express.Router();

router.post("/pagesa", krijoPagesen);
router.post("/ruaj-porosine", saveOrder);

export default router;
