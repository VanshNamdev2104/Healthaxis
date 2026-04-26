import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    chat : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Chat"
    },
    content : {
        type : String,
        required : true
    },
    summary : {
        type : String,
        default : ""
    },
    role: {
        type: String,
        enum: ["human", "ai"],
        default: "human",
    }
}, {
    timestamps: true
})

// Database indexes for better performance
messageSchema.index({ chat: 1 }); // Index for chat-specific message queries
messageSchema.index({ chat: 1, createdAt: 1 }); // Compound index for messages in chronological order
messageSchema.index({ role: 1 }); // Index for role-based queries
messageSchema.index({ createdAt: -1 }); // Index for sorting by creation date
messageSchema.index({ content: "text" }); // Text index for message content search

const messageModel = mongoose.model("Message", messageSchema);
export default messageModel;