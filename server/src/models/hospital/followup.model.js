import mongoose from "mongoose";

const followUpSchema = new mongoose.Schema({
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment",
        required: [true, "Appointment reference is required"]
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User reference is required"]
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Doctor reference is required"]
    },
    dayIndex: {
        type: Number,
        enum: [3, 7, 14],
        required: [true, "Day index timeline parameter is required"]
    },
    status: {
        type: String,
        enum: ["pending", "sent", "completed"],
        default: "pending"
    },
    responses: {
        symptomStatus: {
            type: String,
            enum: ["improving", "unchanged", "worsening"]
        },
        sideEffects: {
            type: String
        },
        additionalFeedback: {
            type: String
        }
    },
    needsDoctorAlert: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

followUpSchema.index({ appointment: 1 });
followUpSchema.index({ user: 1 });
followUpSchema.index({ doctor: 1 });
followUpSchema.index({ status: 1 });
followUpSchema.index({ needsDoctorAlert: 1 });

const followUpModel = mongoose.model("FollowUp", followUpSchema);
export default followUpModel;
