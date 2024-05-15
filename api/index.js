import express from "express"
import authRoutes from "./routes/auth.js"
import perdoruesitRoutes from "./routes/perdoruesit.js"
import libratRoutes from "./routes/librat.js"
import kategoriteRoutes from "./routes/kategorite.js"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors())

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth", authRoutes)
app.use("/api/perdoruesit", perdoruesitRoutes)
app.use("/api/librat", libratRoutes)
app.use("/api/kategorite", kategoriteRoutes)

app.listen(8800, () => {
    console.log("jeni konektuar!");
})