import React from "react";
import { motion } from "framer-motion";

const Loader = ({ size = "md", fullScreen = false, message = "Loading..." }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
    xl: "w-20 h-20",
  };

  const containerClasses = fullScreen
    ? "fixed inset-0 flex items-center justify-center bg-black/50 z-50"
    : "flex items-center justify-center";

  const spinnerVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 1,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        <motion.div
          className={`${sizeClasses[size]} border-4 border-gray-300 border-t-indigo-500 rounded-full`}
          variants={spinnerVariants}
          animate="animate"
        />
        {message && fullScreen && (
          <p className="text-white text-sm font-medium">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Loader;
