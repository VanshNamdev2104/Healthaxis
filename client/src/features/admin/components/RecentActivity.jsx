import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle, AlertCircle, Info, XCircle, User, Hospital, Stethoscope, Calendar } from "lucide-react";
import { useAdmin } from "../hooks/useAdmin.js";

const RecentActivity = () => {
  const { activityFeed, handleGetActivityFeed } = useAdmin();

  useEffect(() => {
    handleGetActivityFeed(20);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleGetActivityFeed]);

  const getActivityIcon = (type) => {
    const icons = {
      user: User,
      hospital: Hospital,
      doctor: Stethoscope,
      appointment: Calendar,
      system: Info,
    };
    return icons[type] || Info;
  };

  const getColorClass = (type, status) => {
    if (status === "failed") {
      return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
    }
    const colors = {
      user: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400",
      hospital: "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400",
      doctor: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400",
      appointment: "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400",
      system: "bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400",
    };
    return colors[type] || colors.system;
  };

  const formatTimestamp = (createdAt) => {
    if (!createdAt) return "Unknown time";
    const date = new Date(createdAt);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    return date.toLocaleDateString();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 100 } },
  };

  const activities = activityFeed?.data || activityFeed || [];

  return (
    <motion.div
      className="bg-white dark:bg-neutral-800 rounded-2xl p-6 shadow-lg border border-gray-200 dark:border-neutral-700"
      whileHover={{ y: -5 }}
    >
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
        <Activity className="w-6 h-6" />
        Recent Activity
      </h3>

      <motion.div
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {activities.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400 text-sm text-center py-4">
            No recent activity
          </p>
        )}
        {activities.map((activity) => {
          const IconComponent = getActivityIcon(activity.type);
          return (
            <motion.div
              key={activity._id || activity.id}
              variants={itemVariants}
              className="flex items-start gap-4 p-4 rounded-lg bg-gray-50 dark:bg-neutral-700/50 hover:bg-gray-100 dark:hover:bg-neutral-700 transition group cursor-pointer"
              whileHover={{ x: 5 }}
            >
              <motion.div
                className={`p-2 rounded-lg flex-shrink-0 ${getColorClass(activity.type, activity.status)}`}
                whileHover={{ scale: 1.1, rotate: 10 }}
              >
                <IconComponent className="w-5 h-5" />
              </motion.div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {activity.description || activity.message || "Activity"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  {formatTimestamp(activity.createdAt)}
                </p>
              </div>

              <motion.div
                className={`text-xs px-3 py-1 rounded-full font-semibold flex-shrink-0 ${
                  activity.status === "failed"
                    ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                    : "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400"
                }`}
                animate={{ opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {activity.action || activity.type}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.button
        className="w-full mt-4 py-2 text-center text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        View All Activity
      </motion.button>
    </motion.div>
  );
};

export default RecentActivity;

