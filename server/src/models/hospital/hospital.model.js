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
    contactNumber: {
        type: String,
        required: [true, "Contact number is required"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
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
    isVerified: {
        type: Boolean,
        default: false,
    }

}, {
    timestamps: true
})


const hospitalModel = mongoose.model("Hospital", hospitalSchema);
export default hospitalModel;