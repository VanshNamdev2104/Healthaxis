import React from "react";
import { motion } from "framer-motion";

const Spinner = ({
  size = "md",
  variant = "default",
  fullScreen = false,
  message = "",
  overlay = true,
}) => {
  const sizeMap = {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 80,
  };

  const spinnerSize = sizeMap[size];

  const containerClasses = fullScreen
    ? `fixed inset-0 flex items-center justify-center ${
        overlay ? "bg-black/50" : ""
      } z-50`
    : "flex items-center justify-center";

  // Spinner variants
  const spinnerVariants = {
    rotate: {
      animate: {
        rotate: 360,
        transition: { duration: 1, repeat: Infinity, ease: "linear" },
      },
    },
    pulse: {
      animate: {
        scale: [1, 1.2, 1],
        transition: { duration: 1.5, repeat: Infinity },
      },
    },
    bounce: {
      animate: {
        y: [0, -10, 0],
        transition: { duration: 1, repeat: Infinity },
      },
    },
  };

  const defaultSpinner = (
    <motion.div
      className="border-4 border-gray-300 border-t-indigo-500 rounded-full"
      style={{ width: spinnerSize, height: spinnerSize }}
      variants={spinnerVariants.rotate}
      animate="animate"
    />
  );

  const pulseSpinner = (
    <motion.div
      className="rounded-full bg-indigo-500"
      style={{ width: spinnerSize, height: spinnerSize }}
      variants={spinnerVariants.pulse}
      animate="animate"
    />
  );

  const bounceSpinner = (
    <motion.div
      className="w-3 h-3 rounded-full bg-indigo-500"
      variants={spinnerVariants.bounce}
      animate="animate"
    />
  );

  const spinnerMap = {
    default: defaultSpinner,
    pulse: pulseSpinner,
    bounce: bounceSpinner,
  };

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center gap-4">
        {spinnerMap[variant] || defaultSpinner}
        {message && <p className="text-sm font-medium text-white">{message}</p>}
      </div>
    </div>
  );
};

export default Spinner;
