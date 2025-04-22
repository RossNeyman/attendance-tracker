import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const studentSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: '/students' }),
    endpoints: (builder) => ({
        getData: builder.query<any[], string>({
            query: (email) => ({
                url: '/',
                params: { email }
            }),
            transformResponse: (response: any) => response,
        }),
    })
});

// Export the generated hook
export const { useGetDataQuery } = studentSlice;