import express from "express";
import logger from "morgan";
import compression from "compression";
import cookieParser from "cookie-parser";
import cors from "cors";
import passport from "./config/passport.js";
import env from "./config/dotenv.js";
import { notFoundResponse } from "./utils/responsehandler.js";
import errorhandlerMiddleware from "./utils/errorhandler.js";

import userRoutes from "./routes/user/index.js";
import chatRoutes from "./routes/chat/chat.routes.js";
import authRoutes from "./routes/auth/google.routes.js";
import diseaseRoutes from "./routes/health/disease.routes.js";
import medicineRoutes from "./routes/health/medicine.routes.js";
import hospitalRoutes from "./routes/hospital/hospital.routes.js";
import doctorRoutes from "./routes/hospital/doctor.routes.js";
import appointmentRoutes from "./routes/hospital/appointment.routes.js";
import adminRoutes from "./routes/admin/admin.routes.js";
import graphService from "./services/ai/graph.service.js";

const app = express();

app.use(logger("dev"));
app.use(compression());

// CORS configuration
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow all localhost variations
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // In production, allow specific origins
    const allowedOrigins = [
      env.CLIENT_URL,
      'https://healthaxis-plum.vercel.app',
      'https://healthaxis-14r9.onrender.com'
    ];
    
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    logger.warn(`CORS request blocked from origin: ${origin}`);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count', 'X-Page-Count'],
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());
app.use(passport.initialize());
app.set("trust proxy", true);

// ─── API Routes ──────────────────────────────────────────────
app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/health/disease", diseaseRoutes);
app.use("/api/health/diseases", diseaseRoutes); // alias
app.use("/api/health/medicine", medicineRoutes);
app.use("/api/health/medicines", medicineRoutes); // alias
app.use("/api/hospital", hospitalRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/appointments", appointmentRoutes);
app.use("/api/admin", adminRoutes);

// 404 handler
app.use((req, res) => {
    return notFoundResponse(res, "Requested resource not found");
});

// error middleware
app.use(errorhandlerMiddleware);

export default app;