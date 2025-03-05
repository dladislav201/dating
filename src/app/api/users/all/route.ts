import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  try {
    const users = await prisma.user.findMany({
      where: {
        NOT: {
          id: userId
        },
      },
      select: {
        id: true,
        nickName: true
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