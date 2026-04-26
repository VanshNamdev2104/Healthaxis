import React from "react";
import { motion } from "framer-motion";
import { Activity } from "lucide-react";

const DiseaseCard = ({
  diseaseName,
  confidenceScore,
  severity,
  explanation,
}) => {
  const getSeverityColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-950/40 border-red-300 dark:border-red-700 text-red-900 dark:text-red-100";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950/40 border-yellow-300 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100";
      case "low":
        return "bg-green-100 dark:bg-green-950/40 border-green-300 dark:border-green-700 text-green-900 dark:text-green-100";
      default:
        return "bg-gray-100 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100";
    }
  };

  const getSeverityBadgeColor = (sev) => {
    switch (sev?.toLowerCase()) {
      case "high":
        return "bg-red-600 text-white";
      case "medium":
        return "bg-yellow-600 text-white";
      case "low":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`border-2 rounded-lg p-4 mb-4 ${getSeverityColor(severity)}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <Activity className="w-6 h-6 flex-shrink-0 mt-1" />
          <div className="flex-1">
            <h2 className="font-bold text-lg">{diseaseName}</h2>
            <p className="text-sm mt-2 opacity-90">{explanation}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2 flex-shrink-0">
          <div className="text-center">
            <div className="text-3xl font-bold">{confidenceScore}%</div>
            <div className="text-xs font-semibold mt-1">Confidence</div>
          </div>
          <div className={`px-3 py-1 rounded-full text-sm font-semibold ${getSeverityBadgeColor(severity)}`}>
            {severity?.charAt(0).toUpperCase() + severity?.slice(1)}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default DiseaseCard;
