import doctorModel from "../../models/hospital/doctor.model.js";
import hospitalModel from "../../models/hospital/hospital.model.js";

/**
 * AI Doctor Recommendation Service
 * Recommends top matching doctors based on weighted parameters.
 * @param {object} params - Recommendation inputs
 * @param {string} params.symptoms - Patient symptoms description
 * @param {string} params.disease - Detected or suspected disease
 * @param {string} params.specialization - Requested medical specialty
 * @param {string} params.language - Preferred language (optional)
 * @param {number} params.budget - Maximum consultation fee limit
 * @param {string} params.location - Preferred city/location
 * @returns {Promise<Array<{doctor: object, score: number, availability: boolean}>>}
 */
export const recommendDoctors = async ({ symptoms, disease, specialization, language, budget, location }) => {
    try {
        // Query approved doctors and populate hospital details
        const doctors = await doctorModel.find({ status: "APPROVED" }).populate("hospital");
        const recommendations = [];

        for (const doc of doctors) {
            if (!doc.hospital || doc.hospital.status !== "APPROVED") continue;

            let score = 0;
            const reasons = [];

            // 1. Specialty Match (Weight: 45%)
            if (specialization && doc.specialization?.toLowerCase().includes(specialization.toLowerCase())) {
                score += 45;
                reasons.push("Specialization matches request");
            } else if (symptoms || disease) {
                // Fuzzy match symptoms or disease with specialization
                const specLower = doc.specialization?.toLowerCase() || "";
                const searchText = `${symptoms || ""} ${disease || ""}`.toLowerCase();
                
                if (specLower.includes("cardiologist") && (searchText.includes("heart") || searchText.includes("chest pain") || searchText.includes("cardio"))) {
                    score += 35;
                    reasons.push("Specialty matches heart/chest symptoms");
                } else if (specLower.includes("neurologist") && (searchText.includes("headache") || searchText.includes("dizzy") || searchText.includes("stroke"))) {
                    score += 35;
                    reasons.push("Specialty matches brain/neurological symptoms");
                } else if (specLower.includes("pediatrician") && searchText.includes("child")) {
                    score += 35;
                    reasons.push("Specialty matches pediatric symptoms");
                } else if (specLower.includes("dermatologist") && (searchText.includes("skin") || searchText.includes("rash") || searchText.includes("itching"))) {
                    score += 35;
                    reasons.push("Specialty matches skin/itching symptoms");
                } else if (specLower.includes("general practice") || specLower.includes("general physician")) {
                    score += 25;
                    reasons.push("General physician suitable for triage");
                }
            }

            // 2. Proximity/Location Match (Weight: 25%)
            if (location && doc.hospital.city?.toLowerCase() === location.toLowerCase()) {
                score += 25;
                reasons.push("Doctor is located in your preferred city");
            } else if (location && doc.hospital.state?.toLowerCase() === location.toLowerCase()) {
                score += 15;
                reasons.push("Doctor is located in your state");
            }

            // 3. Consultation Fee / Budget Match (Weight: 18%)
            const doctorFee = doc.fee || 0;
            if (budget) {
                if (doctorFee <= budget) {
                    score += 18;
                    reasons.push("Consultation tariff is within your budget");
                } else if (doctorFee <= budget * 1.3) {
                    score += 10;
                    reasons.push("Fee is slightly above budget (+30% limit)");
                } else {
                    score += 2;
                    reasons.push("Fee exceeds budget constraints");
                }
            } else {
                score += 12; // default moderate score if budget not provided
            }

            // 4. Clinical Experience Score (Weight: 12%)
            // Extract numeric experience value (e.g. "12 Years" -> 12)
            const expNum = parseInt(doc.experience) || 0;
            if (expNum > 15) {
                score += 12;
                reasons.push("Highly experienced senior practitioner (>15 years)");
            } else if (expNum >= 5) {
                score += 8;
                reasons.push("Experienced clinical practice");
            } else {
                score += 4;
            }

            // Normalize match score out of 100
            const finalScore = Math.min(Math.round(score), 100);

            recommendations.push({
                doctor: doc,
                score: finalScore,
                reasons,
                availability: doc.availability !== false
            });
        }

        // Sort by match score descending
        return recommendations.sort((a, b) => b.score - a.score);
    } catch (error) {
        console.error("Doctor Recommendation Engine Error:", error);
        throw error;
    }
};
