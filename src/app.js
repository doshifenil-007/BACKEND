import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()



app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({
    limit : "16kb"
}))

app.use(express.urlencoded({
    extended : true,
    limit : "16kb"
}))

app.use(express.static("public"))
app.use(cookieParser())

//routes import
import userRouter from "./routes/user.routes.js"


//routes declaration
app.use("/api/v1/users" , userRouter)

//so this is saying pass call to user and this will be like 
// -> be like http://localhost:8000/api/version1/user/register
// -> be like http://localhost:8000/api/version1/user/login
// -> ETC this is standard practice that is why we are doing this 

app.get("/test", (req, res) => {
    res.send("SERVER IS WORKING");
});

export {app}