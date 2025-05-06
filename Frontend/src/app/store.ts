import { configureStore } from '@reduxjs/toolkit';
import { studentSlice } from '../features/studentSlice';
import { logsSlice } from '../features/logsSlice';

export const store = configureStore({
  reducer: {
    [studentSlice.reducerPath]: studentSlice.reducer,
    [logsSlice.reducerPath]: logsSlice.reducer,
    
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(studentSlice.middleware, logsSlice.middleware),
    
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;