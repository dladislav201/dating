"use client";

import { useEffect, useState } from "react";
import { User } from "@/models";
import Link from "next/link";

function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    };

    fetchUsers();
  }, []);

  return (
    <main className="main">
      <section className="section">
        <h1>User List</h1>
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
      </section>
    </main>
  );
}

export default UsersPage;
