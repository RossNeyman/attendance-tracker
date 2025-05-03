import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const logsApi = createApi({
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
  }),
});

export const { useLogAttendanceMutation } = logsApi;