import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);
  if (session) {
    return new Response(JSON.stringify({ user: session.user }), {
      status: 200,
    });
  } else {
    return new Response(JSON.stringify({ user: null }), { status: 200 });
  }
}