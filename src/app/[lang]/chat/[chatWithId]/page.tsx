import { Chat } from "@/components";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

export default async function ChatPage({
  params: awaitedParams,
}: {
  params: Promise<{ chatWithId: string }>;
}) {
  const params = await awaitedParams;
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return <p>Please log in to chat</p>;
  }

  return <Chat senderId={session.user.id} receiverId={params.chatWithId} />;
}
