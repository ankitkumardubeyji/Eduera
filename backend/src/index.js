import app from "./app.js";
import dotenv from "dotenv"
import { connectDb } from "./db/index.js";

dotenv.config({
    path:"../.env"
})
const port = process.env.PORT || 5000

connectDb().then(()=>{
    app.listen(port,()=>{
        console.log(`Server successfully listening at the port ${port}`)
    })
})
.catch((err)=>{
    console.log("Some error occured in connecting the database");
})




