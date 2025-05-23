import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Student {
    first_name: string;
    last_name: string;
    cix_email: string;
    qr_code: string;
}

interface ApiResponse {
    message: string;
}

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
        updateStudent: builder.mutation<ApiResponse, { email: string, data: Partial<Student> }>({
            query: ({ email, data }) => ({
                url: '/',
                method: 'PUT',
                params: { email },
                body: data,
            }),
        }),
        deleteStudent: builder.mutation<ApiResponse, string>({
            query: (email) => ({
                url: '/',
                method: 'DELETE',
                params: { email },
            }),
        }),
    })
});

export const { 
    useGetDataQuery,
    useUpdateStudentMutation,
    useDeleteStudentMutation 
} = studentSlice;