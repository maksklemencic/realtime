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
                users: {
                    connect: {
                        id: userId,
                    },
                },
                image: body.image ?? colors[Math.floor(Math.random() * colors.length)],
            },
        });

        return new NextResponse(JSON.stringify(newGroup), { status: 201, headers: { 'Content-Type': 'application/json' } });


    } catch (error) {
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
        });

        return new NextResponse(JSON.stringify(groups), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}