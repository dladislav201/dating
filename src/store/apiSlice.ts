import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { setUser } from "./userSlice";
import { User } from "@/models";

interface SessionResponse {
  user: User | null;
}

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => "/users",
    }),
    getUserChats: builder.query({
      query: (userId) => `/chats/${userId}`,
    }),
    getSessionUser: builder.query<SessionResponse, void>({
      query: () => "/auth/session",
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.user) {
            dispatch(setUser({ id: data.user.id, email: data.user.email }));
          }
        } catch (error) {
          console.error("Failed to fetch session:", error);
        }
      },
    }),
  }),
});

export const { useGetUsersQuery, useGetUserChatsQuery, useGetSessionUserQuery } = apiSlice;
