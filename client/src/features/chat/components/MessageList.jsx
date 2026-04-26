import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatMessage from "./ChatMessage";
import TypingIndicator from "./TypingIndicator";

const MessageList = ({ messages, loading }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {messages && messages.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center h-full text-center text-gray-500 dark:text-gray-400"
        >
          <div className="text-5xl mb-3">💬</div>
          <p className="text-lg font-semibold">Start a Conversation</p>
          <p className="text-sm mt-2">
            Describe your symptoms and get AI-powered health insights
          </p>
        </motion.div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage
              key={message._id}
              message={message}
              isUser={message.role === "human"}
            />
          ))}
          {loading && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </>
      )}
    </div>
  );
};

export default MessageList;
