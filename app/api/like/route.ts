import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json() as { userId: number; postId: number };

        if (!body.userId || !body.postId) {
            return new NextResponse('UserId and PostId are required', { status: 400 });
        }

        const newLike = await prisma.like.create({
            data: {
                user: { connect: { id: body.userId.toString() } },
                likedPost: { connect: { id: body.postId.toString() } },
            }
        });

        return new NextResponse(JSON.stringify(newLike), { status: 201, headers: { 'Content-Type': 'application/json' } });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function DELETE(request: NextRequest) {
    try {
        if (request.method !== 'DELETE') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const userIdParam = request.nextUrl.searchParams.get('userId');
        const postIdParam = request.nextUrl.searchParams.get('postId');

        if (!userIdParam || !postIdParam) {
            return new NextResponse('UserId and PostId are required', { status: 400 });
        }

        const deletedLike = await prisma.like.deleteMany({
            where: {
                userId: userIdParam,
                likedPostId: postIdParam,
            },
        });

        return new NextResponse(JSON.stringify(deletedLike), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

export async function GET(request: NextRequest) {
    try {
        const userId = request.nextUrl.searchParams.get('userId');
        const postId = request.nextUrl.searchParams.get('postId');

        const likes = await prisma.like.findMany({
            where: {
                userId: {
                    equals: userId ?? undefined,
                },
                likedPostId: {
                    equals: postId ?? undefined,
                },
            },
            
        });

        return new NextResponse(JSON.stringify(likes), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}