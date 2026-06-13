import { submitFollowUpResponse, checkAndSendFollowUps } from "../../services/followup.service.js";
import followUpModel from "../../models/hospital/followup.model.js";
import logger from "../../config/logger.js";

/**
 * Patient submits follow-up feedback survey
 */
export const submitFollowUp = async (req, res, next) => {
    try {
        const { followUpId } = req.params;
        const { symptomStatus, sideEffects, additionalFeedback } = req.body;

        if (!symptomStatus) {
            return res.status(400).json({ success: false, message: "Symptom status is required" });
        }

        logger.info(`Submitting follow-up response for ID: ${followUpId}`);
        const updatedFollowUp = await submitFollowUpResponse(followUpId, {
            symptomStatus,
            sideEffects,
            additionalFeedback
        });

        res.status(200).json({
            success: true,
            message: "Follow-up check-in completed successfully",
            data: updatedFollowUp
        });
    } catch (error) {
        logger.error(`Error in submitFollowUp: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Fetch follow-up check-ins.
 * For Patients: returns their follow-up surveys.
 * For Hospital Admins: returns follow-ups with needsDoctorAlert = true for their hospital's doctors.
 */
export const getFollowUps = async (req, res, next) => {
    try {
        const { role, _id, hospital } = req.user;

        if (role === "hospitalAdmin") {
            if (!hospital) {
                return res.status(400).json({ success: false, message: "Hospital association not found for this admin" });
            }

            // Find follow-ups for doctors in this admin's hospital with alerts flagged
            const alerts = await followUpModel.find({ needsDoctorAlert: true })
                .populate("user", "name email contact profileImage")
                .populate({
                    path: "doctor",
                    match: { hospital: hospital },
                    select: "name specialization"
                })
                .sort({ updatedAt: -1 });

            // Filter out followups where the doctor did not match the admin's hospital
            const filteredAlerts = alerts.filter(fu => fu.doctor !== null);

            return res.status(200).json({ success: true, data: filteredAlerts });
        } else {
            // For standard user: fetch their follow-ups (both sent and completed)
            const surveys = await followUpModel.find({ user: _id })
                .populate("doctor", "name specialization profileImage")
                .sort({ createdAt: -1 });

            return res.status(200).json({ success: true, data: surveys });
        }
    } catch (error) {
        logger.error(`Error in getFollowUps: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * Endpoint to manually trigger check and dispatch of follow-up surveys
 */
export const triggerCheckDaemon = async (req, res, next) => {
    try {
        await checkAndSendFollowUps();
        res.status(200).json({ success: true, message: "Follow-up check-in daemon triggered successfully" });
    } catch (error) {
        logger.error(`Error triggering follow-up daemon: ${error.message}`);
        res.status(500).json({ success: false, message: error.message });
    }
};
