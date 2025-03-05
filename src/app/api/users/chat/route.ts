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
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    { senderId: userId },
                    { receiverId: userId },
                ],
            },
            include: {
                sender: true,
                receiver: true,
            },
            distinct: ['senderId', 'receiverId'],
                orderBy: {
                createdAt: "desc", 
            },
        });
        
        const usersMap = new Map<string, { id: string; nickName: string }>();

        messages.forEach((message) => {
            const otherUser = message.senderId === userId ? message.receiver : message.sender;

            if (otherUser.id !== userId) {
                usersMap.set(otherUser.id, otherUser);
            }
        });

        const uniqueUsers = Array.from(usersMap.values());

        return NextResponse.json(uniqueUsers); 
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
