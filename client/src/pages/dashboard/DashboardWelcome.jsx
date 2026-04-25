import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { Users, Stethoscope, Calendar } from "lucide-react";
import { DEFAULT_USER, STATS_CONFIG } from "../dashboard.constants.js";
import FeatureCard from "./FeatureCard.jsx";

const WELCOME_FEATURES = [
  {
    icon: Users,
    color: "text-indigo-500",
    title: "Hospital Network",
    description: "Manage healthcare facilities and admin",
  },
  {
    icon: Stethoscope,
    color: "text-green-500",
    title: "Medical Professionals",
    description: "Doctor profiles and scheduling",
  },
  {
    icon: Calendar,
    color: "text-orange-500",
    title: "Appointments",
    description: "Patient bookings and management",
  },
];

const DashboardWelcome = memo(({ user }) => {
  const welcomeContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const welcomeItemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 80, damping: 15 },
    },
  };

  return (
    <motion.div
      variants={welcomeContainerVariants}
      initial="hidden"
      animate="visible"
      className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-neutral-900 dark:via-slate-800 dark:to-neutral-900 p-6 md:p-12"
    >
      {/* Animated background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, 50, 0], x: [0, 30, 0] }}
          transition={{ duration: 8, repeat: 3, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 bg-gradient-to-br from-cyan-500/20 to-transparent rounded-full blur-3xl"
          animate={{ y: [0, -50, 0], x: [0, -30, 0] }}
          transition={{ duration: 10, repeat: 3, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        {/* Icon Section */}
        <motion.div
          variants={welcomeItemVariants}
          className="flex justify-center mb-8"
        >
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-indigo-400 via-purple-400 to-cyan-400 rounded-3xl flex items-center justify-center shadow-2xl relative"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            whileHover={{ scale: 1.1, rotate: 0 }}
          >
            <motion.svg
              className="w-16 h-16 md:w-20 md:h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </motion.svg>
          </motion.div>
        </motion.div>

        {/* Title Section */}
        <motion.div variants={welcomeItemVariants} className="text-center mb-8">
          <motion.h1
            className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 dark:from-white dark:via-indigo-200 dark:to-cyan-200 bg-clip-text text-transparent mb-4 tracking-tight leading-tight"
            animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
            transition={{ duration: 5, repeat: Infinity }}
          >
            Welcome to HealthAxis
          </motion.h1>

          <motion.p
            variants={welcomeItemVariants}
            className="text-lg md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed font-medium"
          >
            Your comprehensive healthcare management platform. Access hospitals, doctors, appointments, diseases, medicines and more from this central dashboard.
          </motion.p>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div
          variants={welcomeItemVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16"
        >
          {WELCOME_FEATURES.map((feature, idx) => (
            <FeatureCard key={feature.title} feature={feature} index={idx} />
          ))}
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div
          variants={welcomeItemVariants}
          className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl p-8 md:p-12 shadow-2xl text-white mb-12"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STATS_CONFIG.map((stat, idx) => (
              <motion.div
                key={stat.id}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.15, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.05 }}
              >
                <motion.div
                  className="text-5xl md:text-6xl mb-2"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                >
                  {stat.icon}
                </motion.div>
                <motion.div className="text-4xl md:text-5xl font-black mb-2">
                  {stat.value}
                </motion.div>
                <div className="text-white/90 font-semibold">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* User Info Footer */}
        <motion.div
          variants={welcomeItemVariants}
          className="text-center"
        >
          <motion.div
            className="inline-block bg-white dark:bg-neutral-800 rounded-full px-8 py-4 shadow-lg border border-gray-200 dark:border-neutral-700"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400 }}
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-cyan-500 flex items-center justify-center text-white font-bold text-lg">
                {user?.name?.charAt(0)?.toUpperCase() || DEFAULT_USER.INITIAL}
              </div>
              <div className="text-left">
                <p className="text-sm text-gray-600 dark:text-gray-400">Member since</p>
                <p className="font-bold text-gray-900 dark:text-white">
                  {user?.role?.toUpperCase() || DEFAULT_USER.ROLE}
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
});

DashboardWelcome.displayName = "DashboardWelcome";

DashboardWelcome.propTypes = {
  user: PropTypes.object,
};

DashboardWelcome.defaultProps = {
  user: null,
};

export default DashboardWelcome;
