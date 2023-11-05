import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function GET(request: NextRequest, context: { params: { userId: string } }) {
  try {

    if (request.method !== 'GET') {
        return new NextResponse('Method Not Allowed', { status: 405 });
    }
    
    const userId = context.params.userId; 
    
    const followers = await prisma.follower.findMany({
        where: {
            followingId: userId,
        },
        include: {
            follower: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    email: true,
                },
            },
        },
    });

    const followers2 = followers.map((follow) => ({
        id: follow.follower.id,
        name: follow.follower.name,
        image: follow.follower.image,
        email: follow.follower.email,
    }));

    return NextResponse.json(followers2);


  } catch (error) {
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}