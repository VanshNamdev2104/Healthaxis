import mongoose from "mongoose";
import env from "./dotenv.js";
const connectDb = async () => {
    try {
        await mongoose.connect(env.MONGO_URI);
        console.log("Database connected");
    } catch (error) {
        console.log(error);
    }
}

export default connectDb;