import mongoose from "mongoose";

// user, hospitalName, address, city, state, country, pincode, contactNumber, email, type, speciality, isVerified

const hospitalSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"],
    },
    name: {
        type: String,
        required: [true, "Hospital name is required"],
        trim: true,
    },
    address: {
        type: String,
        required: [true, "Address is required"],
        trim: true,
    },
    city: {
        type: String,
        required: [true, "City is required"],
        trim: true,
    },
    state: {
        type: String,
        required: [true, "State is required"],
        trim: true,
    },
    country: {
        type: String,
        required: [true, "Country is required"],
        trim: true,
    },
    pincode: {
        type: String,
        required: [true, "Pincode is required"],
        trim: true,
    },
    hospitalNumber: {
        type: String,
        required: [true, "Hospital's Contact number is required"],
        trim: true,
    },
    hospitalEmail: {
        type: String,
        required: [true, "Hospital's Email is required"],
        trim: true,
    },
    type : {
        type: String,
        enum: ["public", "private"],
        required: [true, "Type is required"],
        trim: true,
    },
    speciality: {
        type: String,
        default: "",
        trim: true
    },
    workTime: {
        open : {
            type : String,
            required : [true, "Opening Time is required"]
        },
        close: {
            type : String,
            required: [true, "Closing Time is required"]
        }
    },
    status: {
        type: String,
        enum: ['PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED'],
        default: 'PENDING',
    },
    rejectionReason: {
        type: String,
    },
    resubmittedAt: {
        type: Date,
    }

}, {
    timestamps: true
})

// Database indexes for better performance
hospitalSchema.index({ name: 1 }); // Index for hospital name lookups
hospitalSchema.index({ city: 1 }); // Index for city-based searches
hospitalSchema.index({ state: 1 }); // Index for state-based searches
hospitalSchema.index({ type: 1 }); // Index for hospital type filtering
hospitalSchema.index({ speciality: "text" }); // Text index for speciality search
hospitalSchema.index({ status: 1 }); // Index for verification status
hospitalSchema.index({ user: 1 }); // Index for user-hospital relationship
hospitalSchema.index({ city: 1, type: 1 }); // Compound index for city + type searches
hospitalSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const hospitalModel = mongoose.model("Hospital", hospitalSchema);
export default hospitalModel;