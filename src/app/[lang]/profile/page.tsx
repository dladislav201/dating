// import { GetServerSideProps } from "next";
// import { useSession, getSession } from "next-auth/react";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// type User = {
//   id: string;
//   email: string;
//   name?: string | null;
//   image?: string | null;
// };

// interface ProfileProps {
//   user: User | null;
// }

// const Profile = ({ user }: ProfileProps) => {
//   const { data: session } = useSession();

//   if (!session) {
//     return <div>Please log in to view your profile</div>;
//   }

//   if (!user) {
//     return <div>User not found</div>;
//   }

//   return (
//     <div>
//       <h1>User Profile</h1>
//       <p>Email: {user.email}</p>
//       <p>Name: {user.name}</p>
//       {user.image && <img src={user.image} alt="User Image" />}
//     </div>
//   );
// };

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getSession(context);

//   if (!session) {
//     return {
//       redirect: {
//         destination: "/login",
//         permanent: false,
//       },
//     };
//   }

//   const user = await prisma.user.findUnique({
//     where: { email: session.user.email ?? undefined },
//   });

//   return {
//     props: { user },
//   };
// };

// export default Profile;
