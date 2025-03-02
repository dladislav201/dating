"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
// import { User } from "@/models";
import { Button } from "@/components/Button/Button";

import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { useGetSessionUserQuery } from "@/store/apiSlice";

const Profile = () => {
  // const [user, setUser] = useState<User | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();

  const currentUser = useSelector((state: RootState) => state.user);
  const { isLoading } = useGetSessionUserQuery();

  useEffect(() => {
    if (!isLoading && !currentUser.id) {
      router.push("/login");
    }
  }, [currentUser, isLoading, router]);

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
        <div>
          {currentUser ? (
            <p>Welcome, {currentUser.email}</p>
          ) : (
            <p>No user data available</p>
          )}
          <Button
            onClick={handleLogout}
            type="primary"
            size="small"
            disabled={!currentUser}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
