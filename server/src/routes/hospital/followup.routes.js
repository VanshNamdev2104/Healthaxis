import { Router } from "express";
import auth from "../../middlewares/auth.js";
import {
    getFollowUps,
    submitFollowUp,
    triggerCheckDaemon
} from "../../controllers/hospital/followup.controller.js";

const followupRouter = Router();
const { authenticate } = auth;

followupRouter.get("/", authenticate, getFollowUps);
followupRouter.post("/:followUpId/submit", authenticate, submitFollowUp);
followupRouter.post("/trigger", authenticate, triggerCheckDaemon);

export default followupRouter;
