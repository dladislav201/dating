"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { Button } from "@/components/Button/Button";
import { useGetSessionQuery } from "@/services";
import { Userbox } from "@/components";

const Profile = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data, isLoading, refetch } = useGetSessionQuery();
  const user = data?.user || null;
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && data && !user?.id) {
      router.push("/login");
    }
  }, [user, data, isLoading]);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    await signOut({ redirect: false });
    refetch();
    setIsLoggingOut(false);
    router.push("/login");
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <main className="main">
      <section className="section">
        <h1>Profile</h1>
        <div>
          {user ? <Userbox user={user} /> : <p>No user data available</p>}
          <Button
            onClick={handleLogout}
            variant="primary"
            size="small"
            disabled={!user}
          >
            {isLoggingOut ? "Logging out..." : "Log out"}
          </Button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
