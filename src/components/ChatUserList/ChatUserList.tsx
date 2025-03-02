"use client";

import { useEffect, useState } from "react";
import { User } from "@/models";
import "./ChatUserList.scss";
import Link from "next/link";

interface ChatUserListProps {
  userId: string;
}

export const ChatUserList = ({ userId }: ChatUserListProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/users/chat/${userId}`);
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [userId]);

  return (
    <ul className="chat-users">
      {users.map((user) => (
        <li key={user.id} className="chat-users__item">
          <Link href={`/chat/${user.id}`} className="chat-users__item-link">
            <span>{user.email}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
};
