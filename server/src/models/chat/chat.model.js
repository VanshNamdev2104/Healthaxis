import mongoose from "mongoose";

const chatSchema = new mongoose.Schema({
    user : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    },
    title: {
        type: String,
        default: "New Chat " + Date.now(),
        trim: true
    }
}, {
    timestamps: true
});

// Database indexes for better performance
chatSchema.index({ user: 1 }); // Index for user-specific chat queries
chatSchema.index({ user: 1, createdAt: -1 }); // Compound index for user's chats sorted by date
chatSchema.index({ createdAt: -1 }); // Index for sorting by creation date
chatSchema.index({ title: "text" }); // Text index for chat title search

const chatModel = mongoose.model("Chat", chatSchema);
export default chatModel;