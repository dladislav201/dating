"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { User } from "@/models";
import { Button } from "@/components/Button/Button";

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
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
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    setIsLoggingOut(false);
    router.push("/login");
  };

  return (
    <main className="main">
      <section className="section">
        <h1>Profile</h1>
        {user ? (
          <div>
            <p>Welcome, {user.email}</p>
            <Button
              onClick={handleLogout}
              type="primary"
              size="small"
              disabled={!user}
            >
              {isLoggingOut ? "Logging out..." : "Log out"}
            </Button>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </section>
    </main>
  );
};

export default Profile;
