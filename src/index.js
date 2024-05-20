
import connectDB from "./db/index.js"
import {app} from "./app.js"
import dotenv from "dotenv"
dotenv.config({
    path:'./env'
})
connectDB().then(()=>{
    app.on("error",(error)=>{
        console.log("error",error);
        throw error;
    })
    app.listen(process.env.PORT || 8000 )
}).catch((error)=>console.log("MongoDB connection failed",error))