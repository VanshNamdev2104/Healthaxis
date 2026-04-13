import { Server } from "socket.io";
import env from "./dotenv.js";
import logger from "./logger.js";

let io;

/**
 * Initialize Socket.IO with HTTP server
 * @param {import("http").Server} httpServer
 * @returns {Server} Socket.IO server instance
 */
export const initSocket = (httpServer) => {
    io = new Server(httpServer, {
        cors: {
            origin: env.CLIENT_URL || "http://localhost:5173",
            methods: ["GET", "POST"],
            credentials: true,
        },
    });

    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        // ─── Join a room (e.g., user-specific room) ─────────────
        socket.on("join", (room) => {
            socket.join(room);
            logger.info(`Socket ${socket.id} joined room: ${room}`);
        });

        // ─── Leave a room ───────────────────────────────────────
        socket.on("leave", (room) => {
            socket.leave(room);
            logger.info(`Socket ${socket.id} left room: ${room}`);
        });

        // ─── Disconnect ─────────────────────────────────────────
        socket.on("disconnect", (reason) => {
            logger.info(`Socket disconnected: ${socket.id} | Reason: ${reason}`);
        });
    });

    logger.info("Socket.IO initialized");
    return io;
};

/**
 * Get the active Socket.IO instance
 * @returns {Server}
 */
export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized. Call initSocket(httpServer) first.");
    }
    return io;
};
