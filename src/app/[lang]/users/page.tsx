import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";
import { UserList } from "@/components/UserList/UserList";

async function UsersPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return <p>Please log in to see users</p>;
  }

  return (
    <main className="main">
      <section className="section">
        <h1>User List</h1>
        <UserList userId={session.user.id} />
      </section>
    </main>
  );
}

export default UsersPage;
