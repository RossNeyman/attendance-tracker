import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const THE_DOG_API_KEY = process.env.THE_DOG_API_KEY;

export const dogsSlice = createApi({
    reducerPath: 'dogsApi',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://api.thedogapi.com/v1' }),
    endpoints: (builder) => ({
        getDogImage: builder.query({
            query: () => ({
                url: `/images/search`,
                params: {api_key: THE_DOG_API_KEY}
            })
        })
    })
});

export const {
    useGetDogImageQuery
} = dogsSlice