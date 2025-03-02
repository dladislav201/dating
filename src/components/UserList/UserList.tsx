"use client";

import { useEffect, useState } from "react";
import { User } from "@/models";
import Link from "next/link";

interface UserListProps {
  userId: string;
}

export const UserList = ({ userId }: UserListProps) => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch(`/api/users/all/${userId}`);
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, [userId]);

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          <span>{user.email}</span>
          <Link href={`/chat/${user.id}`}>
            <button>Start Chat</button>
          </Link>
        </li>
      ))}
    </ul>
  );
};
