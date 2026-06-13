import followUpModel from "../models/hospital/followup.model.js";
import mongoose from "mongoose";
import appointmentModel from "../models/hospital/appointment.model.js";
import notificationModel from "../models/notification.model.js";
import sendMail from "./mail.service.js";
import logger from "../config/logger.js";

/**
 * Creates follow-up milestones (Day 3, Day 7, Day 14) for an approved appointment.
 * @param {string} appointmentId 
 * @param {string} userId 
 * @param {string} doctorId 
 */
export const createFollowUpsForAppointment = async (appointmentId, userId, doctorId) => {
    try {
        const milestones = [3, 7, 14];
        const promises = milestones.map(day => {
            return followUpModel.create({
                appointment: appointmentId,
                user: userId,
                doctor: doctorId,
                dayIndex: day,
                status: "pending"
            });
        });
        await Promise.all(promises);
        logger.info(`Follow-up milestones initialized for appointment: ${appointmentId}`);
    } catch (error) {
        logger.error(`Error creating follow-ups: ${error.message}`);
    }
};

/**
 * Evaluates pending follow-ups and dispatches surveys when milestones are reached.
 */
export const checkAndSendFollowUps = async () => {
    try {
        logger.info("Executing follow-up survey check-in daemon...");
        
        // Find all pending follow-ups
        const pendingFollowUps = await followUpModel.find({ status: "pending" })
            .populate("appointment")
            .populate("user")
            .populate("doctor");

        const now = new Date();

        for (const fu of pendingFollowUps) {
            if (!fu.appointment || fu.appointment.status !== "approved") continue;

            const appointmentDate = new Date(fu.appointment.date);
            const daysElapsed = Math.floor((now - appointmentDate) / (1000 * 60 * 60 * 24));

            if (daysElapsed >= fu.dayIndex) {
                // Time to send follow-up!
                fu.status = "sent";
                await fu.save();

                // 1. Create In-App Notification
                await notificationModel.create({
                    user: fu.user._id,
                    title: `Day ${fu.dayIndex} Check-in Survey`,
                    message: `Please complete the symptom feedback check-in for your visit with Dr. ${fu.doctor.name}.`,
                    type: "followup"
                });

                // 2. Dispatch Email Check-in Survey
                if (fu.user.email) {
                    const surveyUrl = `${process.env.CLIENT_URL || "http://localhost:5173"}/dashboard?tab=Timeline`;
                    const subject = `How are you feeling? Day ${fu.dayIndex} Follow-up - HealthAxis`;
                    const text = `Hello ${fu.user.name},\n\nThis is your Day ${fu.dayIndex} follow-up check-in regarding your visit with Dr. ${fu.doctor.name}.\n\nPlease complete your check-in questionnaire by visiting your health timeline: ${surveyUrl}\n\nThank you,\nHealthAxis Team`;
                    const html = `
                        <p>Hello <strong>${fu.user.name}</strong>,</p>
                        <p>This is your <strong>Day ${fu.dayIndex} follow-up</strong> check-in regarding your visit with <strong>Dr. ${fu.doctor.name}</strong>.</p>
                        <p>We want to ensure your symptoms are improving. Please complete the quick check-in survey in your dashboard portal.</p>
                        <br/>
                        <a href="${surveyUrl}" style="background-color: #10b981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Complete Survey</a>
                        <br/><br/>
                        <p>Thank you,<br/>HealthAxis Team</p>
                    `;
                    sendMail(fu.user.email, subject, text, html).catch(err => {
                        logger.error(`Failed to send follow-up email to ${fu.user.email}: ${err.message}`);
                    });
                }
            }
        }
    } catch (error) {
        logger.error(`Error in checkAndSendFollowUps daemon: ${error.message}`);
    }
};

/**
 * Submits follow-up check-in responses from patient.
 * @param {string} followUpId 
 * @param {object} responseData 
 * @param {string} responseData.symptomStatus - improving/unchanged/worsening
 * @param {string} responseData.sideEffects 
 * @param {string} responseData.additionalFeedback 
 */
export const submitFollowUpResponse = async (followUpId, { symptomStatus, sideEffects, additionalFeedback }) => {
    const fu = await followUpModel.findById(followUpId).populate("user").populate("doctor");
    if (!fu) throw new Error("Follow-up log not found");

    fu.responses = { symptomStatus, sideEffects, additionalFeedback };
    fu.status = "completed";

    // Alert doctor if symptoms are worsening or severe side effects occur
    if (symptomStatus === "worsening" || (sideEffects && sideEffects.toLowerCase().includes("severe"))) {
        fu.needsDoctorAlert = true;

        // Dispatch alert notification to the affiliated doctor's clinic / hospitalAdmin
        // Since doctor doesn't have direct user login, notify their hospitalAdmin user profile
        if (fu.doctor && fu.doctor.hospital) {
            const hospitalAdminUser = await mongoose.model("User").findOne({ hospital: fu.doctor.hospital, role: "hospitalAdmin" });
            if (hospitalAdminUser) {
                await notificationModel.create({
                    user: hospitalAdminUser._id,
                    title: `⚠️ Alert: Patient Condition Follow-up`,
                    message: `Patient ${fu.user.name} reported worsening symptoms/side-effects during their Day ${fu.dayIndex} follow-up with Dr. ${fu.doctor.name}.`,
                    type: "system"
                });
            }
        }
    }

    await fu.save();
    return fu;
};
