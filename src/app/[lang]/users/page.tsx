import { UserList } from "@/components/UserList/UserList";

async function UsersPage() {
  // if (!session?.user) {
  //   return <p>Please log in to see users</p>;
  // }

  return (
    <main className="main">
      <section className="section">
        <h1>User List</h1>
        <UserList />
      </section>
    </main>
  );
}

export default UsersPage;
