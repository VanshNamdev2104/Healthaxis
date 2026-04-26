import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, ArrowDownLeft } from "lucide-react";

const StatCard = ({ icon: Icon, title, value, change, trend, color }) => {
  const colorGradient = {
    blue: "from-blue-500 to-blue-600",
    indigo: "from-indigo-500 to-indigo-600",
    purple: "from-purple-500 to-purple-600",
    cyan: "from-cyan-500 to-cyan-600",
  };

  return (
    <motion.div
      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 group hover:shadow-xl transition-all"
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="flex items-start justify-between mb-4">
        <motion.div
          className={`p-3 bg-gradient-to-br ${colorGradient[color]} rounded-lg`}
          whileHover={{ scale: 1.1, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400 }}
        >
          <Icon className="w-6 h-6 text-white" />
        </motion.div>
        <motion.div
          className={`flex items-center gap-1 px-2 py-1 rounded-full ${
            trend === "up"
              ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
              : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          }`}
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {trend === "up" ? (
            <ArrowUpRight size={16} />
          ) : (
            <ArrowDownLeft size={16} />
          )}
          <span className="text-sm font-bold">{change}%</span>
        </motion.div>
      </div>

      <h3 className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">
        {title}
      </h3>
      <motion.p
        className="text-3xl font-black text-gray-900 dark:text-white"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {value.toLocaleString()}
      </motion.p>
    </motion.div>
  );
};

export default StatCard;
