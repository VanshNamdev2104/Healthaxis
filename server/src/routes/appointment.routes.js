import express from "express";
import * as appointmentController from "../../controllers/appointment.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { validate } from "../../validations/schemas.js";
import { validationSchemas } from "../../validations/schemas.js";

const router = express.Router();

// Public routes
router.get("/", authMiddleware, appointmentController.getAllAppointments);
router.get("/:id", authMiddleware, appointmentController.getAppointmentById);

// User appointments
router.post("/", authMiddleware, validate(validationSchemas.createAppointment), appointmentController.createAppointment);
router.get("/user/my-appointments", authMiddleware, appointmentController.getUserAppointments);
router.put("/:id", authMiddleware, validate(validationSchemas.updateAppointment), appointmentController.updateAppointment);
router.delete("/:id", authMiddleware, appointmentController.cancelAppointment);

// Doctor appointments
router.get("/doctor/schedule", authMiddleware, appointmentController.getDoctorSchedule);
router.put("/:id/doctor/status", authMiddleware, appointmentController.updateAppointmentStatus);

// Admin routes
router.get("/admin/analytics", authMiddleware, appointmentController.getAppointmentAnalytics);
router.get("/admin/all", authMiddleware, appointmentController.getAllAppointmentsAdmin);
router.patch("/:id/admin/cancel", authMiddleware, appointmentController.adminCancelAppointment);
router.post("/:id/admin/reschedule", authMiddleware, appointmentController.adminRescheduleAppointment);

export default router;
