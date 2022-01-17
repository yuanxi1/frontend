import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:8000/api/v1/" }),
    endpoints: builder => ({
        logIn: builder.query({
            query: (user) => ({
                url: '/login',
                method: 'POST',
                body: user
            })
        })
    })
})
export const { useLogInQuery } = apiSlice