import mongoose from "mongoose";
import { number } from "zod";

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
    contect: {
        type: String,
        required: [true, "Phone is required"],
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
        type: number,
        default: 0
    },
}, {
    timestamps: true
})


const doctorModel = mongoose.model("Doctor", doctorSchema);
export default doctorModel;