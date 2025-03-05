import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { User } from "@/models";

interface Session {
  user: User | null;
}

export const sessionService = createApi({
    reducerPath: "sessionServiceApi",
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    tagTypes: ["Session"],
    endpoints: (builder) => ({
      getSession: builder.query<Session, void>({
        query: () => "/auth/sessionR",
        providesTags: ["Session"],
      }),
      updateUser: builder.mutation({
        query: (userData) => ({
          url: "/user/update",
          method: "PUT",
          body: userData,
        }),
        invalidatesTags: ["Session"],
      }),
    }),
});

export const { useGetSessionQuery, useUpdateUserMutation } = sessionService;