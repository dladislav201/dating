"use client";

import { useGetUserChatsQuery } from "@/services";
import "./ChatUserList.scss";
import Link from "next/link";

export const ChatUserList = () => {
  const { data: users, isLoading, error } = useGetUserChatsQuery();

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading users</p>;

  return (
    <ul className="chat-users">
      {users?.map((user) => (
        <li key={user.id} className="chat-users__item">
          <Link href={`/chat/${user.id}`} className="chat-users__item-link">
            <span>{user.nickName}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
