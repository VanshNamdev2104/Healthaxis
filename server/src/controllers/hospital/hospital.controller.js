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

        const updatedUser = await userModel.findOneAndUpdate({ _id: user._id }, { $set: { hospital: newHospital._id } });
        
        res.status(201).json({
            success: true,
            message: "Hospital created successfully",
            data: newHospital,
            updatedUser
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

        const hospitals = await hospitalModel.find().populate("user");
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


export default {
    createHospitalController,
    getAllHospitalsController,
    getHospitalController,
    getYourHospitalController,
    deleteHospitalController,
    getHospitalAdmin
};
