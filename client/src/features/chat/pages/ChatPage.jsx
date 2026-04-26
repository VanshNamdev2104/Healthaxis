import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { AlertCircle, Menu, X, ArrowLeft } from "lucide-react";
import { useChat } from "../hooks/useChat";
import ChatSidebar from "../components/ChatSidebar";
import MessageList from "../components/MessageList";
import ChatInput from "../components/ChatInput";

const ChatPage = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  const {
    chats,
    messages,
    activeChatId,
    activeChat,
    loading,
    sending,
    error,
    handleFetchChats,
    handleCreateChat,
    handleFetchMessages,
    handleSendMessage,
    handleSetActiveChat,
    handleDeleteChat: hookDeleteChat,
    clearError,
  } = useChat();

  // Load chats on mount
  useEffect(() => {
    handleFetchChats();
  }, []);

  // Load messages when active chat changes
  useEffect(() => {
    if (activeChatId) {
      handleFetchMessages(activeChatId);
    }
  }, [activeChatId]);

  // Handle new chat
  const handleNewChat = async () => {
    try {
      const newChat = await handleCreateChat();
      handleSetActiveChat(newChat._id);
    } catch (err) {
      console.error("Failed to create new chat:", err);
    }
  };

  // Handle send message
  const handleSendMsg = async (message) => {
    try {
      if (!activeChatId) {
        // Create a new chat if none exists
        const newChat = await handleCreateChat();
        handleSetActiveChat(newChat._id);
        await handleSendMessage(newChat._id, message);
      } else {
        await handleSendMessage(activeChatId, message);
      }
    } catch (err) {
      // Error is already handled by the Redux slice and displayed in the UI
      console.error("Failed to send message:", err);
    }
  };

  // Handle delete chat
  const handleDeleteChat = async (chatId) => {
    if (confirm("Are you sure you want to delete this chat?")) {
      try {
        await hookDeleteChat(chatId);
      } catch (err) {
        console.error("Failed to delete chat:", err);
      }
    }
  };

  return (
    <div className="flex h-screen bg-white dark:bg-neutral-950">
      {/* Sidebar */}
      <ChatSidebar
        chats={chats}
        activeChatId={activeChatId}
        onSelectChat={handleSetActiveChat}
        onNewChat={handleNewChat}
        onDeleteChat={handleDeleteChat}
        loading={loading}
        isOpen={sidebarOpen}
        onToggleSidebar={setSidebarOpen}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="border-b border-gray-300 dark:border-gray-700 bg-white dark:bg-neutral-900 px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/dashboard")}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors text-gray-600 dark:text-gray-400"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-neutral-800 transition-colors"
            >
              {sidebarOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
                AI Health Assistant
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Get instant health insights powered by AI
              </p>
            </div>
          </div>
          <div className="text-3xl">🏥</div>
        </div>

        {/* Error Alert */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mx-4 mt-4 flex items-center gap-3 bg-red-50 dark:bg-red-950/20 border border-red-300 dark:border-red-700 rounded-lg p-3"
          >
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-200 flex-1">{error}</p>
            <button
              onClick={clearError}
              className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-200 font-medium text-sm"
            >
              Dismiss
            </button>
          </motion.div>
        )}

        {/* Messages Area */}
        <MessageList messages={messages} loading={sending} />

        {/* Input Area */}
        <ChatInput
          onSend={handleSendMsg}
          disabled={sending || loading}
        />
      </div>
    </div>
  );
};

export default ChatPage;
