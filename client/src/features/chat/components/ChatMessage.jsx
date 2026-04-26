import React from "react";
import { motion } from "framer-motion";
import { User, Bot } from "lucide-react";
import MessageRenderer from "./MessageRenderer";

const ChatMessage = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}
    >
      <div className={`flex gap-3 max-w-2xl ${isUser ? "flex-row-reverse" : "flex-row"}`}>
        {/* Avatar */}
        <div
          className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            isUser
              ? "bg-indigo-600 text-white"
              : "bg-gradient-to-br from-green-400 to-blue-500 text-white"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>

        {/* Message Bubble */}
        <div
          className={`rounded-2xl px-4 py-3 ${
            isUser
              ? "bg-indigo-600 text-white rounded-tr-none"
              : "bg-gray-100 dark:bg-neutral-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
          }`}
        >
          <MessageRenderer
            content={message.content}
            role={isUser ? "human" : "ai"}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default ChatMessage;
