import reportModel from "../../models/hospital/report.model.js";
import prescriptionModel from "../../models/hospital/prescription.model.js";
import appointmentModel from "../../models/hospital/appointment.model.js";

/**
 * Health Score Service
 * Calculates patient health score (0-100) based on clinical data.
 * @param {string} userId - Patient's User ID
 * @param {number} [bmiInput] - Optional BMI input value
 * @returns {Promise<{score: number, riskLevel: string, recommendations: Array<string>}>}
 */
export const calculateHealthScore = async (userId, bmiInput) => {
    try {
        let score = 100;
        const recommendations = [];
        const riskLevelData = { LOW: "Low Risk", MODERATE: "Moderate Risk", HIGH: "High Risk" };

        // 1. Audit Biomarkers from Medical Reports
        const reports = await reportModel.find({ user: userId }).sort({ createdAt: -1 }).limit(5);
        let flaggedBiomarkersCount = 0;
        
        reports.forEach(report => {
            if (report.biomarkers && report.biomarkers.length > 0) {
                report.biomarkers.forEach(bm => {
                    if (bm.flag === "HIGH" || bm.flag === "LOW") {
                        flaggedBiomarkersCount++;
                    }
                });
            }
        });

        if (flaggedBiomarkersCount > 0) {
            const deduction = Math.min(flaggedBiomarkersCount * 4, 30);
            score -= deduction;
            recommendations.push(`Consult a practitioner regarding ${flaggedBiomarkersCount} abnormal biomarker flags in your lab reports.`);
        } else {
            recommendations.push("Biomarkers are within normal ranges based on your report logs.");
        }

        // 2. Audit Active Medications / Prescriptions
        const prescriptions = await prescriptionModel.find({ user: userId });
        let activeMedsCount = 0;
        prescriptions.forEach(p => {
            if (p.medicines) activeMedsCount += p.medicines.length;
        });

        if (activeMedsCount > 0) {
            const deduction = Math.min(activeMedsCount * 3, 20);
            score -= deduction;
            recommendations.push(`Monitor compliance and side-effects for your ${activeMedsCount} active medications.`);
        } else {
            recommendations.push("No active chronic drug therapies logged.");
        }

        // 3. Audit Appointment Attendance
        const appointments = await appointmentModel.find({ user: userId });
        const totalAppointments = appointments.length;
        const cancelledAppointments = appointments.filter(a => a.status === "rejected").length;
        
        if (totalAppointments > 0) {
            const cancelRatio = cancelledAppointments / totalAppointments;
            if (cancelRatio > 0.4) {
                score -= 10;
                recommendations.push("Maintain consistency in scheduled clinician follow-ups (high booking rejection rate).");
            }
        }

        // 4. Audit BMI (Body Mass Index)
        if (bmiInput) {
            if (bmiInput < 18.5) {
                score -= 10;
                recommendations.push(`BMI of ${bmiInput} indicates you are underweight. Consider consult with nutritional specialist.`);
            } else if (bmiInput >= 25 && bmiInput < 29.9) {
                score -= 8;
                recommendations.push(`BMI of ${bmiInput} indicates overweight threshold. Regular cardiovascular activities advised.`);
            } else if (bmiInput >= 30) {
                score -= 15;
                recommendations.push(`BMI of ${bmiInput} is in the obese range. Consult a physician to discuss active lifestyle alterations.`);
            } else {
                recommendations.push("Your body mass index (BMI) is in the optimal healthy range.");
            }
        } else {
            recommendations.push("Provide your height & weight parameters to factor BMI into your health index score.");
        }

        // Ensure score remains within [0, 100] bounds
        const finalScore = Math.max(Math.min(Math.round(score), 100), 0);

        // Determine Risk Level
        let riskLevel = riskLevelData.LOW;
        if (finalScore < 60) {
            riskLevel = riskLevelData.HIGH;
        } else if (finalScore < 80) {
            riskLevel = riskLevelData.MODERATE;
        }

        // Add fallback recommendation if everything is perfect
        if (recommendations.length === 0 || finalScore > 90) {
            recommendations.push("Maintain your current healthy routines, regular sleep, and diet balance.");
        }

        return {
            score: finalScore,
            riskLevel,
            recommendations: recommendations.slice(0, 4) // return top 4 matching recommendations
        };
    } catch (error) {
        console.error("Health Score Calculation Error:", error);
        throw error;
    }
};
