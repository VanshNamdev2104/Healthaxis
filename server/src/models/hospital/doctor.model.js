import mongoose from "mongoose";

// hospital, name, email, contect, specialization, experience, fee

const doctorSchema = new mongoose.Schema({
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: [true, "Hospital is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        trim: true,
    },
    contact: {
        type: String,
        required: [true, "Contact Number is required"],
        trim: true,
    },
    specialization: {
        type: String,
        required: [true, "Specialization is required"],
        trim: true,
    },
    experience: {
        type: String,
        required: [true, "Experience is required"],
        trim: true,
    },
    fee: {
        type: Number,
        default: 0
    },
}, {
    timestamps: true
})

// Database indexes for better performance
doctorSchema.index({ hospital: 1 }); // Index for hospital-doctor relationship
doctorSchema.index({ name: 1 }); // Index for doctor name lookups
doctorSchema.index({ specialization: 1 }); // Index for specialization searches
doctorSchema.index({ specialization: "text", name: "text" }); // Text index for search
doctorSchema.index({ fee: 1 }); // Index for fee-based filtering
doctorSchema.index({ hospital: 1, specialization: 1 }); // Compound index for hospital + specialization
doctorSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const doctorModel = mongoose.model("Doctor", doctorSchema);
export default doctorModel;