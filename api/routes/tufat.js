import express from "express";
import multer from "multer";
import {
  editoTufen,
  merrTufen,
  merrTufat,
  merrTufatRandom,
  shlyejTufen,
  shtoTufe,
  merrTufatMeLibra,
} from "../controllers/tufat.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../client/public/assets/img/tufat/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

router.get("/", merrTufat);
router.get("/random", merrTufatRandom);
router.get("/tufatMeLibra", merrTufatMeLibra);
router.get("/:id", merrTufen);
router.post("/", upload.single("foto"), shtoTufe);
router.delete("/:id", shlyejTufen);
router.put("/:id", editoTufen);

export default router;
