import { Router } from "express";
import auth from "../../middlewares/auth.js";
import doctorController from "../../controllers/hospital/doctor.controller.js";
import validate from "../../middlewares/validate.js";
import { createDoctorSchema } from "../../validations/hospital/index.js";
import checkHospitalApproved from "../../middlewares/checkHospitalApproved.js";

const doctorRouter = Router();
const { authenticate, authorizeRoles } = auth;

doctorRouter.post("/", authenticate, authorizeRoles("hospitalAdmin"), checkHospitalApproved, validate(createDoctorSchema), doctorController.createDoctorController);
doctorRouter.get("/specialization/:specialization", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getDoctorsBySpecialization);
doctorRouter.get("/hospital/:hospitalId", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getAllDoctorsController);
doctorRouter.get("/recommendations/list", authenticate, authorizeRoles("user"), doctorController.getDoctorRecommendations);
doctorRouter.get("/:doctorId", authenticate, authorizeRoles("user", "hospitalAdmin"), doctorController.getDoctorController);
doctorRouter.put("/:doctorId", authenticate, authorizeRoles("hospitalAdmin"), checkHospitalApproved, validate(createDoctorSchema), doctorController.updateDoctorController);
doctorRouter.delete("/:doctorId", authenticate, authorizeRoles("hospitalAdmin"), checkHospitalApproved, doctorController.deleteDoctorController);

export default doctorRouter;