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
            include: {
                sender: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
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


export async function GET(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const user = context.params.userId;
        if (!user) {
            return new NextResponse('User Id is required', { status: 400 });
        }

        const id = request.nextUrl.searchParams.get('id');
        const conversationId = request.nextUrl.searchParams.get('conversationId');


        const messages = await prisma.conversation.findMany({
            where: {
                id: conversationId ? { equals: conversationId } : undefined,
                userIds: user ? { has: user } : undefined,
            },
            select: {
                messages: {
                    select: {
                        id: true,
                        body: true,
                        sender: {
                            select: {
                                id: true,
                                name: true,
                                image: true,
                                email: true,
                            },
                        },
                        createdAt: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'asc',
            },
        });

        return new NextResponse(JSON.stringify(messages), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch(error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
