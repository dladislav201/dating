import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/models";

export const usersChatsService = createApi({
    reducerPath: "usersChatsApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getUserChats: builder.query<User[], void>({
            query: () => `/users/chat/`,
        }),
    }),
});

export const { useGetUserChatsQuery } = usersChatsService;