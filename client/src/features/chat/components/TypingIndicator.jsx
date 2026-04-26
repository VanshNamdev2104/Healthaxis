import React from "react";
import { motion } from "framer-motion";

const TypingIndicator = () => {
  return (
    <div className="flex items-end gap-2 px-4 py-3">
      <div className="flex items-center gap-1 bg-gray-100 dark:bg-neutral-800 rounded-2xl px-4 py-3">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400"
            animate={{
              y: [0, -6, 0],
              opacity: [0.4, 1, 0.4],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">
        AI is thinking...
      </span>
    </div>
  );
};

export default TypingIndicator;
