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

// Database indexes for better performance
appointmentSchema.index({ user: 1 }); // Index for user appointments
appointmentSchema.index({ doctor: 1 }); // Index for doctor appointments
appointmentSchema.index({ hospital: 1 }); // Index for hospital appointments
appointmentSchema.index({ status: 1 }); // Index for status filtering
appointmentSchema.index({ date: 1 }); // Index for date-based queries
appointmentSchema.index({ user: 1, status: 1 }); // Compound index for user + status
appointmentSchema.index({ doctor: 1, date: 1 }); // Compound index for doctor + date
appointmentSchema.index({ hospital: 1, status: 1 }); // Compound index for hospital + status
appointmentSchema.index({ date: 1, time: 1 }); // Compound index for date + time
appointmentSchema.index({ createdAt: -1 }); // Index for sorting by creation date

const appointmentModel = mongoose.model("Appointment", appointmentSchema);
export default appointmentModel;
    