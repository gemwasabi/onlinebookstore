import express from "express";
import {
  shtoAdrese,
  merrAdresat,
  merrAdresen,
  shlyejAdrese,
  editoAdresen,
} from "../controllers/adresat.js";

const router = express.Router();

// Get all addresses for a user
router.get("/:perdoruesi_id", merrAdresat);

// Get a single address by ID
router.get("/adresa/:id", merrAdresen);

// Add a new address
router.post("/", shtoAdrese);

// Delete an address by ID
router.delete("/:id", shlyejAdrese);

// Edit an existing address by ID
router.put("/:id", editoAdresen);

export default router;
