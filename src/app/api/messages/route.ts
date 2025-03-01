import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { senderId, receiverId, content } = await req.json();

    const message = await prisma.message.create({
      data: { senderId, receiverId, content },
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error("Error sending message:", error); 
    return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const senderId = url.searchParams.get("senderId");
  const receiverId = url.searchParams.get("receiverId");

  if (!senderId || !receiverId) {
    return NextResponse.json({ error: "Missing senderId or receiverId" }, { status: 400 });
  }
  
  const messages = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId }, // from sender to receiver
        { senderId: receiverId, receiverId: senderId }, // from receiver to sender
      ],
    },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json(messages);
}
