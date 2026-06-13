import { Router } from "express";
import auth from "../middlewares/auth.js";
import {
    getNotifications,
    markAsRead,
    deleteNotification
} from "../controllers/notification.controller.js";

const notificationRouter = Router();
const { authenticate } = auth;

notificationRouter.get("/", authenticate, getNotifications);
notificationRouter.put("/read-all", authenticate, markAsRead);
notificationRouter.put("/:notificationId/read", authenticate, markAsRead);
notificationRouter.delete("/:notificationId", authenticate, deleteNotification);

export default notificationRouter;
