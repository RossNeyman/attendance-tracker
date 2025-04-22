import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

interface Student {
    // Add your student properties here
    cix_email: string;
    [key: string]: any;
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

// Export the generated hooks
export const { 
    useGetDataQuery,
    useUpdateStudentMutation,
    useDeleteStudentMutation 
} = studentSlice;