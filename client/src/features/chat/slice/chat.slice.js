import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import chatAPI from "../services/chat.api.js";

export const fetchChats = createAsyncThunk(
  "chat/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getChats();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chats"
      );
    }
  }
);

export const createNewChat = createAsyncThunk(
  "chat/createNewChat",
  async (_, { rejectWithValue }) => {
    try {
      const response = await chatAPI.createChat();
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create chat"
      );
    }
  }
);

export const fetchMessages = createAsyncThunk(
  "chat/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.getMessages(chatId);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch messages"
      );
    }
  }
);

export const sendMessage = createAsyncThunk(
  "chat/sendMessage",
  async ({ chatId, message }, { rejectWithValue }) => {
    try {
      const response = await chatAPI.sendMessage(chatId, message);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send message"
      );
    }
  }
);

export const deleteChat = createAsyncThunk(
  "chat/deleteChat",
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await chatAPI.deleteChat(chatId);
      return chatId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete chat"
      );
    }
  }
);

const initialState = {
  chats: [],
  messages: [],
  activeChatId: null,
  loading: false,
  sending: false,
  error: null,
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
      state.messages = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    addLocalMessage: (state, action) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create new chat
      .addCase(createNewChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats.unshift(action.payload);
        state.activeChatId = action.payload._id;
        state.messages = [];
      })
      .addCase(createNewChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Send message
      .addCase(sendMessage.pending, (state) => {
        state.sending = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.sending = false;
        // API returns [humanMessage, aiMessage]
        const newMessages = action.payload;
        if (Array.isArray(newMessages)) {
          newMessages.forEach((msg) => {
            const exists = state.messages.find((m) => m._id === msg._id);
            if (!exists) {
              state.messages.push(msg);
            }
          });
        }
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.sending = false;
        state.error = action.payload;
      })
      // Delete chat
      .addCase(deleteChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteChat.fulfilled, (state, action) => {
        state.loading = false;
        state.chats = state.chats.filter((chat) => chat._id !== action.payload);
        if (state.activeChatId === action.payload) {
          state.activeChatId = null;
          state.messages = [];
        }
      })
      .addCase(deleteChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setActiveChat, clearError, addLocalMessage, clearMessages } =
  chatSlice.actions;
export default chatSlice.reducer;

