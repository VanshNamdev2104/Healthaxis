import hospitalModel from "../../models/hospital/hospital.model.js";
import doctorModel from "../../models/hospital/doctor.model.js";
import appointmentModel from "../../models/hospital/appointment.model.js";
import userModel from "../../models/user/user.model.js";
import logger from "../../config/logger.js";

//All controller related to hospitals
async function createHospitalController(req, res) {
    const user = req.user;
    const { hospitalName, address, city, state, country, pincode, contactNumber, email, type, speciality, openingTime, closingTime } = req.body;

    try {
        const isHospitalExists = await hospitalModel.findOne({ user: user._id });
        if (isHospitalExists) {
            return res.status(400).json({
                success: false,
                message: "Hospital already exists with this user",
            });
        }

        const newHospital = await hospitalModel.create({
            user: user._id,
            name: hospitalName,
            address,
            city,
            state,
            country,
            pincode,
            hospitalNumber: contactNumber,
            hospitalEmail: email,
            type,
            speciality,
            workTime : {
                open : openingTime,
                close : closingTime
            }
        });

        // Associate hospital with user, but role remains 'user' until approved by admin
        const updatedUser = await userModel.findOneAndUpdate(
            { _id: user._id }, 
            { $set: { hospital: newHospital._id } },
            { new: true }
        );
        
        res.status(201).json({
            success: true,
            message: "Hospital created successfully",
            data: newHospital,
            
        });
    }
    catch (error) {
        logger.error("Create Hospital Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create hospital",
        });
    }
}

async function getAllHospitalsController(req, res) {
    const user = req.user;

    try {

        const hospitals = await hospitalModel.find({ status: 'APPROVED' }).populate("user");
        res.status(200).json({
            success: true,
            message: "Hospitals fetched successfully",
            data: hospitals,
        });
    }
    catch (error) {
        logger.error("Get Hospitals Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch hospitals",
        });
    }
}

async function getHospitalController(req, res) {
    const user = req.user;
    const { hospitalId } = req.params;
    try {
        if (!hospitalId) {
            return res.status(400).json({
                success: false,
                message: "Hospital ID is required",
            });
        }
        const hospital = await hospitalModel.findById(hospitalId).populate("user");
        res.status(200).json({
            success: true,
            message: "Hospital fetched successfully",
            data: hospital,
        });
    } catch (error) {
        logger.error("Get Hospital Error", { 
            error: error.message, 
            stack: error.stack,
            hospitalId,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch hospital",
        });
    }
}

async function getYourHospitalController(req, res) {
    const user = req.user;
    try {
        if (!user.hospital) {
            return res.status(400).json({
                success: false,
                message: "Hospital not found for this user",
            });
        }
        const hospital = await hospitalModel.findById(user.hospital).populate("user");
        res.status(200).json({
            success: true,
            message: "Your Hospital fetched successfully",
            data: hospital,
        });
    } catch (error) {
        logger.error("Get Your Hospital Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch your hospital",
        });
    }
}

async function deleteHospitalController(req, res) {
    const user = req.user;

    try {
        if (user.role !== "hospitalAdmin") {
            return res.status(403).json({
                success: false,
                message: "Access denied",
            });
        }

        
        if (!user.hospital) {
            return res.status(400).json({
                success: false,
                message: "No hospital assigned to this user",
            });
        }

        //  Check hospital exists
        const hospital = await hospitalModel.findById(user.hospital);
        if (!hospital) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found",
            });
        }

        // related data delete (important)
        await doctorModel.deleteMany({ hospital: user.hospital });
        await appointmentModel.deleteMany({ hospital: user.hospital });

        //  Delete hospital
        await hospitalModel.findByIdAndDelete(user.hospital);

        //  Remove hospital from user
        user.hospital = null;
        await user.save();

        res.status(200).json({
            success: true,
            message: "Hospital and related data deleted successfully",
        });

    } catch (error) {
        logger.error("Delete Hospital Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete hospital",
        });
    }
}

async function getHospitalAdmin(req, res) {
    const user = req.user;
    try {
        
        res.status(200).json({
            success: true,
            message: "Your Hospital fetched successfully",
            user,
            
        });
    } catch (error) {
        logger.error("Get Hospital Admin Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch  hospital Admin",
        });
    }
}


async function resubmitHospitalController(req, res) {
    const user = req.user;
    const { hospitalName, address, city, state, country, pincode, contactNumber, email, type, speciality, openingTime, closingTime } = req.body;

    try {
        const hospital = await hospitalModel.findOne({ user: user._id });
        if (!hospital) {
            return res.status(404).json({ success: false, message: "Hospital not found" });
        }

        if (hospital.status !== 'REJECTED') {
            return res.status(400).json({ success: false, message: "Only rejected profiles can be resubmitted" });
        }

        const updatedHospital = await hospitalModel.findByIdAndUpdate(hospital._id, {
            name: hospitalName,
            address,
            city,
            state,
            country,
            pincode,
            hospitalNumber: contactNumber,
            hospitalEmail: email,
            type,
            speciality,
            workTime : { open : openingTime, close : closingTime },
            status: 'PENDING',
            resubmittedAt: new Date(),
            rejectionReason: ""
        }, { new: true });

        res.status(200).json({
            success: true,
            message: "Hospital resubmitted successfully",
            data: updatedHospital,
        });
    } catch (error) {
        logger.error("Resubmit Hospital Error", { error: error.message, userId: user._id });
        return res.status(500).json({ success: false, message: error.message || "Failed to resubmit hospital" });
    }
}

async function getHospitalAnalytics(req, res) {
    const user = req.user;

    try {
        if (user.role !== "hospitalAdmin") {
            return res.status(403).json({ success: false, message: "Access denied. Restricted to hospital administrators." });
        }

        const hospitalId = user.hospital;
        if (!hospitalId) {
            return res.status(400).json({ success: false, message: "No hospital assigned to this user" });
        }

        // Fetch doctors and appointments
        const doctors = await doctorModel.find({ hospital: hospitalId });
        const appointments = await appointmentModel.find({ hospital: hospitalId }).populate("doctor");

        // Calculate metrics
        const totalAppointments = appointments.length;
        const approvedAppointments = appointments.filter(a => a.status === "approved" || a.status === "APPROVED");
        const pendingAppointments = appointments.filter(a => a.status === "pending" || a.status === "PENDING");
        const cancelledAppointments = appointments.filter(a => a.status === "rejected" || a.status === "REJECTED");

        // Total Revenues: sum of approved consult fees
        const totalRevenue = approvedAppointments.reduce((sum, app) => {
            return sum + (app.doctor?.fee || 0);
        }, 0);

        // Utilization: approved / total (with fallback)
        const utilizationRate = totalAppointments > 0 
            ? Math.round((approvedAppointments.length / totalAppointments) * 100) 
            : 0;

        // Repeat vs unique patients
        const patientCounts = {};
        appointments.forEach(app => {
            const name = app.patientName || app.name || "Unknown";
            patientCounts[name] = (patientCounts[name] || 0) + 1;
        });
        const uniquePatients = Object.keys(patientCounts).length;
        const repeatPatients = Object.values(patientCounts).filter(c => c > 1).length;

        // Doctor Performance
        const doctorStats = doctors.map(doc => {
            const docApps = appointments.filter(a => a.doctor?._id.toString() === doc._id.toString());
            const approved = docApps.filter(a => a.status === "approved" || a.status === "APPROVED").length;
            const revenue = docApps.reduce((s, a) => s + (doc.fee || 0), 0);
            return {
                name: doc.name,
                specialization: doc.specialization,
                totalBookings: docApps.length,
                approvedBookings: approved,
                revenue
            };
        });

        // Monthly bookings trend (for charting)
        // Group by month name (last 6 months)
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyTrend = {};
        
        // Seed last 6 months
        for (let i = 5; i >= 0; i--) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const mName = months[d.getMonth()];
            monthlyTrend[mName] = { month: mName, bookings: 0, revenue: 0 };
        }

        appointments.forEach(app => {
            const appDate = new Date(app.date);
            const mName = months[appDate.getMonth()];
            if (monthlyTrend[mName]) {
                monthlyTrend[mName].bookings += 1;
                if (app.status === "approved" || app.status === "APPROVED") {
                    monthlyTrend[mName].revenue += (app.doctor?.fee || 0);
                }
            }
        });

        res.status(200).json({
            success: true,
            data: {
                summary: {
                    totalRevenue,
                    utilizationRate,
                    totalAppointments,
                    approvedAppointments: approvedAppointments.length,
                    pendingAppointments: pendingAppointments.length,
                    cancelledAppointments: cancelledAppointments.length,
                    uniquePatients,
                    repeatPatients
                },
                doctorPerformance: doctorStats,
                monthlyTrend: Object.values(monthlyTrend)
            }
        });

    } catch (error) {
        logger.error("Get Hospital Analytics Error", { error: error.message, userId: user._id });
        return res.status(500).json({ success: false, message: error.message || "Failed to fetch analytics" });
    }
}

export default {
    createHospitalController,
    getAllHospitalsController,
    getHospitalController,
    getYourHospitalController,
    deleteHospitalController,
    getHospitalAdmin,
    resubmitHospitalController,
    getHospitalAnalytics
};
