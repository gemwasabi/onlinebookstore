import express from "express";
import { ckycu, kycu, regjistrohu } from "../controllers/auth.js";

const router = express.Router();

router.post("/regjistrohu", regjistrohu);
router.post("/kycu", kycu);
router.post("/ckycu", ckycu);

export default router;
