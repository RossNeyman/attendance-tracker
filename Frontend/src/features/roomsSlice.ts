import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

//const backendUrl = import.meta.env.VITE_BACKEND_URL || '';

export const roomsSlice = createApi({
    reducerPath: 'roomsApi',
    baseQuery: fetchBaseQuery({ baseUrl:  '/rooms' }),
    endpoints: (builder) => ({
        createRoom: builder.mutation({
            query: ({ userId, roomName }) => ({
                url: `/`,
                method: 'PUT',
                body: { userId, roomName },
            }),
        }),
        changeRoomName: builder.mutation({
            query: ({ userId, roomName, newRoomName }) => ({
                url: `/`,
                method: 'POST',
                body: { userId, roomName, newRoomName },
            }),
        }),
        deleteRoom: builder.mutation({
            query: ({ userId, roomId }) => ({
                url: `/`,
                method: 'DELETE',
                body: { userId, roomId },
            }),
        }),
        getActiveRooms: builder.query({
            query: (userId: string) => ({
                url: `/`,
                method: 'GET',
                params: { userId: userId },
            }),
        }),
        getArchivedRooms: builder.query({
            query: (userId: string) => ({
                url: `/archive`,
                method: 'GET',
                params: { userId: userId },
            }),
        }),
        archiveRoom: builder.mutation({
            query: ({ userId, roomId }) => ({
                url: `/archive`,
                method: 'POST',
                body: { userId, roomId },
            }),
        }),
        unarchiveRoom: builder.mutation({
            query: ({ userId, roomId }) => ({
              url: `/unarchive`,
              method: 'POST',
                body: { userId, roomId },
            }),
          }),
    })
});

export const {
    useGetActiveRoomsQuery,
    useGetArchivedRoomsQuery,
    useCreateRoomMutation,
    useChangeRoomNameMutation,
    useDeleteRoomMutation,
    useArchiveRoomMutation,
    useUnarchiveRoomMutation,
} = roomsSlice;