import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { userId: string } }) {
  const { userId } = context.params;

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId, 
        },
      },
      select: {
        id: true,
        email: true,
      },
    });

    if (!users) {
      return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error); 
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}