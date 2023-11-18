import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (request.method !== 'PUT') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const userId = context.params.userId;
        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const body = await request.json();
        if (!body.groupId) {
            return new NextResponse('Group ID is required', { status: 400 });
        }

        // add user to users array in a group
        const newGroup = await prisma.group.update({
            where: {
                id: body.groupId,
            },
            data: {
                users: {
                    connect: {
                        id: userId,
                    },
                },
            },
            include: {
                users: true,
            },
        });


        return new NextResponse(JSON.stringify(newGroup), { status: 201, headers: { 'Content-Type': 'application/json' } });


    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}