import appointmentModel from "../../models/hospital/appointment.model.js";
import doctorModel from "../../models/hospital/doctor.model.js";
import hospitalModel from "../../models/hospital/hospital.model.js";
import sendMail from "../../services/mail.service.js";
import { appointmentEmail, appointmentApprovedEmail } from "../../utils/emailTemplates.js";
import mongoose from "mongoose";

async function createAppointmentController(req, res) {
    const user = req.user;
    const { name, reason, date, time, age, gender, phoneNo, alternateNo } = req.body;
    const { doctorId } = req.params

    try {
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor Id is required",
            });
        }
        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: "Date and Time are required",
            });
        }

        const existing = await appointmentModel.findOne({
            doctor: doctorId,
            date,
            time,
            status: { $in: ["pending", "approved"] }
        });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This time slot is already booked",
            });
        }


        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        const hospital = await hospitalModel.findById(doctor.hospital);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found",
            });
        }

        

        const newAppointment = await appointmentModel.create({
            user: user._id,
            patientName: name,
            age,
            gender,
            phoneNo,
            alternateNo,
            doctor: doctorId,
            hospital: doctor.hospital,
            reason,
            date,
            time,
            status: "pending",
        });

        const { subject, text, html } = appointmentEmail(user.name, doctor.name, hospital.name, hospital.city);
        await sendMail(user.email, subject, text, html);

        res.status(201).json({
            success: true,
            message: "Appointment created successfully",
            data: newAppointment,
        });

    } catch (error) {
        console.error("Create Appointment Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create appointment",
        });
    }
}

async function getAllAppointmentsOfHospital(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "hospitalAdmin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const hospitalId = user.hospital;
        if (!hospitalId) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found with this user",
            });
        }

        const appointments = await appointmentModel.find({ hospital: hospitalId }).populate("doctor").populate("hospital");

        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch appointments",
        });
    }
}

async function getAllAppointmentsOfUser(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "user") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const appointments = await appointmentModel.find({ user: user._id }).populate("doctor").populate("hospital");


        res.status(200).json({
            success: true,
            message: "Appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user appointments",
        });
    }
}

async function getApprovedAppointmentsOfHospital(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "hospitalAdmin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const hospitalId = user.hospital;
        if (!hospitalId) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found with this user",
            });
        }

        const appointments = await appointmentModel.find({ hospital: hospitalId, status: "approved" }).populate("doctor").populate("hospital");

        res.status(200).json({
            success: true,
            message: "Approved appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch all approved appointments",
        });
    }
}

async function getApprovedAppointmentOfUser(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "user") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const appointments = await appointmentModel.find({ user: user._id, status: "approved" }).populate("doctor").populate("hospital");

        res.status(200).json({
            success: true,
            message: "Approved appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user approved appointments",
        });
    }
}

async function getPendingAppointmentsOfHospital(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "hospitalAdmin") {
            return res.status(404).json({
                success: false,
                message: "Hospital admin not found",
            });
        }

        const hospital = user.hospital;
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found with this user",
            });
        }

        const appointments = await appointmentModel.find({ hospital: hospital._id, status: "pending" }).populate("doctor").populate("hospital");

        res.status(200).json({
            success: true,
            message: "Pending appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch all pending appointments",
        });
    }
}

async function getPendingAppointmentsOfUser(req, res) {
    const user = req.user;

    try {
        if (!user || user.role !== "user") {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        const appointments = await appointmentModel.find({ user: user._id, status: "pending" }).populate("doctor").populate("hospital");

        res.status(200).json({
            success: true,
            message: "Pending appointments fetched successfully",
            data: appointments,
        });

    } catch (error) {
        console.error("Get Appointments Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch user pending appointments",
        });
    }
}

async function getAppointment(req, res) {
    const user = req.user;
    const { appointmentId } = req.params;

    try {
        if (!user) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!mongoose.Types.ObjectId.isValid(appointmentId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid appointment ID",
            });
        }
        const appointment = await appointmentModel.findById(appointmentId).populate("doctor").populate("hospital").populate("user");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }
        if (
            (user.role === "user" && appointment.user._id.toString() !== user._id.toString()) ||
            (user.role === "hospitalAdmin" && appointment.hospital._id.toString() !== user.hospitalId.toString())
        ) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access",
            });
        }
        res.status(200).json({
            success: true,
            message: "Appointment fetched successfully",
            data: appointment,
        });

    } catch (error) {
        console.error("Get Appointment Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch appointment",
        });
    }

}

async function approveAppointment(req, res) {
    const { date, time } = req.body;
    const user = req.user;
    const { appointmentId } = req.params;

    try {
        if (!user || user.role !== "hospitalAdmin") {
            return res.status(403).json({
                success: false,
                message: "Unauthorized",
            });
        }
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }
        if (!date || !time) {
            return res.status(400).json({
                success: false,
                message: "Date and Time is required",
            });
        }

        const appointment = await appointmentModel.findById(appointmentId).populate("doctor").populate("hospital").populate("user");

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        const doctor = appointment?.doctor?.name;
        const hospital = appointment?.hospital?.name;
        const hospitalCity = appointment?.hospital?.city;
        const patient = appointment?.user;

        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Appointment is already approved/rejected",
            });
        }

        appointment.status = "approved";
        appointment.date = date;
        appointment.time = time;
        await appointment.save();

        const { subject, text, html } = appointmentApprovedEmail(patient.name, doctor, hospital, hospitalCity, date, time);
        await sendMail(patient.email, subject, text, html);

        res.status(200).json({
            success: true,
            message: "Appointment approved successfully",
            data: appointment,
        });

    } catch (error) {
        console.error("Approve Appointment Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to approve appointment",
        });
    }
}

async function deleteAppointment(req, res) {
    const user = req.user;
    const { appointmentId } = req.params;

    try {
        if (!appointmentId) {
            return res.status(400).json({
                success: false,
                message: "Appointment ID is required",
            });
        }

        const appointment = await appointmentModel.findById(appointmentId);

        if (!appointment) {
            return res.status(404).json({
                success: false,
                message: "Appointment not found",
            });
        }

        if (appointment.status !== "pending") {
            return res.status(400).json({
                success: false,
                message: "Appointment is already approved/rejected",
            });
        }

        await appointmentModel.findByIdAndDelete(appointmentId);

        res.status(200).json({
            success: true,
            message: "Appointment deleted successfully",
        });

    } catch (error) {
        console.error("Delete Appointment Error:", error); // 🔥 Debugging ke liye
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete appointment",
        });
    }
}

export default {
    createAppointmentController,
    getAllAppointmentsOfHospital,
    getAllAppointmentsOfUser,
    getApprovedAppointmentsOfHospital,
    getApprovedAppointmentOfUser,
    getPendingAppointmentsOfHospital,
    getPendingAppointmentsOfUser,
    getAppointment,
    approveAppointment,
    deleteAppointment
}
