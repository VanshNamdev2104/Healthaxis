import React, { memo } from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import TabContentRenderer from "./TabContentRenderer.jsx";
import NotificationCenter from "../../features/hospital/components/NotificationCenter.jsx";

const DashboardContent = memo(({ activeTab, user, setActiveTab }) => {
  return (
    <div className="flex flex-1 w-full overflow-y-auto bg-gray-50 dark:bg-neutral-900 flex-col">
      {/* Top Header Bar */}
      <header className="h-16 border-b border-slate-200/50 dark:border-neutral-800/80 px-6 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0 relative z-30">
        <div className="text-xs font-black text-slate-400 dark:text-slate-550 uppercase tracking-widest">
          {activeTab}
        </div>
        <div className="flex items-center gap-4">
          <NotificationCenter />
        </div>
      </header>

      <div className="flex flex-col flex-1 w-full min-h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.4, type: "spring", stiffness: 100, damping: 20 }}
            className="w-full min-h-full flex flex-col flex-1"
          >
            <TabContentRenderer activeTab={activeTab} user={user} setActiveTab={setActiveTab} />
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
  setActiveTab: PropTypes.func,
};

DashboardContent.defaultProps = {
  user: null,
};

export default DashboardContent;
