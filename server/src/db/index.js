import mongoose from "mongoose";
import { DB_NAME } from "../constants.js"

const dbConnect = async() => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\nDatabase connected successfully... \nDB HOST : ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log("Error in connecting to the database",error);
    }
}

export default dbConnect;