import { configDotenv } from "dotenv";
import { connectDB } from "./config/db.js";
import { app } from "./app.js";



configDotenv()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 4500, ()=>{
        console.log("Server is running")
    })
})
.catch((err)=>{
    console.log(err)
})