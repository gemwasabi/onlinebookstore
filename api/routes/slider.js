import express from "express";
import multer from "multer";
import { shtoSlider, shlyejSlider, merrSlider } from "../controllers/slider.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/assets/img/slider/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", merrSlider);
router.post("/", upload.single("image"), shtoSlider);
router.delete("/:id", shlyejSlider);

export default router;
