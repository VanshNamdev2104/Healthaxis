import React from "react";
import { motion } from "framer-motion";

const ChartComponent = ({ title, data, type = "line" }) => {
  const maxValue = data.length > 0 ? Math.max(...data) : 0;
  const minValue = data.length > 0 ? Math.min(...data) : 0;
  const range = maxValue - minValue || 1;

  const normalizedData = data.map((value) => ((value - minValue) / range) * 100);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.2 },
    },
  };

  const barVariants = {
    hidden: { scaleY: 0, originY: 1 },
    visible: { scaleY: 1, transition: { type: "spring", stiffness: 100, damping: 10 } },
  };

  return (
    <motion.div
      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700"
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
        {title}
      </h3>

      <div className="h-64 flex items-end justify-between gap-2 p-4 bg-gray-50 dark:bg-neutral-700/50 rounded-lg">
        <motion.div
          className="flex items-end justify-between gap-2 w-full h-full"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {normalizedData.map((normalizedValue, idx) => (
            <motion.div
              key={idx}
              variants={barVariants}
              className="flex-1 bg-gradient-to-t from-indigo-500 to-indigo-300 rounded-t-lg relative group cursor-pointer hover:from-indigo-600 hover:to-indigo-400 transition"
              style={{ height: `${normalizedValue}%` }}
            >
              <motion.div
                className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-gray-700 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap"
                animate={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              >
                {data[idx]}
              </motion.div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-neutral-700 flex justify-between text-sm">
        <span className="text-gray-600 dark:text-gray-400">
          Max: <span className="font-bold text-gray-900 dark:text-white">{maxValue}</span>
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Avg: <span className="font-bold text-gray-900 dark:text-white">{data.length > 0 ? Math.round(data.reduce((a, b) => a + b) / data.length) : 0}</span>
        </span>
        <span className="text-gray-600 dark:text-gray-400">
          Min: <span className="font-bold text-gray-900 dark:text-white">{minValue}</span>
        </span>
      </div>
    </motion.div>
  );
};

export default ChartComponent;
