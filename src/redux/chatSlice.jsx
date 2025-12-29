// src/redux/chatSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api5.jsx";

/* =========================
   FETCH CHAT ROOMS
========================= */
export const fetchChatRooms = createAsyncThunk(
  "chat/fetchRooms",
  async () => {
    const res = await api.get("chat/rooms/");
    return res.data;
  }
);

/* =========================
   FETCH CHAT HISTORY
========================= */
export const fetchChatHistory = createAsyncThunk(
  "chat/fetchHistory",
  async (roomId) => {
    const res = await api.get(`chat/history/${roomId}/`);
    return { roomId, messages: res.data };
  }
);

const chatSlice = createSlice({
  name: "chat",
  initialState: {
    rooms: [],
    activeRoomId: null,
    messagesByRoom: {},
    loadingRooms: false,
    loadingMessages: false,
  },
  reducers: {
    setActiveRoom(state, action) {
      state.activeRoomId = action.payload;
    },
    addMessage(state, action) {
      const { roomId, message } = action.payload;
      if (!state.messagesByRoom[roomId]) {
        state.messagesByRoom[roomId] = [];
      }
      state.messagesByRoom[roomId].push(message);
    },
    clearChatState() {
      return {
        rooms: [],
        activeRoomId: null,
        messagesByRoom: {},
        loadingRooms: false,
        loadingMessages: false,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatRooms.pending, (state) => {
        state.loadingRooms = true;
      })
      .addCase(fetchChatRooms.fulfilled, (state, action) => {
        state.loadingRooms = false;
        state.rooms = action.payload;
      })
      .addCase(fetchChatHistory.pending, (state) => {
        state.loadingMessages = true;
      })
      .addCase(fetchChatHistory.fulfilled, (state, action) => {
        state.loadingMessages = false;
        state.messagesByRoom[action.payload.roomId] =
          action.payload.messages;
      });
  },
});

export const {
  setActiveRoom,
  addMessage,
  clearChatState,
} = chatSlice.actions;

export default chatSlice.reducer;
