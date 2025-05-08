import { configureStore } from '@reduxjs/toolkit';
import { studentSlice } from '../features/studentSlice';
import { logsSlice } from '../features/logsSlice';
import { roomsSlice } from '../features/roomsSlice';
import { weeksSlice } from '../features/weeksSlice';
import { dogsSlice } from '../features/dogsSlice';

export const store = configureStore({
  reducer: {
    [studentSlice.reducerPath]: studentSlice.reducer,
    [logsSlice.reducerPath]: logsSlice.reducer,
    [roomsSlice.reducerPath]: roomsSlice.reducer,
    [weeksSlice.reducerPath]: weeksSlice.reducer,
    [dogsSlice.reducerPath]: dogsSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      studentSlice.middleware, 
      logsSlice.middleware, 
      roomsSlice.middleware, 
      weeksSlice.middleware,
      dogsSlice.middleware
    ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;