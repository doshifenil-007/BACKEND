import mongoose, { mongo } from "mongoose"
import {DB_NAME} from "../constants.js"

import express from "express"
const app = express()



const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

        console.log(`\n MongoDB connected !! DB HOST ${connectionInstance.connection.host}`);
        
    } catch (error) {
        console.log("MongoDB connection error" , error);
        process.exit(1)
        
        
    }

}


export default connectDB

// iife function use to connect DB

// (async () => {
//     try {
//         mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
//         app.on("error" , () => {
//             console.log(error);
//             throw error
//         })

//         app.listen(process.env.PORT, () => {
//             console.log(`App is lisntening on PORT ${process.env.PORT}`);
//         })
//     }
//     catch (error) {
//         console.log("ERROR: " ,error)
//         throw error
        
//     }
// })()
