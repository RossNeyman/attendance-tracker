import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface user {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface week {
  userId: string;
  roomId: string;
  weekId: string;
}

export interface room {
  userId: string;
  roomId: string;
}

export const logsSlice = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/logs' }),
  endpoints: (builder) => ({
    logAttendance: builder.mutation({
      query: ({ userId, roomId, weekId, email }) => ({
        url: `/`,
        method: 'POST',
        params: { userId, roomId, weekId },
        body: { email },
      }),
    }),
    createUser: builder.mutation({
      query: ({ user }) => ({
        url: `/`,
        method: 'PUT',
        body: user,
      }),
    }),
    createRoom: builder.mutation({
      query: ({ userId, roomName }) => ({
        url: `/rooms`,
        method: 'PUT',
        body: { userId, roomName },
      }),
    }),
    changeRoomName: builder.mutation({
      query: ({ userId, roomName, newRoomName }) => ({
        url: `/rooms`,
        method: 'POST',
        body: { userId, roomName, newRoomName },
      }),
    }),
    deleteRoom: builder.mutation({
      query: ({ userId, roomName }) => ({
        url: `/rooms`,
        method: 'DELETE',
        body: { userId, roomName },
      }),
    }),
    getActiveRooms: builder.query({
      query: (userId: string) => ({
        url: `/rooms`,
        method: 'GET',
        params: { userId: userId },
      }),
    }),
    getArchivedRooms: builder.query({
      query: (userId: string) => ({
        url: `/rooms`,
        method: 'GET',
        params: { userId: userId },
      }),
    }),
    getRoomLogs: builder.query({
      query: (week) => ({
        url: `/`,
        method: 'GET',
        params: { weekId: week.weekId, roomId: week.roomId, userId: week.userId },
      })
    }),
    getWeeks: builder.query({
      query: (room) => ({
        url: `/weeks`,
        method: 'GET',
        params: { userId: room.userId, roomId: room.roomId },
      })
    }),
  })
});

export const {
  useLogAttendanceMutation,
  useCreateUserMutation,
  useGetActiveRoomsQuery,
  useGetArchivedRoomsQuery,
  useCreateRoomMutation,
  useChangeRoomNameMutation,
  useGetRoomLogsQuery,
  useGetWeeksQuery,
} = logsSlice;