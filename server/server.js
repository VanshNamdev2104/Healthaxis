import app from "./src/index.js";
import env from "./src/config/dotenv.js";
import connectDb from "./src/config/db.js";
import "./src/services/mail.service.js";

const startServer = async () => {
  try {
    await connectDb();

    const server = app.listen(env.PORT, () => {
      console.log(`Server running on port ${env.PORT}`);
    });

    process.on("SIGINT", () => {
      console.log("Server shutting down...");
      server.close(() => {
        console.log("Server closed");
        process.exit(0);
      });
    });

  } catch (error) {
    console.error("Server start failed:", error);
    process.exit(1); 
  }
};

startServer();