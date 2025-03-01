"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "@/models";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/session");
      const data = await res.json();

      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/login");
      }
    };

    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <div>
      <h1>Profile</h1>
      {user ? (
        <div>
          <p>Welcome, {user.email}</p>
          <button onClick={handleLogout}>Log out</button>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Profile;
