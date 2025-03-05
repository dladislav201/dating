import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/authOptions";

const prisma = new PrismaClient();

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;
  const { email, nickName, password } = await req.json();

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const updatedData: any = {};

    if (nickName && nickName !== user.nickName) {
      const existingNickName = await prisma.user.findUnique({
        where: { nickName },
      });

      if (existingNickName) {
        return NextResponse.json(
          { error: "This nickname is already taken" },
          { status: 400 }
        );
      }

      updatedData.nickName = nickName;
    }

    if (email && email !== user.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email },
      });

      if (existingEmail) {
        return NextResponse.json(
          { error: "This email is already in use" },
          { status: 400 }
        );
      }

      updatedData.email = email;
    }

    let hashedPassword;
    if (password && password !== user.password) {
      hashedPassword = await bcrypt.hash(password, 10);
      updatedData.password = hashedPassword;
    }

    if (Object.keys(updatedData).length === 0) {
      return NextResponse.json(
        { message: "No data to update" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updatedData,
    });

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
