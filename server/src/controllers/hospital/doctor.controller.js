import doctorModel from "../../models/hospital/doctor.model.js";
import userModel from "../../models/user/user.model.js";
import appointmentModel from "../../models/hospital/appointment.model.js";
import logger from "../../config/logger.js";
import { recommendDoctors } from "../../services/ai/doctorRecommendation.service.js";


async function createDoctorController(req, res) {
    const user = req.user;
    const { name, email, contact, specialization, experience, fee } = req.body;

    try {
        
        if (user.role !== "hospitalAdmin") {
            return res.status(400).json({
                success: false,
                message: "User role is not hospital admin",
            });
        }
        const hospitalId = user.hospital

        if (!hospitalId) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found",
            });
        }
        const newDoctor = await doctorModel.create({
            hospital: hospitalId,
            name,
            email,
            contact,
            specialization,
            experience,
            fee,
        });
        res.status(201).json({
            success: true,
            message: "Doctor created successfully",
            data: newDoctor,
        });
    }
    catch (error) {
        logger.error("Create Doctor Error", { 
            error: error.message, 
            stack: error.stack,
            userId: user._id 
        });
        console.log(error);
        
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to create doctor",
        });
    }
}

async function getAllDoctorsController(req, res) {
    const user = req.user;
    const hospitalId = req.params.hospitalId

    try {
        if (!hospitalId) {
            return res.status(404).json({
                success: false,
                message: "Hospital not found",
            });
        }
        
        // IDOR Check: hospitalAdmin can only access their own hospital's roster
        if (user && user.role === "hospitalAdmin" && user.hospital && user.hospital.toString() !== hospitalId) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You can only fetch your own hospital's doctors.",
            });
        }

        let query = { hospital: hospitalId };
        if (user && user.role === 'user') {
            query.status = 'APPROVED';
        }
        const doctors = await doctorModel.find(query).populate({
            path: 'hospital',
            match: (user && user.role === 'user') ? { status: 'APPROVED' } : {}
        });
        
        const filteredDoctors = (user && user.role === 'user') ? doctors.filter(d => d.hospital !== null) : doctors;

        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: filteredDoctors,
        });
    }
    catch (error) {
        logger.error("Get Doctors Error", { 
            error: error.message, 
            stack: error.stack,
            hospitalId,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch doctors",
        });
    }
}

async function getDoctorController(req, res) {
    const user = req.user;
    const {doctorId} = req.params;

    try {
        if (!doctorId) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }
        const doctor = await doctorModel.findById(doctorId).populate("hospital");
        res.status(200).json({
            success: true,
            message: "Doctor fetched successfully",
            data: doctor,
        });
    }
    catch (error) {
        logger.error("Get Doctor Error", { 
            error: error.message, 
            stack: error.stack,
            doctorId,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch doctor",
        });
    }
}

async function getDoctorsBySpecialization(req, res) {
    const user = req.user;
    const specialization = req.params.specialization;
    try {
        if (!specialization) {
            return res.status(404).json({
                success: false,
                message: "Specialization not found",
            });
        }
        
        let query = { specialization: specialization };
        if (!user || user.role === 'user') {
            query.status = 'APPROVED';
        }
        
        const doctors = await doctorModel.find(query).populate({
            path: 'hospital',
            match: (!user || user.role === 'user') ? { status: 'APPROVED' } : {}
        });

        const filteredDoctors = (!user || user.role === 'user') ? doctors.filter(d => d.hospital !== null) : doctors;

        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: filteredDoctors,
        });
    }
    catch (error) {
        logger.error("Get Doctors Error", { 
            error: error.message, 
            stack: error.stack,
            specialization,
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to fetch doctors",
        });
    }
}

async function deleteDoctorController(req, res) {
    const user = req.user;
    const {doctorId} = req.params;

    try {
        if (!doctorId) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        // IDOR check: doctor must belong to the user's hospital
        if (doctor.hospital.toString() !== user.hospital.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to delete this doctor.",
            });
        }

        // Cascade delete appointments of this doctor
        await appointmentModel.deleteMany({ doctor: doctorId });

        await doctorModel.findByIdAndDelete(doctorId);

        res.status(200).json({
            success: true,
            message: "Doctor and associated appointments deleted successfully",
            data: doctor,
        });
    }
    catch (error) {
        logger.error("Delete Doctor Error", { 
            error: error.message, 
            stack: error.stack,
            doctorId,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to delete doctor",
        });
    }
}

async function updateDoctorController(req, res) {
    const user = req.user;
    const { doctorId } = req.params;
    const { name, email, contact, specialization, experience, fee } = req.body;

    try {
        if (!doctorId) {
            return res.status(400).json({
                success: false,
                message: "Doctor ID is required",
            });
        }

        const doctor = await doctorModel.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: "Doctor not found",
            });
        }

        // IDOR check: doctor must belong to the user's hospital
        if (doctor.hospital.toString() !== user.hospital.toString()) {
            return res.status(403).json({
                success: false,
                message: "Access denied. You do not have permission to update this doctor.",
            });
        }

        const updatedDoctor = await doctorModel.findByIdAndUpdate(
            doctorId,
            { name, email, contact, specialization, experience, fee },
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: "Doctor updated successfully",
            data: updatedDoctor,
        });
    } catch (error) {
        logger.error("Update Doctor Error", { 
            error: error.message, 
            stack: error.stack,
            doctorId,
            userId: user._id 
        });
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to update doctor",
        });
    }
}

async function getDoctorRecommendations(req, res) {
    try {
        const { symptoms, disease, specialization, language, budget, location } = req.query;
        const recommendations = await recommendDoctors({
            symptoms,
            disease,
            specialization,
            language,
            budget: budget ? parseFloat(budget) : undefined,
            location
        });

        res.status(200).json({
            success: true,
            message: "Doctor recommendations computed successfully",
            data: recommendations
        });
    } catch (error) {
        logger.error(`Error in getDoctorRecommendations: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
}

export default { 
    createDoctorController, 
    getAllDoctorsController, 
    getDoctorController,
    getDoctorsBySpecialization,
    deleteDoctorController,
    updateDoctorController,
    getDoctorRecommendations
}