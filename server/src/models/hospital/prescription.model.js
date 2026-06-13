import mongoose from "mongoose";

const prescriptionSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User association is required"]
    },
    fileUrl: {
        type: String,
        required: [true, "Prescription file URL is required"]
    },
    fileId: {
        type: String
    },
    rawText: {
        type: String
    },
    medicines: [{
        medicine: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Medicine"
        },
        name: {
            type: String,
            required: [true, "Medicine name is required"]
        },
        dosage: {
            type: String // e.g. "500mg" or "1 tablet"
        },
        duration: {
            type: String // e.g. "5 days"
        },
        frequency: {
            type: String // e.g. "Twice daily" or "1-0-1"
        }
    }]
}, {
    timestamps: true
});

prescriptionSchema.index({ user: 1 });
prescriptionSchema.index({ createdAt: -1 });

const prescriptionModel = mongoose.model("Prescription", prescriptionSchema);
export default prescriptionModel;
