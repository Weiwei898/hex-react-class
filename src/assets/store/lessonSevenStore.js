import { configureStore } from '@reduxjs/toolkit';
import toastReducer from '../slice/lessonSevenToastSlice';

export const store = configureStore({
  reducer: {
    toast: toastReducer,
  },
});
