import express from "express";
import { krijoPagesen, saveOrder, getInvoice } from "../controllers/porosite.js";

const router = express.Router();

router.post("/pagesa", krijoPagesen);
router.post("/ruaj-porosine", saveOrder);
router.get("/invoices/:orderId", getInvoice);

export default router;
