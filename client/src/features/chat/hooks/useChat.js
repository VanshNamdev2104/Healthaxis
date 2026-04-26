import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import {
  setActiveChat,
  clearError,
  fetchChats,
  createNewChat,
  fetchMessages,
  sendMessage,
  deleteChat,
} from "../slice/chat.slice.js";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, messages, activeChatId, loading, sending, error } =
    useSelector((state) => state.chat);

  const handleFetchChats = useCallback(async () => {
    try {
      dispatch(clearError());
      const response = await dispatch(fetchChats()).unwrap();
      return response;
    } catch (err) {
      console.error("Failed to fetch chats:", err);
      throw err;
    }
  }, [dispatch]);

  const handleCreateChat = useCallback(async () => {
    try {
      dispatch(clearError());
      const response = await dispatch(createNewChat()).unwrap();
      return response;
    } catch (err) {
      console.error("Failed to create chat:", err);
      throw err;
    }
  }, [dispatch]);

  const handleFetchMessages = useCallback(
    async (chatId) => {
      try {
        dispatch(clearError());
        const response = await dispatch(fetchMessages(chatId)).unwrap();
        return response;
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleSendMessage = useCallback(
    async (chatId, message) => {
      try {
        dispatch(clearError());
        const response = await dispatch(
          sendMessage({ chatId, message })
        ).unwrap();
        return response;
      } catch (err) {
        console.error("Failed to send message:", err);
        throw err;
      }
    },
    [dispatch]
  );

  const handleSetActiveChat = useCallback(
    (chatId) => {
      dispatch(setActiveChat(chatId));
    },
    [dispatch]
  );

  const activeChat = chats.find((chat) => chat._id === activeChatId) || null;

  const handleDeleteChat = useCallback(
    async (chatId) => {
      try {
        dispatch(clearError());
        const response = await dispatch(deleteChat(chatId)).unwrap();
        return response;
      } catch (err) {
        console.error("Failed to delete chat:", err);
        throw err;
      }
    },
    [dispatch]
  );

  return {
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
    handleDeleteChat,
    clearError: () => dispatch(clearError()),
  };
};

export default useChat;

