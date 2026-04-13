import { Router } from "express";
import auth from "../../middlewares/auth.js";
import doctorController from "../../controllers/hospital/doctor.controller.js";

const doctorRouter = Router();
const { authenticate, authorizeRoles } = auth;

doctorRouter.post("/", authenticate, authorizeRoles("hospitalAdmin"), doctorController.createDoctorController);
doctorRouter.get("/specialization/:specialization", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getDoctorsBySpecialization);
doctorRouter.get("/hospital/:hospitalId", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getAllDoctorsController);
doctorRouter.get("/:doctorId", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getDoctorController);
doctorRouter.delete("/:doctorId", authenticate, authorizeRoles("hospitalAdmin"), doctorController.deleteDoctorController);

export default doctorRouter