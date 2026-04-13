import mongoose from "mongoose";

// user, patientName, age, gender, phoneNo, alternateNo, doctor, hospital, reason, date, time, status

const appointmentSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "user is required"],
    },
    patientName: {
        type: String,
        required: [true, "Patient Name is required"],
        trim: true,
    },
    age: {
        type: String,
        required: [true, "Age is required"],
        trim: true,
    },
    gender: {
        type: String,
        enum: ["male", "female", "other"],
        required: [true, "Gender is required"],
        trim: true,
    },
    phoneNo: {
        type: String,
        required: [true, "Phone No is required"],
        trim: true,
    },
    alternateNo: {
        type: String,
        required: [true, "Alternate No is required"],
        trim: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Doctor",
        required: [true, "Doctor is required"],
    },
    hospital: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hospital",
        required: [true, "Hospital is required"],
    },
    reason: {
        type: String,
        required: [true, "Reason is required"],
        trim: true,
    },
    date: {
        type: String,
        required: [true, "Date is required"],
        trim: true,
    },
    time: {
        type: String,
        required: [true, "Time is required"],
        trim: true,
    },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
}, {
    timestamps: true
});

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export default appointmentModel;
    