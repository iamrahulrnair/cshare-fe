import { configureStore } from '@reduxjs/toolkit';
import { commentsReducer } from './slices/commentSlice';

export const store = configureStore({
  reducer: {
    comments:commentsReducer
  },
});
