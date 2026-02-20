import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  messages: [],
};

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    pushMessage(state, action) {
      const { text, status } = action.payload;
      const id = Date.now();
      state.messages.push({
        id,
        text,
        status,
        title: status === 'success' ? '成功' : '錯誤',
      });
    },
    removeMessage(state, action) {
      const messageId = action.payload;
      state.messages = state.messages.filter((msg) => msg.id !== messageId);
    },
  },
});

export const { pushMessage, removeMessage } = toastSlice.actions;

export default toastSlice.reducer;
