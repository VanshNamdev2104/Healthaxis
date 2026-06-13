import mongoose from "mongoose";

const callSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: [true, "Meeting Room ID is required"],
        unique: true
    },
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment"
    },
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number // in seconds
    }
}, {
    timestamps: true
});

callSchema.index({ roomId: 1 });
callSchema.index({ appointment: 1 });

const callModel = mongoose.model("Call", callSchema);
export default callModel;
