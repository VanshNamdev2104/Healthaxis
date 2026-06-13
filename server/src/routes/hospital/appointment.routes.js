import { Router } from "express";
import auth from "../../middlewares/auth.js";
import appointmentController from "../../controllers/hospital/appointment.controller.js";
import validate from "../../middlewares/validate.js";
import { createAppointmentSchema, approveAppointmentSchema } from "../../validations/hospital/index.js";
import checkHospitalApproved from "../../middlewares/checkHospitalApproved.js";

const appointmentRouter = Router();
const { authenticate, authorizeRoles } = auth;

appointmentRouter.post("/:doctorId", authenticate, authorizeRoles("user"), validate(createAppointmentSchema), appointmentController.createAppointmentController);
appointmentRouter.get("/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getAllAppointmentsOfHospital);
appointmentRouter.get("/user", authenticate, authorizeRoles("user"), appointmentController.getAllAppointmentsOfUser);
appointmentRouter.get("/approved/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getApprovedAppointmentsOfHospital);
appointmentRouter.get("/approved/user", authenticate, authorizeRoles("user"), appointmentController.getApprovedAppointmentOfUser);
appointmentRouter.get("/pending/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getPendingAppointmentsOfHospital);
appointmentRouter.get("/pending/user", authenticate, authorizeRoles("user"), appointmentController.getPendingAppointmentsOfUser);
appointmentRouter.get("/:appointmentId", authenticate, authorizeRoles("user", "admin", "hospitalAdmin"), appointmentController.getAppointment);

// Operational routes protected by hospital approval status and input validation schemas
appointmentRouter.patch("/:appointmentId/approve", authenticate, authorizeRoles("hospitalAdmin"), checkHospitalApproved, validate(approveAppointmentSchema), appointmentController.approveAppointment);
appointmentRouter.patch("/:appointmentId/reject", authenticate, authorizeRoles("hospitalAdmin"), checkHospitalApproved, appointmentController.rejectAppointment);
appointmentRouter.patch("/:appointmentId/reschedule", authenticate, authorizeRoles("user", "hospitalAdmin"), checkHospitalApproved, validate(approveAppointmentSchema), appointmentController.rescheduleAppointment);
appointmentRouter.delete("/:appointmentId", authenticate, authorizeRoles("user", "hospitalAdmin"), checkHospitalApproved, appointmentController.deleteAppointment);

export default appointmentRouter;
