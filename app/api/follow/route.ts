import { Prisma, PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';
import { useSearchParams } from 'next/navigation'


const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        if (request.method !== 'POST') {
            return new NextResponse('Method Not Allowed', { status: 405 });
        }

        const body = await request.json();

        if (!body.followerId || !body.followingId) {
            return new NextResponse('Bad Request: FollowerId and FollowingId are required', { status: 400 });
        }

        const { followerId, followingId } = body;

        const newFollower = await prisma.follower.create({
            data: {
                followerId: followerId,
                followingId: followingId,
            },
        });

        return new NextResponse(JSON.stringify(newFollower), { status: 201, headers: { 'Content-Type': 'application/json' }});

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

        const followerIdParam = request.nextUrl.searchParams.get('followerId');
        const followingIdParam = request.nextUrl.searchParams.get('followingId');


        if (!followerIdParam || !followingIdParam) {
            return new NextResponse('Bad Request: FollowerId and FollowingId are required', { status: 400 });
        }


        const deletedFollower = await prisma.follower.deleteMany({
            where: {
                followerId: followerIdParam,
                followingId: followingIdParam,
            },
        });

        return new NextResponse(JSON.stringify(deletedFollower), { status: 200, headers: { 'Content-Type': 'application/json' }});

    } catch (error) {
        console.error(error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}