import React, { memo } from "react";
import { motion } from "framer-motion";
import { Pill } from "lucide-react";
import PropTypes from "prop-types";

const Logo = memo(() => {
  return (
    <a
      href="/"
      className="flex items-center gap-2 text-sm text-white py-1 relative z-20"
      aria-label="HealthAxis Home"
    >
      {/* Icon */}
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-400/30">
        <Pill className="w-4 h-4 text-cyan-400" />
      </div>

      {/* Text */}
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-semibold tracking-wide text-black dark:text-white"
      >
        HealthAxis
      </motion.span>
    </a>
  );
});

Logo.displayName = "Logo";

export default Logo;
