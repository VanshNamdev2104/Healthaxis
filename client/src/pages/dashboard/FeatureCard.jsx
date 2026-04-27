import React, { memo } from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const FeatureCard = memo(({ feature, index }) => {
  const { icon: Icon, color, title, description } = feature;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.15, type: "spring", stiffness: 100, damping: 15 }}
      whileHover={{
        y: -10,
        boxShadow: "0 20px 40px rgba(99, 102, 241, 0.3)",
      }}
      whileTap={{ scale: 0.95 }}
      className="group relative bg-linear-to-br from-white to-gray-50 dark:from-neutral-700 dark:to-neutral-800 backdrop-blur-xl p-8 rounded-2xl border border-white/50 dark:border-neutral-600/50 shadow-xl hover:shadow-2xl transition-all cursor-pointer"
      role="button"
      tabIndex={0}
      aria-label={`${title}: ${description}`}
    >
      <div className="relative z-10">
        <motion.div
          className={`w-16 h-16 rounded-xl bg-linear-to-br ${color} flex items-center justify-center mx-auto mb-4 shadow-lg`}
          whileHover={{ scale: 1.2, rotate: 10 }}
          transition={{ type: "spring", stiffness: 400, damping: 10 }}
        >
          <Icon className="w-8 h-8 text-white" />
        </motion.div>

        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition">
          {title}
        </h3>

        <p className="text-gray-600 dark:text-gray-300 group-hover:text-gray-700 dark:group-hover:text-gray-200 transition leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
});

FeatureCard.displayName = "FeatureCard";

FeatureCard.propTypes = {
  feature: PropTypes.shape({
    icon: PropTypes.elementType.isRequired,
    color: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
  }).isRequired,
  index: PropTypes.number.isRequired,
};

FeatureCard.defaultProps = {
  feature: {
    icon: () => null,
    color: '',
    title: '',
    description: '',
  },
  index: 0,
};

export default FeatureCard;
