import express from "express"
import {merrPerdoruesit} from "../controllers/perdoruesit.js";

const router = express.Router()

router.get("/", merrPerdoruesit);

export default router