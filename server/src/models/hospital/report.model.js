import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User association is required"]
    },
    reportType: {
        type: String,
        required: [true, "Report type is required"],
        trim: true
    },
    fileUrl: {
        type: String,
        required: [true, "File URL is required"]
    },
    fileId: {
        type: String
    },
    extractedText: {
        type: String
    },
    summary: {
        type: String
    },
    biomarkers: [{
        name: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String },
        flag: { type: String, enum: ["NORMAL", "HIGH", "LOW"], default: "NORMAL" }
    }]
}, {
    timestamps: true
});

reportSchema.index({ user: 1 });
reportSchema.index({ createdAt: -1 });

const reportModel = mongoose.model("Report", reportSchema);
export default reportModel;
