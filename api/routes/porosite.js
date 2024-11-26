import express from "express";
import {
  krijoPagesen,
  saveOrder,
  getInvoice,
  merrPorosite,
  merrPorositePerdoruesit,
  updatePaymentStatus
} from "../controllers/porosite.js";

const router = express.Router();

router.get("/", merrPorosite);
router.get("/:perdoruesi_id", merrPorositePerdoruesit);
router.post("/pagesa", krijoPagesen);
router.post("/ruaj-porosine", saveOrder);
router.get("/invoices/:orderId", getInvoice);
router.put("/status", updatePaymentStatus);

export default router;
