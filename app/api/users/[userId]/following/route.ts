import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
  try {

    if (request.method !== 'GET') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }
    
    const userId = context.params.userId; 
    
    const follows = await prisma.follower.findMany({
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

    const followers = follows.map((follow) => ({
        id: follow.following.id,
        name: follow.following.name,
        image: follow.following.image,
        email: follow.following.email,
    }));

    return NextResponse.json(followers);


  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}