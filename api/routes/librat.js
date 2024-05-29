import express from "express";
import multer from "multer";
import {
  shtoLiber,
  merrLibrat,
  merrLibrin,
  shlyejLibrin,
  editoLibrin,
} from "../controllers/librat.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/assets/img/bookcovers/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", merrLibrat);
router.get("/:id", merrLibrin);
router.post("/", upload.single("image"), shtoLiber);
router.delete("/:id", shlyejLibrin);
router.put("/:id", upload.single("image"), editoLibrin);

export default router;
