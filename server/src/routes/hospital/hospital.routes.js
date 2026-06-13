import {Router} from "express"
import auth from "../../middlewares/auth.js";
import hospitalController from "../../controllers/hospital/hospital.controller.js";
import validate from "../../middlewares/validate.js";
import { createHospitalSchema } from "../../validations/hospital/index.js";

const hospitalRouter = Router();
const { authenticate, authorizeRoles } = auth;

hospitalRouter.post("/", authenticate, authorizeRoles("user", "hospitalAdmin"), validate(createHospitalSchema), hospitalController.createHospitalController);
hospitalRouter.get("/", authenticate, authorizeRoles("user", "admin"), hospitalController.getAllHospitalsController);
hospitalRouter.get("/me", authenticate, authorizeRoles("user", "hospitalAdmin"), hospitalController.getYourHospitalController);
hospitalRouter.delete("/me", authenticate, authorizeRoles("hospitalAdmin"), hospitalController.deleteHospitalController);
hospitalRouter.get("/admin", authenticate, authorizeRoles("user", "hospitalAdmin"), hospitalController.getHospitalAdmin);
hospitalRouter.get("/analytics", authenticate, authorizeRoles("hospitalAdmin"), hospitalController.getHospitalAnalytics);
hospitalRouter.get("/:hospitalId", authenticate, authorizeRoles("user", "admin"), hospitalController.getHospitalController);
hospitalRouter.put("/resubmit", authenticate, authorizeRoles("user", "hospitalAdmin"), validate(createHospitalSchema), hospitalController.resubmitHospitalController);

export default hospitalRouter;