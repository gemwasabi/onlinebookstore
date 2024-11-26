import express from "express";
import multer from "multer";
import path from "path";
import {
  shtoLiber,
  merrLibrat,
  merrLibrin,
  shlyejLibrin,
  editoLibrin,
  kerkoLibrat,
  merrAutoret,
  merrLibratSimple,
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
router.get("/simple", merrLibratSimple);
router.get("/kerko", kerkoLibrat);
router.get("/merrAutoret", merrAutoret);
router.get("/:id", merrLibrin);
router.post("/", upload.single("foto"), shtoLiber);
router.delete("/:id", shlyejLibrin);
router.put("/:id", upload.single("foto"), editoLibrin);

export default router;
