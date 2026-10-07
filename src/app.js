import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

// ---------- ROUTER IMPORTS (all imports go at the top) ----------
import userRouter from "./routes/user.routes.js"
import productRouter from "./routes/product.routes.js"
import healthcheckRouter from "./routes/healthcheck.routes.js"

const app = express()

// ---------- MIDDLEWARES ----------
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({ limit: "16kb" }))
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
app.use(express.static("public"))
app.use(cookieParser())

// ---------- ROUTES ----------
app.get("/test", (req, res) => {
    res.send("SERVER IS WORKING")
})

app.use("/api/v1/users", userRouter)
app.use("/api/v1/products", productRouter)
app.use("/api/v1/healthcheck", healthcheckRouter)

// ---------- ERROR HANDLER (must stay LAST) ----------
app.use((err, req, res, next) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message,
        errors: err.errors || []
    })
})

export { app }