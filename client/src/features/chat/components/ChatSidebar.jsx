import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MessageSquare, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

const ChatSidebar = ({
  chats,
  activeChatId,
  onSelectChat,
  onNewChat,
  onDeleteChat,
  loading,
  isOpen,
  onToggleSidebar,
}) => {
  const formatDate = (date) => {
    if (!date) return "Unknown";
    const d = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (d.toDateString() === today.toDateString()) {
      return "Today";
    } else if (d.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    }
  };

  return (
    <>
      {/* Sidebar */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed md:static left-0 top-0 md:top-auto z-40 md:z-0 w-64 h-screen md:h-full bg-white dark:bg-neutral-900 border-r border-gray-300 dark:border-gray-700 flex flex-col"
          >
            {/* Header */}
            <div className="p-4 border-b border-gray-300 dark:border-gray-700 mt-12 md:mt-0">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  onNewChat();
                  if (window.innerWidth < 768) onToggleSidebar(false);
                }}
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-5 h-5" />
                New Chat
              </motion.button>
            </div>

            {/* Chat History */}
            <div className="flex-1 overflow-y-auto px-3 py-4 space-y-2">
              {loading && (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-4">
                  Loading...
                </div>
              )}

              {chats && chats.length > 0 ? (
                chats.map((chat) => (
                  <motion.div
                    key={chat._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ x: 5 }}
                    className="group relative"
                  >
                    <button
                      onClick={() => {
                        onSelectChat(chat._id);
                        if (window.innerWidth < 768) onToggleSidebar(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-start gap-2 group ${
                        activeChatId === chat._id
                          ? "bg-indigo-100 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-100"
                          : "hover:bg-gray-100 dark:hover:bg-neutral-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <MessageSquare className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          Chat {new Date(chat.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-xs opacity-70">
                          {formatDate(chat.createdAt)}
                        </p>
                      </div>
                    </button>

                    <motion.button
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteChat(chat._id);
                      }}
                      className="absolute right-2 top-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-950/40 text-red-600 dark:text-red-400 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 text-sm py-8">
                  No chats yet. Start a new conversation!
                </div>
              )}
            </div>

            {/* Footer Info */}
            <div className="p-4 border-t border-gray-300 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
              <p className="text-center">
                🏥 AI Health Assistant
                <br />
                For informational purposes only
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => onToggleSidebar(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
};

ChatSidebar.propTypes = {
  chats: PropTypes.array,
  activeChatId: PropTypes.string,
  onSelectChat: PropTypes.func.isRequired,
  onNewChat: PropTypes.func.isRequired,
  onDeleteChat: PropTypes.func.isRequired,
  loading: PropTypes.bool,
  isOpen: PropTypes.bool.isRequired,
  onToggleSidebar: PropTypes.func.isRequired,
};

ChatSidebar.defaultProps = {
  chats: [],
  loading: false,
};

export default ChatSidebar;
