import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, AlertCircle, Pill } from "lucide-react";

const MedicineCard = ({
  medicineName,
  type,
  dosage,
  timing,
  duration,
  purpose,
  otc,
  warnings = [],
}) => {
  const [expanded, setExpanded] = useState(false);

  const getTypeColor = (medicineType) => {
    switch (medicineType?.toLowerCase()) {
      case "tablet":
        return "bg-blue-100 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300";
      case "syrup":
        return "bg-amber-100 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300";
      case "capsule":
        return "bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300";
      case "injection":
        return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-neutral-800 mb-3 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-gray-100 dark:hover:bg-neutral-700 transition-colors"
      >
        <Pill className="w-5 h-5 text-indigo-600 dark:text-indigo-400 flex-shrink-0 mt-1" />
        <div className="flex-1 text-left">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {medicineName}
            </span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(type)}`}>
              {type?.charAt(0).toUpperCase() + type?.slice(1)}
            </span>
            {otc && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300">
                OTC
              </span>
            )}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400 mt-2 space-y-1">
            <p><span className="font-medium">Dosage:</span> {dosage}</p>
            <p><span className="font-medium">Timing:</span> {timing}</p>
            <p><span className="font-medium">Duration:</span> {duration}</p>
          </div>
        </div>
        <motion.div
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-gray-300 dark:border-gray-600 px-4 py-3 bg-white dark:bg-neutral-900 space-y-2"
          >
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Purpose:
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">{purpose}</p>
            </div>

            {warnings && warnings.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-2 mt-2">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                      ⚠️ Warnings
                    </p>
                    <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                      {warnings.map((warning, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-amber-600 dark:text-amber-400">•</span>
                          <span>{warning}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MedicineCard;
