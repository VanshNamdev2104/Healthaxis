import mongoose from "mongoose";
import env from "./dotenv.js";
import logger from "./logger.js";

const connectDb = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

   logger.info("✅ MongoDB Connected");
  } catch (error) {
    logger.error("❌ DB Connection Error:", error.message);
    process.exit(1);
  }
};


const closeDb = async () => {
    try {
        await mongoose.connection.close();
        logger.info("Database connection closed successfully");
    } catch (error) {
        logger.error("Error closing database connection", { error: error.message });
    }
};

export { connectDb, closeDb };