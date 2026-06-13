import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Notification target user is required"]
    },
    title: {
        type: String,
        required: [true, "Notification title is required"],
        trim: true
    },
    message: {
        type: String,
        required: [true, "Notification description message is required"],
        trim: true
    },
    type: {
        type: String,
        enum: ["appointment", "approval", "report", "followup", "reminder", "system"],
        required: [true, "Notification category type is required"]
    },
    read: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

notificationSchema.index({ user: 1 });
notificationSchema.index({ read: 1 });
notificationSchema.index({ createdAt: -1 });

const notificationModel = mongoose.model("Notification", notificationSchema);
export default notificationModel;
