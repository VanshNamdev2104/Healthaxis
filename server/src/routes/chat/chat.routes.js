import { Router } from "express";
import chatController from "../../controllers/chats/chat.controller.js";
import auth from "../../middlewares/auth.js"

const chatRoutes = Router();

chatRoutes.post("/", auth.authenticate, auth.authorizeRoles("user", "admin") , chatController.createChatController);
chatRoutes.get("/", auth.authenticate, auth.authorizeRoles("user", "admin"), chatController.getChatsController);
chatRoutes.get("/:chatId", auth.authenticate, auth.authorizeRoles("user", "admin"), chatController.getChatByIdController);
chatRoutes.get("/:chatId/messages", auth.authenticate, auth.authorizeRoles("user", "admin"), chatController.getMessagesController);
chatRoutes.post("/message", auth.authenticate, auth.authorizeRoles("user", "admin"), chatController.sendMessageController);
chatRoutes.delete("/:chatId", auth.authenticate, auth.authorizeRoles("user", "admin"), chatController.deleteChatController);

export default chatRoutes;