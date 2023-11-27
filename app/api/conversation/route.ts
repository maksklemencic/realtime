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

        // build query. If there is an id, get the conversation with that id. If there is a userId, get all conversations that user is in
        // if there are both, get the conversation with that id if the user is in it
        // if there are neither, get all conversations
        const query = {
            where: {
                id: id ? { equals: id } : undefined,
                userIds: userId ? { has: userId } : undefined,
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
