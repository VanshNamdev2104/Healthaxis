import http from "http";
import app from "./src/index.js";
import env from "./src/config/dotenv.js";
import { connectDb, closeDb } from "./src/config/db.js";
import { initSocket } from "./src/config/socket.js";
import logger from "./src/config/logger.js";
import "./src/services/mail.service.js";

const startServer = async () => {
  try {
    await connectDb();

    // Create HTTP server from Express app
    const server = http.createServer(app);

    // Initialize Socket.IO on the HTTP server
    initSocket(server);

    server.listen(env.PORT, () => {
      logger.info(`Server running on port ${env.PORT}`);
    });

    process.on("SIGINT", async () => {
      logger.info("Server shutting down...");
      server.close(async () => {
        logger.info("HTTP server closed");
        await closeDb();
        logger.info("Graceful shutdown completed");
        process.exit(0);
      });
    });

    process.on("SIGTERM", async () => {
      logger.info("SIGTERM received, shutting down...");
      server.close(async () => {
        logger.info("HTTP server closed");
        await closeDb();
        logger.info("Graceful shutdown completed");
        process.exit(0);
      });
    });

  } catch (error) {
    logger.error("Server start failed:", { error: error.message, stack: error.stack });
    process.exit(1);
  }
};

startServer();