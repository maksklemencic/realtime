import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest, context: { params: { userId: string } }) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const userId = context.params.userId;
        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const body = await request.json();

        if (!body.name) {
            return new NextResponse('Name of the group is required', { status: 400 });
        }

        if (!body.userIds) {
            return new NextResponse('UserIds array is required', { status: 400 });
        }

        const colors = [
            'bg-red-500',
            'bg-yellow-500',
            'bg-green-500',
            'bg-blue-500',
            'bg-indigo-500',
            'bg-purple-500',
            'bg-pink-500',
        ];

        // Create a new group using Prisma
        
        const newGroup = await prisma.group.create({
            data: {
                name: body.name,
                image: body.image ?? colors[Math.floor(Math.random() * colors.length)],
                userIds: {
                    set: body.userIds,
                },
                adminId: userId,
            },
        });
 

        return new NextResponse(JSON.stringify(newGroup), { status: 201, headers: { 'Content-Type': 'application/json' } });


    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

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

        // if (!body.name) {
        //     return new NextResponse('Name of the group is required', { status: 400 });
        // }

        // if (!body.userIds) {
        //     return new NextResponse('UserIds array is required', { status: 400 });
        // }

        const group = await prisma.group.findFirst({
            where: {
                id: body.groupId,
            },
        });

        if (!group) {
            return new NextResponse('Group not found', { status: 404 });
        }

        if (group.adminId != null && group.adminId !== userId) {
            return new NextResponse('You are not the admin of this group', { status: 401 });
        }

        const updatedGroup = await prisma.group.update({
            where: {
                id: body.groupId,
            },
            data: {
                name: body.name ?? group.name,
                image: body.image ?? group.image,
                userIds: {
                    set: body.userIds ?? group.userIds,
                },
            },
        });

        return new NextResponse(JSON.stringify(updatedGroup), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
    try {
        const userId = context.params.userId;
        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const includeUserData = request.nextUrl.searchParams.get('includeUserData');
        let includeUsers = false;
        if (includeUserData === 'true') {
            includeUsers = true;
        }

        const groups = await prisma.group.findMany({
            where: {
                userIds: {
                    has: userId,
                },
            },
            orderBy: [
                {
                    createdAt: 'desc',
                },
            ],
            include: {
                users: includeUsers,
            },
        });

        return new NextResponse(JSON.stringify(groups), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest, context: { params: { userId: string } }) {
    try {

        const userId = context.params.userId;
        if (!userId) {
            return new NextResponse('User ID is required', { status: 400 });
        }

        const groupId = request.nextUrl.searchParams.get('groupId');
        if (!groupId) {
            return new NextResponse('Group ID is required', { status: 400 });
        }

        const group = await prisma.group.findFirst({
            where: {
                id: groupId,
                adminId: userId,
            },
        });

        if (!group) {
            return new NextResponse('Group not found', { status: 404 });
        }

        await prisma.group.delete({
            where: {
                id: groupId,
            },
        });

        return new NextResponse(null, { status: 204 });

    }
    catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}