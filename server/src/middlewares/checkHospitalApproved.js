import Hospital from "../models/hospital/hospital.model.js";
import { forbiddenResponse } from "../utils/responsehandler.js";

/**
 * Middleware to verify that the hospitalAdmin's hospital is approved and active.
 * Bypassed for regular users and super admins.
 */
export const checkHospitalApproved = async (req, res, next) => {
    try {
        const user = req.user;

        if (user && user.role === "hospitalAdmin") {
            if (!user.hospital) {
                return forbiddenResponse(res, "No hospital is currently assigned to this user profile.");
            }

            const hospital = await Hospital.findById(user.hospital);
            if (!hospital) {
                return forbiddenResponse(res, "The hospital profile associated with this user could not be found.");
            }

            if (hospital.status !== "APPROVED") {
                return forbiddenResponse(
                    res, 
                    `Access denied. Your hospital status is currently '${hospital.status}'. Only approved hospitals can perform this action.`
                );
            }
        }

        next();
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message || "Failed to verify hospital approval status."
        });
    }
};

export default checkHospitalApproved;
