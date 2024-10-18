import express from "express";
import {
  shtoKartelen,
  merrKartelat,
  merrKartelen,
  editoKartelen,
  shlyejKartelen,
} from "../controllers/kartelat.js";

const router = express.Router();

// Get all cards for a user
router.get("/:userId", merrKartelat);

// Get a specific card by ID
router.get("/kartelat/:id", merrKartelen);

// Add a new card
router.post("/", shtoKartelen);

// Update an existing card by ID
router.put("/:id", editoKartelen);

// Delete a card by ID
router.delete("/:id", shlyejKartelen);

export default router;
