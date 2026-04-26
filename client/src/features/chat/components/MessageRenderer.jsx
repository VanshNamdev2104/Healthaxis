import React, { useMemo } from "react";
import { motion } from "framer-motion";
import EmergencyAlert from "./EmergencyAlert";
import DiseaseCard from "./DiseaseCard";
import MedicineCard from "./MedicineCard";
import HomeRemedyCard from "./HomeRemedyCard";
import CareTipCard from "./CareTipCard";
import ConsultDoctorWarning from "./ConsultDoctorWarning";

const MessageRenderer = ({ content, role }) => {
  const parsedContent = useMemo(() => {
    if (role === "human") {
      return { type: "text", text: content };
    }

    try {
      const parsed = typeof content === "string" ? JSON.parse(content) : content;
      return parsed;
    } catch (error) {
      console.error("Failed to parse AI response:", error);
      return { type: "text", text: content };
    }
  }, [content, role]);

  if (role === "human") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words"
      >
        {content}
      </motion.div>
    );
  }

  if (!parsedContent?.final_solution) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-gray-600 dark:text-gray-400"
      >
        {typeof content === "string" ? content : JSON.stringify(content, null, 2)}
      </motion.div>
    );
  }

  const solution = parsedContent.final_solution;
  const judge = parsedContent.judge_solution;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
      className="space-y-4"
    >
      {/* Emergency Alert - Priority 1 */}
      {judge?.emergency?.status && (
        <EmergencyAlert reason={judge.emergency.emergency_reason} />
      )}

      {/* Disease Card */}
      <DiseaseCard
        diseaseName={solution.possible_disease}
        confidenceScore={solution.confidence_score}
        severity={solution.severity}
        explanation={solution.explanation}
      />

      {/* Medical Solutions */}
      {solution.medical_sol && solution.medical_sol.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-indigo-600 dark:text-indigo-400 mb-3">
            💊 Medicines
          </h3>
          <div className="space-y-2">
            {solution.medical_sol.map((medicine, idx) => (
              <MedicineCard
                key={idx}
                medicineName={medicine.medicine_name}
                type={medicine.type}
                dosage={medicine.dosage}
                timing={medicine.timing}
                duration={medicine.duration}
                purpose={medicine.purpose}
                otc={medicine.otc}
                warnings={medicine.warnings}
              />
            ))}
          </div>
        </div>
      )}

      {/* Home Remedies */}
      {solution.home_remedies && solution.home_remedies.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-green-600 dark:text-green-400 mb-3">
            🌿 Home Remedies
          </h3>
          <div className="space-y-2">
            {solution.home_remedies.map((remedy, idx) => (
              <HomeRemedyCard
                key={idx}
                remedyName={remedy.remedy_name}
                ingredients={remedy.ingredients}
                preparation={remedy.preparation}
                usage={remedy.usage}
                frequency={remedy.frequency}
                benefits={remedy.benefits}
                precautions={remedy.precautions}
              />
            ))}
          </div>
        </div>
      )}

      {/* Care Tips */}
      {solution.care_tips && solution.care_tips.length > 0 && (
        <div>
          <h3 className="font-bold text-lg text-purple-600 dark:text-purple-400 mb-3">
            💡 Care Tips
          </h3>
          <div className="space-y-2">
            {solution.care_tips.map((tip, idx) => (
              <CareTipCard
                key={idx}
                tip={tip.tip}
                category={tip.category}
                description={tip.description}
                priority={tip.priority}
              />
            ))}
          </div>
        </div>
      )}

      {/* Consult Doctor If */}
      {solution.consult_doctor_if && solution.consult_doctor_if.length > 0 && (
        <ConsultDoctorWarning conditions={solution.consult_doctor_if} />
      )}

      {/* Disclaimer */}
      {solution.disclaimer && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gray-100 dark:bg-neutral-800 rounded-lg p-3 border border-gray-300 dark:border-gray-600 mt-4"
        >
          <p className="text-xs text-gray-600 dark:text-gray-400 italic">
            {solution.disclaimer}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default MessageRenderer;
