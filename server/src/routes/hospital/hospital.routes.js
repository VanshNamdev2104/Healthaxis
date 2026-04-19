import {Router} from "express"
import auth from "../../middlewares/auth.js";
import hospitalController from "../../controllers/hospital/hospital.controller.js";

const hospitalRouter = Router();
const { authenticate, authorizeRoles } = auth;

hospitalRouter.post("/", authenticate, authorizeRoles("hospitalAdmin"), hospitalController.createHospitalController);
hospitalRouter.get("/", authenticate, authorizeRoles("user", "admin"), hospitalController.getAllHospitalsController);
hospitalRouter.get("/me", authenticate, authorizeRoles( "hospitalAdmin"), hospitalController.getYourHospitalController);
hospitalRouter.delete("/me", authenticate, authorizeRoles("hospitalAdmin"), hospitalController.deleteHospitalController);
hospitalRouter.get("/admin", authenticate, authorizeRoles("hospitalAdmin"), hospitalController.getHospitalAdmin);
hospitalRouter.get("/:hospitalId", authenticate, authorizeRoles("user", "admin"), hospitalController.getHospitalController);
export default hospitalRouter