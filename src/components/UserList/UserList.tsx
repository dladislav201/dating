"use client";

import { useGetUsersQuery } from "@/services";
import Link from "next/link";

export const UserList = () => {
  const { data: users, isLoading, error } = useGetUsersQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <ul>
      {users?.map((user) => (
        <li key={user.id}>
          <span>{user.nickName}</span>
          <Link href={`/chat/${user.id}`}>
            <button>Start Chat</button>
          </Link>
        </li>
      ))}
    </ul>
  );
};
