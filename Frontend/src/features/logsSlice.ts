import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export interface user {
  userId: string;
  first_name: string;
  last_name: string;
  email: string;
}



export const logsSlice = createApi({
  reducerPath: 'logsApi',
  baseQuery: fetchBaseQuery({ baseUrl: '/logs' }),
  endpoints: (builder) => ({
    logAttendance: builder.mutation({
      query: ({ userId, roomId, email }) => ({
        url: `/`,
        method: 'POST',
        params: { userId, roomId },
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

    getRoomLogs: builder.query({
      query: (week) => ({
        url: `/`,
        method: 'GET',
        params: { weekId: week.weekId, roomId: week.roomId, userId: week.userId },
      })
    }),
  })
});

export const {
  useLogAttendanceMutation,
  useCreateUserMutation,
  useGetRoomLogsQuery,
} = logsSlice;