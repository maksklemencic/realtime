import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const userFrom = context.params.userId;
        if (!userFrom) {
            return new NextResponse('Sender Id is required', { status: 400 });
        }

        const body = await request.json();
        if (!body.body) {
            return new NextResponse('Message body is required', { status: 400 });
        }
        if (!body.conversationId) {
            return new NextResponse('Conversation id is required', { status: 400 });
        }

        const newMessage = await prisma.message.create({
            data: {
                body: body.body,
                conversation: {
                    connect: {
                        id: body.conversationId,
                    },
                },
                sender: {
                    connect: {
                        id: userFrom,
                    },
                },

            },
        });

        await prisma.conversation.update({
            where: { id: body.conversationId },
            data: {
              messagesIds: [newMessage.id],
            },
          });

        return new NextResponse(JSON.stringify(newMessage), { status: 201, headers: { 'Content-Type': 'application/json' } });

    }
    catch(error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}