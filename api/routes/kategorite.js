import express from "express";
import {
  shtoKategori,
  merrKategorite,
  merrKategorine,
  shlyejKategorine,
  editoKategorine,
  merrKategoriteRandom, // Import the new function
} from "../controllers/kategorite.js";

const router = express.Router();

// Existing routes
// New route for fetching 4 random categories and their books
router.get("/random", merrKategoriteRandom);
router.get("/", merrKategorite);
router.get("/:id", merrKategorine);
router.post("/", shtoKategori);
router.delete("/:id", shlyejKategorine);
router.put("/:id", editoKategorine);


export default router;
