import { Router } from "express";
import auth from "../../middlewares/auth.js";
import {
    startCall,
    endCall,
    getCallHistory
} from "../../controllers/hospital/call.controller.js";

const callRouter = Router();
const { authenticate } = auth;

callRouter.post("/start", authenticate, startCall);
callRouter.post("/end", authenticate, endCall);
callRouter.get("/history", authenticate, getCallHistory);

export default callRouter;
