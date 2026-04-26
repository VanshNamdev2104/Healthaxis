import React from "react";
import { motion } from "framer-motion";
import { AlertCircle, Clock, CheckCircle } from "lucide-react";

const ConsultDoctorWarning = ({ conditions = [] }) => {
  if (!conditions || conditions.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-2 border-orange-500 dark:border-orange-600 rounded-lg p-4 mb-4 bg-orange-50 dark:bg-orange-950/20"
    >
      <div className="flex items-start gap-3 mb-3">
        <AlertCircle className="w-6 h-6 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-1" />
        <h3 className="font-bold text-orange-900 dark:text-orange-100">
          👨‍⚕️ Consult Doctor If:
        </h3>
      </div>

      <div className="space-y-3 ml-9">
        {conditions.map((condition, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white dark:bg-neutral-800 rounded-lg p-3 border-l-4 border-orange-500"
          >
            <p className="font-medium text-gray-900 dark:text-gray-100 flex items-start gap-2">
              <CheckCircle className="w-4 h-4 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
              {condition.condition}
            </p>

            {condition.time_frame && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
                <Clock className="w-3 h-3" />
                <span>{condition.time_frame}</span>
              </div>
            )}

            {condition.reason && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
                <span className="font-medium">Why:</span> {condition.reason}
              </p>
            )}

            {condition.action && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 ml-6">
                <span className="font-medium">Action:</span> {condition.action}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default ConsultDoctorWarning;
