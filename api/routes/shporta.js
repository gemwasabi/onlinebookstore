import express from "express";
import {
  shtoLiber,
} from "../controllers/shporta.js";

const router = express.Router();

router.post("/", shtoLiber);

export default router;
