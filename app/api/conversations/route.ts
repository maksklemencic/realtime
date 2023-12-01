import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {

        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json();

        if (!body.name) {
            return new NextResponse('Name of the conversation is required', { status: 400 });
        }
        if (!body.userIds) {
            return new NextResponse('UserIds array is required', { status: 400 });
        }


        const newConversation = await prisma.conversation.create({
            data: {
                name: body.name,
                userIds: {
                    set: body.userIds,
                },
                isGroup: body.isGroup ?? false,
                isPinnedUserIds: {
                    set: body.isPinnedUserIds ?? [],
                },
            },
        });

        return new NextResponse(JSON.stringify(newConversation), { status: 201, headers: { 'Content-Type': 'application/json' } });


    }
    catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        if (request.method !== 'GET') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const id = request.nextUrl.searchParams.get('id');
        const userId = request.nextUrl.searchParams.get('userId');

        const query = {
            where: {
                id: id ? { equals: id } : undefined,
                userIds: userId ? { has: userId } : undefined,
            },
            include: {
                messages: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },

        };
       


        const conversations = await prisma.conversation.findMany(
            query
        );

        return new NextResponse(JSON.stringify(conversations), { status: 200, headers: { 'Content-Type': 'application/json' } });

    }
    catch {
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}


export async function PUT(request: NextRequest) {
    try {
        if (request.method !== 'PUT') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json();

        if (!body.id) {
            return new NextResponse('Id of the conversation is required', { status: 400 });
        }

        // build data based on what is passed in the body
        const data: any = {};
        if (body.name) {
            data.name = body.name;
        }
        if (body.userIds) {
            data.userIds = {
                set: body.userIds,
            };
        }
        if (body.isGroup) {
            data.isGroup = body.isGroup;
        }
        if (body.messagesIds) {
            data.messagesIds = {
                set: body.messagesIds,
            };
        }
        if (body.isPinned) {
            data.isPinnedUserIds = {
                set: body.isPinned,
            };
        }
        

        const updatedConversation = await prisma.conversation.update({
            where: { id: body.id },
            data: data,
            include: {
                messages: true,
                users: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });

        return new NextResponse(JSON.stringify(updatedConversation), { status: 200, headers: { 'Content-Type': 'application/json' } });

    }
    catch(error) {
        return new NextResponse('Internal Server Error' + error, { status: 500 });
    }
}