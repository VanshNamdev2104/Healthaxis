import React from "react";
import { motion } from "framer-motion";
import {
  Apple,
  Droplets,
  Bed,
  ShowerHead,
  Activity,
  Heart,
} from "lucide-react";

const CareTipCard = ({ tip, category, description, priority = "medium" }) => {
  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case "diet":
        return <Apple className="w-5 h-5" />;
      case "hydration":
        return <Droplets className="w-5 h-5" />;
      case "rest":
        return <Bed className="w-5 h-5" />;
      case "hygiene":
        return <ShowerHead className="w-5 h-5" />;
      case "activity":
        return <Activity className="w-5 h-5" />;
      case "lifestyle":
        return <Heart className="w-5 h-5" />;
      default:
        return <Heart className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat?.toLowerCase()) {
      case "diet":
        return "text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20";
      case "hydration":
        return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/20";
      case "rest":
        return "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/20";
      case "hygiene":
        return "text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20";
      case "activity":
        return "text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20";
      case "lifestyle":
        return "text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-950/20";
      default:
        return "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/20";
    }
  };

  const getPriorityBadge = (prio) => {
    switch (prio?.toLowerCase()) {
      case "high":
        return "bg-red-100 dark:bg-red-950/40 text-red-700 dark:text-red-300";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-950/40 text-yellow-700 dark:text-yellow-300";
      case "low":
        return "bg-green-100 dark:bg-green-950/40 text-green-700 dark:text-green-300";
      default:
        return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-lg p-4 mb-3 border border-gray-200 dark:border-gray-700 ${getCategoryColor(category)}`}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">{getCategoryIcon(category)}</div>
        <div className="flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              {tip}
            </h3>
            {priority && (
              <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityBadge(priority)}`}>
                {priority?.charAt(0).toUpperCase() + priority?.slice(1)}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
            {description}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default CareTipCard;
