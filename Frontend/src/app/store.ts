import { configureStore } from '@reduxjs/toolkit';
import { studentSlice } from '../features/studentSlice';

export const store = configureStore({
  reducer: {
    [studentSlice.reducerPath]: studentSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(studentSlice.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;