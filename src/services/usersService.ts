import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/models";

export const usersService = createApi({
    reducerPath: "usersServiceApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (builder) => ({
        getUsers: builder.query<User[], void>({
            query: () => `/users/all/`,
        }),
    }),
});

export const { useGetUsersQuery } = usersService;