import axiosInstance from "../../../lib/api/axiosConfig.js";

export const chatAPI = {
  createChat: async () => {
    const response = await axiosInstance.post("/api/chat");
    return response.data;
  },

  getChats: async () => {
    const response = await axiosInstance.get("/api/chat");
    return response.data;
  },

  getMessages: async (chatId) => {
    const response = await axiosInstance.get(`/api/chat/${chatId}/messages`);
    return response.data;
  },

  sendMessage: async (chatId, message) => {
    const response = await axiosInstance.post("/api/chat/message", {
      chatId,
      message,
    }, {
      timeout: 120000, // 2 minutes - AI pipeline calls multiple LLMs
    });
    return response.data;
  },

  deleteChat: async (chatId) => {
    const response = await axiosInstance.delete(`/api/chat/${chatId}`);
    return response.data;
  },

  getChatById: async (chatId) => {
    const response = await axiosInstance.get(`/api/chat/${chatId}`);
    return response.data;
  },
};

export default chatAPI;

