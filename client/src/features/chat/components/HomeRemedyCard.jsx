import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Leaf } from "lucide-react";

const HomeRemedyCard = ({
  remedyName,
  ingredients,
  preparation,
  usage,
  frequency,
  benefits,
  precautions = [],
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border border-green-300 dark:border-green-700 rounded-lg bg-green-50 dark:bg-green-950/20 mb-3 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full px-4 py-3 flex items-start gap-3 hover:bg-green-100 dark:hover:bg-green-950/40 transition-colors"
      >
        <Leaf className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-1" />
        <div className="flex-1 text-left">
          <div className="font-semibold text-gray-900 dark:text-gray-100">
            {remedyName}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {benefits}
          </p>
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
            className="border-t border-green-300 dark:border-green-700 px-4 py-3 bg-white dark:bg-neutral-900 space-y-3"
          >
            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
                📋 Ingredients:
              </p>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {ingredients.map((ingredient, idx) => (
                  <li key={idx} className="flex gap-2">
                    <span className="text-green-600 dark:text-green-400">•</span>
                    <span>{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                👨‍🍳 Preparation:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{preparation}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                💊 Usage:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{usage}</p>
            </div>

            <div>
              <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">
                ⏰ Frequency:
              </p>
              <p className="text-sm text-gray-700 dark:text-gray-300">{frequency}</p>
            </div>

            {precautions && precautions.length > 0 && (
              <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800 rounded p-2">
                <p className="text-xs font-semibold text-amber-900 dark:text-amber-200 mb-1">
                  ⚠️ Precautions:
                </p>
                <ul className="text-xs text-amber-800 dark:text-amber-300 space-y-1">
                  {precautions.map((precaution, idx) => (
                    <li key={idx} className="flex gap-2">
                      <span className="text-amber-600 dark:text-amber-400">•</span>
                      <span>{precaution}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default HomeRemedyCard;
