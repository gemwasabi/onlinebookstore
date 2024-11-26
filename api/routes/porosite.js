import express from "express";
import {
  krijoPagesen,
  saveOrder,
  getInvoice,
  merrPorosite,
  merrPorositePerdoruesit
} from "../controllers/porosite.js";

const router = express.Router();

router.get("/", merrPorosite);
router.get("/:perdoruesi_id", merrPorositePerdoruesit);
router.post("/pagesa", krijoPagesen);
router.post("/ruaj-porosine", saveOrder);
router.get("/invoices/:orderId", getInvoice);

export default router;
