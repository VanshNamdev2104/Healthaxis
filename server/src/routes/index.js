import express from "express";
import cors from "cors";
import compression from "compression";
import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";

import config from "./src/config/config.js";
import { errorHandler } from "./src/utils/errorhandler.js";

// Route imports
import userRoutes from "./src/routes/user/user.routes.js";
import hospitalRoutes from "./src/routes/hospital/hospital.routes.js";
import doctorRoutes from "./src/routes/doctor.routes.js";
import appointmentRoutes from "./src/routes/appointment.routes.js";
import diseaseRoutes from "./src/routes/disease.routes.js";
import medicineRoutes from "./src/routes/medicine.routes.js";
import chatRoutes from "./src/routes/chat/chat.routes.js";
import adminRoutes from "./src/routes/admin/admin.routes.js";

// Middleware imports
import { authMiddleware } from "./src/middlewares/auth.js";
import { rateLimiter } from "./src/middlewares/rateLimiter.js";

export const setupRoutes = (app) => {
  // Security Middleware
  app.use(helmet());
  app.use(mongoSanitize());

  // Performance Middleware
  app.use(compression());

  // CORS
  app.use(
    cors({
      origin: config.CORS_ORIGIN,
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );

  // Body Parser
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ limit: "10mb", extended: true }));

  // Rate Limiting
  app.use(rateLimiter);

  // Health Check
  app.get("/health", (req, res) => {
    res.json({ status: "Server is running", timestamp: new Date() });
  });

  // API Routes
  const apiPrefix = config.API_PREFIX;

  // Public routes
  app.use(`${apiPrefix}/users`, userRoutes);
  app.use(`${apiPrefix}/hospitals`, hospitalRoutes);
  app.use(`${apiPrefix}/doctors`, doctorRoutes);
  app.use(`${apiPrefix}/appointments`, appointmentRoutes);
  app.use(`${apiPrefix}/diseases`, diseaseRoutes);
  app.use(`${apiPrefix}/medicines`, medicineRoutes);
  app.use(`${apiPrefix}/chat`, chatRoutes);
  
  // Admin routes (protected)
  app.use(`${apiPrefix}/admin`, adminRoutes);

  // 404 Handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      message: "Route not found",
      path: req.originalUrl,
    });
  });

  // Error Handler
  app.use(errorHandler);

  return app;
};

export default setupRoutes;
