import chatModel from "../../models/chat/chat.model.js";
import messageModel from "../../models/chat/message.model.js";
import graphService from "../../services/ai/graph.service.js";

async function createChatController(req, res) {
    const user = req.user;

    try {
        const newChat = await chatModel.create({ user: user._id });
        res.status(201).json({
            success: true,
            message: "Chat created successfully",
            data: newChat
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create chat"
        });
    }
}

async function getChatsController(req, res) {
    const user = req.user;

    try {
        const chats = await chatModel.find({ user: user._id });

        if (!chats) {
            return res.status(404).json({
                success: false,
                message: "Chats not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Chats fetched successfully",
            data: chats
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch chats"
        });
    }
}

async function sendMessageController(req, res) {
    const { chatId, message } = req.body;
    const user = req.user;

    try {
        if (!chatId || !message) {
            return res.status(400).json({
                success: false,
                message: "Chat ID and message are required"
            });
        }

        const newHumanMessage = await messageModel.create({ chat: chatId, content: message, summary: message, role: "human" });
        // const messages = await messageModel.find({ chat: chatId });
        const lastMessages = await messageModel
            .find({ chat: chatId })
            .sort({ createdAt: -1 })
            .limit(5)

        const last5Messages = lastMessages.reverse();

        let msgArr = last5Messages.map((msg) => {
            if (msg.role === "human") {
                return { role: "human", content: msg.content };
            } else {
                return { role: "ai", content: msg.summary };
            }
        });

        const AIResponse = await graphService( JSON.stringify(msgArr));
        const newAIMessage = await messageModel.create({ chat: chatId, content: JSON.stringify(AIResponse), summary: AIResponse?.final_solution?.Summary || "No summary available" , role: "ai" });

        res.status(201).json({
            success: true,
            message: "Message sent successfully",
            data: [newHumanMessage, newAIMessage]
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to send message"
        });
    }
}

async function getMessagesController(req, res) {
    const { chatId } = req.params;
    const user = req.user;

    try {
        if (!chatId) {
            return res.status(400).json({
                success: false,
                message: "Chat ID is required"
            });
        }

        const chat = await chatModel.findOne({
            _id: chatId,
            user: user._id
        });

        if (!chat) {
            return res.status(404).json({
                success: false,
                message: "Chat not found"
            });
        }

        const messages = await messageModel.find({
            chat: chatId
        });

        res.status(200).json({
            success: true,
            message: "Messages fetched successfully",
            data: messages
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch messages"
        });
    }
}

export default {
    createChatController,
    getChatsController,
    sendMessageController,
    getMessagesController
}
