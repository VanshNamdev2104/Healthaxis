import React from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";

const EmergencyAlert = ({ reason }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-red-50 dark:bg-red-950/20 border-2 border-red-500 rounded-lg p-4 mb-4"
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-0.5">
          <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400 animate-pulse" />
        </div>
        <div>
          <h3 className="font-semibold text-red-900 dark:text-red-100">
            ⚠️ Medical Emergency Alert
          </h3>
          <p className="text-sm text-red-800 dark:text-red-200 mt-1">
            {reason || "Seek immediate medical attention. Call 911 or visit the nearest hospital."}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default EmergencyAlert;
