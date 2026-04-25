import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import TabContentRenderer from "./TabContentRenderer.jsx";

const DashboardContent = memo(({ activeTab, user }) => {
  return (
    <div className="flex flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-neutral-900">
      <div className="flex flex-col flex-1 w-full min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="w-full"
          >
            <TabContentRenderer activeTab={activeTab} user={user} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
});

DashboardContent.displayName = "DashboardContent";

DashboardContent.propTypes = {
  activeTab: PropTypes.string.isRequired,
  user: PropTypes.object,
};

DashboardContent.defaultProps = {
  user: null,
};

export default DashboardContent;
