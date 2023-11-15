import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
  try {

    if (request.method !== 'GET') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }
    
    const userId = context.params.userId; 
    if (!userId) {
        return new NextResponse('User ID is required', { status: 400 });
    }

    let followingParam = request.nextUrl.searchParams.get('following');
    let following = true;
    if (followingParam === 'false') {
        following = false;
    }

    let whereCondition = {
        authorId: {},
    };

    if (following) {
        const followingUsers = await prisma.follower.findMany({
            where: {
                followerId: userId,
            },
            include: {
                following: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                        email: true,
                    },
                },
            },
        });
    
        const followingIds = followingUsers.map((follow) => follow.following.id);
    
        whereCondition.authorId = {
            in: followingIds,
        } as { in?: string[] };
    }
    
    const posts = await prisma.post.findMany({
        where: whereCondition,
        orderBy: [
            {
                createdAt: 'desc',
            },
        ],
        include: {
            author: {
                select: {
                    name: true,
                    image: true,
                    email: true,
                },
            },
            
        },
    });
            
    return new NextResponse(JSON.stringify(posts), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });

  }
  catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}