import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { uploadDocument } from "../../config/upload.js";
import {
    uploadReport,
    getReports,
    uploadPrescription,
    getPrescriptions,
    getTimeline,
    getHealthScore
} from "../../controllers/hospital/report.controller.js";

const reportRouter = Router();
const { authenticate } = auth;

// All report and timeline endpoints are protected and require a logged-in user
reportRouter.post("/upload", authenticate, uploadDocument.single("file"), uploadReport);
reportRouter.get("/", authenticate, getReports);

reportRouter.post("/prescription", authenticate, uploadDocument.single("file"), uploadPrescription);
reportRouter.get("/prescription", authenticate, getPrescriptions);

reportRouter.get("/timeline", authenticate, getTimeline);
reportRouter.get("/health-score", authenticate, getHealthScore);

export default reportRouter;
