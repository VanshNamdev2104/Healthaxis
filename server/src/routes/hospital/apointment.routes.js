import { Router } from "express";
import auth from "../../middlewares/auth.js";
import appointmentController from "../../controllers/hospital/appointment.controller.js";

const appointmentRouter = Router();
const { authenticate, authorizeRoles } = auth;

appointmentRouter.post("/:doctorId", authenticate, authorizeRoles("user"), appointmentController.createAppointmentController);
appointmentRouter.get("/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getAllAppointmentsOfHospital);
appointmentRouter.get("/user", authenticate, authorizeRoles("user"), appointmentController.getAllAppointmentsOfUser);
appointmentRouter.get("/approved/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getApprovedAppointmentsOfHospital);
appointmentRouter.get("/approved/user", authenticate, authorizeRoles("user"), appointmentController.getApprovedAppointmentOfUser);
appointmentRouter.get("/pending/hospital", authenticate, authorizeRoles("hospitalAdmin"), appointmentController.getPendingAppointmentsOfHospital);
appointmentRouter.get("/pending/user", authenticate, authorizeRoles("user"), appointmentController.getPendingAppointmentsOfUser);
appointmentRouter.get("/:appointmentId", authenticate, authorizeRoles("user", "admin", "hospitalAdmin"), appointmentController.getAppointment);
appointmentRouter.patch("/approve/:appointmentId", authenticate, authorizeRoles( "hospitalAdmin"), appointmentController.approveAppointment);
appointmentRouter.delete("/:appointmentId", authenticate, authorizeRoles("user", "hospitalAdmin"), appointmentController.deleteAppointment);

export default appointmentRouter
