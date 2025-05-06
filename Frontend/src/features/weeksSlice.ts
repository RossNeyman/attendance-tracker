import { fetchBaseQuery, createApi } from "@reduxjs/toolkit/query";

export interface week {
    userId: string;
    roomId: string;
    weekId: string;
}

export interface room {
    userId: string;
    roomId: string;
}

export const weeksSlice = createApi({
    reducerPath: 'weeksApi',
    baseQuery: fetchBaseQuery({ baseUrl: '/weeks' }),
    endpoints: (builder) => ({
        getWeeks: builder.query<week[], room>({
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
