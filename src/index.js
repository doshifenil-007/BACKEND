
import dotenv from "dotenv"
import connectDB from "./db/index.js";
const app = express()


dotenv.config({
    path : '/.env'
})

connectDB()
.then(() => {
    app.listen(process.env.port || 8000 , () => {
        console.log(`Server is running at PORT ${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log("MongoDB connection FAILED!!!" , err);
    
})
