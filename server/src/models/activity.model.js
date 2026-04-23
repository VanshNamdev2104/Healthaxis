import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["user", "hospital", "doctor", "appointment", "system"],
            required: true,
        },
        action: {
            type: String,
            required: true,
            // Examples: "created", "updated", "deleted", "approved", "rejected", "suspended"
        },
        description: {
            type: String,
            required: true,
        },
        targetModel: {
            type: String,
            enum: ["User", "Hospital", "Doctor", "Appointment", "Medicine", "Disease"],
        },
        targetId: {
            type: mongoose.Schema.Types.ObjectId,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        details: {
            type: mongoose.Schema.Types.Mixed,
            default: {},
        },
        status: {
            type: String,
            enum: ["success", "failed"],
            default: "success",
        },
    },
    {
        timestamps: true,
    }
);

// Index for faster queries
activitySchema.index({ createdAt: -1 });
activitySchema.index({ userId: 1 });
activitySchema.index({ type: 1 });
activitySchema.index({ targetModel: 1, targetId: 1 });

const Activity = mongoose.model("Activity", activitySchema);

export default Activity;
