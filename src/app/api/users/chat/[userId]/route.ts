import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request, context: { params: { userId: string } }) {
    const { userId } = context.params;

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
        
        const usersMap = new Map<string, { id: string; email: string }>();

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
