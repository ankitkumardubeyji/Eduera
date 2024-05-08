import mongoose from "mongoose";


export const connectDb = async()=>{
    
    try {
        const connect = await mongoose.connect(`${process.env.MONGOURI}/Eduera`,{
            writeConcern:{w:"majority"},
        })
        console.log(`Connected to the database ${connect.connection.host}`)
    } catch (error) {
        console.log(error)
    }
}   
