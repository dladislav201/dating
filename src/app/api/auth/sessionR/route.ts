import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../authOptions";

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session) {
      return NextResponse.json({ user: session.user }, { status: 200 });
    } else {
      return NextResponse.json({ user: null }, { status: 200 });

    }
  } catch(error) {
    console.error("Error fetching session:", error);
    return NextResponse.json({ error: "Failed to fetch session" }, { status: 500 });  
  }
}