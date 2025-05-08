import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query/react";

export interface room {
    userId: string;
    roomId: string;
}

export const weeksSlice = createApi({
    reducerPath: 'weeksApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/weeks' }),
    endpoints: (builder) => ({
        getWeeks: builder.query({
            query: (room) => ({
                url: `/`,
                method: 'GET',
                params: { userId: room.userId, roomId: room.roomId },
            })
        }),
    })
});

export const {  
    useGetWeeksQuery
} = weeksSlice;
