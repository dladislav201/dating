import { Chat, ChatUserList } from "@/components";
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

  return (
    <main className="main">
      <section className="section section--fixed">
        <div className="chat-container">
          <ChatUserList />
          <Chat senderId={session.user.id} receiverId={params.chatWithId} />
        </div>
      </section>
    </main>
  );
}
