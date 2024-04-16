import express from "express"
import {shtoLiber} from "../controllers/librat.js"

const router = express.Router()

router.get("/test", shtoLiber)

export default router