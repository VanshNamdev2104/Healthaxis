import doctorModel from "../../models/hospital/doctor.model.js";
import userModel from "../../models/user/user.model.js";
import logger from "../../config/logger.js";


async function createDoctorController(req, res) {
    const user = req.user;
    const { name, email, contect, specialization, experience, fee } = req.body;

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
            contect,
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
        const doctors = await doctorModel.find({ hospital: hospitalId }).populate("hospital");
        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
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
    const specialization = req.params.specialization;
    try {
        if (!specialization) {
            return res.status(404).json({
                success: false,
                message: "Specialization not found",
            });
        }
        
        const doctors = await doctorModel.find({ specialization: specialization });
        res.status(200).json({
            success: true,
            message: "Doctors fetched successfully",
            data: doctors,
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
        const doctor = await doctorModel.findByIdAndDelete(doctorId);
        res.status(200).json({
            success: true,
            message: "Doctor deleted successfully",
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

export default { 
    createDoctorController, 
    getAllDoctorsController, 
    getDoctorController,
    getDoctorsBySpecialization,
    deleteDoctorController
}