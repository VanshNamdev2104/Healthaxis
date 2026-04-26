import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { SETTINGS_CONFIG } from "../dashboard.constants.js";

const SettingsPage = memo(() => (
  <motion.div
    className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 p-6 md:p-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.div
      className="max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
    >
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
      >
        <h2 className="text-5xl font-black bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent mb-3">
          Settings
        </h2>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Manage your preferences and configurations
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {SETTINGS_CONFIG.map((setting, idx) => (
          <motion.div
            key={setting.id}
            className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700 cursor-pointer group"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
            whileHover={{
              y: -5,
              boxShadow: "0 20px 40px rgba(99, 102, 241, 0.2)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="text-4xl mb-3"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              {setting.icon}
            </motion.div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
              {setting.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {setting.description}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        className="mt-8 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-2xl p-8 text-white shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-2xl font-bold mb-2">Coming Soon</h3>
        <p>More settings options will be available in the next update.</p>
      </motion.div>
    </motion.div>
  </motion.div>
));

SettingsPage.displayName = "SettingsPage";

SettingsPage.propTypes = {
  children: PropTypes.node,
};

SettingsPage.defaultProps = {
  children: null,
};

export default SettingsPage;
